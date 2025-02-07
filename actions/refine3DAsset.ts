import { customActionProvider, WalletProvider } from "@coinbase/agentkit";
import { z } from "zod";
import axios from "axios";

// Define the schema for the 3D model refinement action
const Refine3DModelSchema = z.object({
  previewTaskId: z
    .string()
    .describe("The task ID of the preview model to be refined"),
  prompt: z
    .string()
    .optional()
    .describe("Optional additional description to guide refinement"),
});

// Create the Meshy text-to-3d refinement action provider
export const refine3DAsset = customActionProvider<WalletProvider>({
  name: "refine_3d_model",
  description: "Refine a previously generated 3D model using Meshy.ai",
  schema: Refine3DModelSchema,

  invoke: async (_, args: z.infer<typeof Refine3DModelSchema>) => {
    // Ensure API key is set
    const apiKey = process.env.MESHY_API_KEY;
    if (!apiKey) {
      return "Error: MESHY_API_KEY environment variable is not set";
    }

    try {
      // 1. Create refined task
      const generateRefinedRequest = {
        mode: "refine",
        preview_task_id: args.previewTaskId,
        ...(args.prompt && { prompt: args.prompt }), // Optional additional prompt
      };

      const generateRefinedResponse = await axios.post(
        "https://api.meshy.ai/openapi/v2/text-to-3d",
        generateRefinedRequest,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        },
      );

      const refinedTaskId = generateRefinedResponse.data.result;

      // 2. Poll for task completion
      let refinedTask;
      const maxAttempts = 120; // 10 minutes max (5s * 120)
      for (let i = 0; i < maxAttempts; i++) {
        const refinedTaskResponse = await axios.get(
          `https://api.meshy.ai/openapi/v2/text-to-3d/${refinedTaskId}`,
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
          },
        );

        refinedTask = refinedTaskResponse.data;

        if (refinedTask.status === "SUCCEEDED") {
          break;
        }

        if (refinedTask.status === "FAILED") {
          return `3D model refinement failed: ${refinedTask.error_message || "Unknown error"}`;
        }

        // Wait 5 seconds before next poll
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }

      // Check if task timed out
      if (refinedTask.status !== "SUCCEEDED") {
        return "3D model refinement timed out. Please try again.";
      }

      // 3. Return refined model information
      return JSON.stringify(
        {
          taskId: refinedTaskId,
          originalPreviewTaskId: args.previewTaskId,
          modelUrls: refinedTask.model_urls,
          status: refinedTask.status,
        },
        null,
        2,
      );
    } catch (error) {
      console.error("Error in Meshy 3D model refinement:", error);

      if (axios.isAxiosError(error)) {
        return `API Error: ${error.response?.data?.message || error.message}`;
      }

      return "An unexpected error occurred during 3D model refinement";
    }
  },
});
