import { NextApiRequest, NextApiResponse } from 'next';
import { getAgent } from './server';
import { HumanMessage } from '@langchain/core/messages';

export const config = {
  api: {
    bodyParser: true,
    responseLimit: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const { agent, config } = await getAgent();
    const stream = await agent.stream(
      { messages: [new HumanMessage(message)] },
      config
    );

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    for await (const chunk of stream) {
      if ("agent" in chunk) {
        res.write(`data: ${JSON.stringify({
          type: "agent",
          content: chunk.agent.messages[0].content
        })}\n\n`);
      } else if ("tools" in chunk) {
        res.write(`data: ${JSON.stringify({
          type: "tools",
          content: chunk.tools.messages[0].content
        })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}