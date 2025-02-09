
import { NextApiRequest, NextApiResponse } from 'next';
import { getAgent } from './server';
import { HumanMessage } from '@langchain/core/messages';

export const config = {
  api: {
    bodyParser: true,
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

    const responses = [];
    for await (const chunk of stream) {
      if ("agent" in chunk) {
        responses.push({
          type: "agent",
          content: chunk.agent.messages[0].content
        });
      } else if ("tools" in chunk) {
        responses.push({
          type: "tools",
          content: chunk.tools.messages[0].content
        });
      }
    }

    res.status(200).json({ responses });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
