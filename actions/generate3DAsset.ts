import { 
  customActionProvider, 
  WalletProvider 
} from "@coinbase/agentkit";
import { z } from "zod";
import axios from "axios";

// Define the schema for the text-to-3d action
const TextTo3DSchema = z.object({
  prompt: z.string().describe("Text description of the 3D model to generate"),
  artStyle: z.string().optional().describe("Optional art style for the 3D model (e.g., 'realistic', 'cartoon')"),
  negativePrompt: z.string().optional().describe("Optional negative prompt to exclude certain characteristics"),
});

// Create the Meshy text-to-3d action provider
export const generate3DAsset = customActionProvider<WalletProvider>({
  name: "generate_3d_model",
  description: "Generate a 3D model from a text prompt using Meshy.ai",
  schema: TextTo3DSchema,

  invoke: async (_, args: z.infer<typeof TextTo3DSchema>) => {
    // Ensure API key is set
    const apiKey = process.env.MESHY_API_KEY;
    if (!apiKey) {
      return "Error: MESHY_API_KEY environment variable is not set";
    }

    try {
      // 1. Create preview task
      const generatePreviewRequest = {
        mode: "preview",
        prompt: args.prompt,
        negative_prompt: args.negativePrompt || "low quality, low resolution, low poly, ugly",
        art_style: args.artStyle || "realistic",
        should_remesh: true,
      };

      const generatePreviewResponse = await axios.post(
        "https://api.meshy.ai/openapi/v2/text-to-3d",
        generatePreviewRequest,
        {
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          }
        }
      );

      const previewTaskId = generatePreviewResponse.data.result;

      // 2. Poll for task completion
      let previewTask;
      const maxAttempts = 60; // 5 minutes max (5s * 60)
      for (let i = 0; i < maxAttempts; i++) {
        const previewTaskResponse = await axios.get(
          `https://api.meshy.ai/openapi/v2/text-to-3d/${previewTaskId}`,
          {
            headers: {
              "Authorization": `Bearer ${apiKey}`
            }
          }
        );

        previewTask = previewTaskResponse.data;

        if (previewTask.status === "SUCCEEDED") {
          break;
        }

        if (previewTask.status === "FAILED") {
          return `3D model generation failed: ${previewTask.error_message || "Unknown error"}`;
        }

        // Wait 5 seconds before next poll
        await new Promise(resolve => setTimeout(resolve, 5000));
      }

      // Check if task timed out
      if (previewTask.status !== "SUCCEEDED") {
        return "3D model generation timed out. Please try again.";
      }

      // 3. Return model information
      return JSON.stringify({
        taskId: previewTaskId,
        modelUrls: previewTask.model_urls,
        status: previewTask.status
      }, null, 2);

    } catch (error) {
      console.error("Error in Meshy 3D model generation:", error);

      if (axios.isAxiosError(error)) {
        return `API Error: ${error.response?.data?.message || error.message}`;
      }

      return "An unexpected error occurred during 3D model generation";
    }
  }
});