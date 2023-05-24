import { NextRequestWithAuth, withAPIAuthentication } from "../../../utils";
import { redact } from "../../../utils/pangea";

const handler = async (req: NextRequestWithAuth) => {
  const body = await req.json();
  const prompt = body?.prompt?.trim() || "";

  if (prompt.length === 0) {
    return new Response("Please enter a valid prompt", { status: 400 });
  }

  try {
    const redactResponse = await redact.redact(prompt);
    const processedPrompt = redactResponse?.result?.redacted_text || "";

    return new Response(
      JSON.stringify({ prompt: processedPrompt }),
      {
        headers: { "content-type": "application/json" },
      }
    );
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      return new Response("An error occurred during your request.", {
        status: 400,
      });
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      return new Response("An error occurred during your request.", {
        status: 500,
      });
    }
  }
};

export const POST = withAPIAuthentication(handler);
