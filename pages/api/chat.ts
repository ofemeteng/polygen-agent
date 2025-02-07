
import { NextRequest } from 'next/server';
import { initializeAgent } from '../../chatbot';
import { HumanMessage } from '@langchain/core/messages';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextRequest) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { message } = await req.json();
    
    if (!message) {
      return new Response('Message is required', { status: 400 });
    }

    const { agent, config } = await initializeAgent();
    const stream = await agent.stream(
      { messages: [new HumanMessage(message)] },
      config
    );

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if ("agent" in chunk) {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({
                    type: "agent",
                    content: chunk.agent.messages[0].content
                  })}\n\n`
                )
              );
            } else if ("tools" in chunk) {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({
                    type: "tools",
                    content: chunk.tools.messages[0].content
                  })}\n\n`
                )
              );
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "error",
                content: error instanceof Error ? error.message : 'Unknown error'
              })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
