
import { initializeAgent } from '../../chatbot';

// Initialize agent once and export for use across API endpoints
export const getAgent = async () => {
  try {
    const { agent, config } = await initializeAgent();
    return { agent, config };
  } catch (error) {
    console.error('Failed to initialize agent:', error);
    throw error;
  }
};
