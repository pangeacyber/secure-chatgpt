import { PangeaConfig, RedactService } from "pangea-node-sdk";

const token = process.env.PANGEA_REDACT_TOKEN as string;
const config = new PangeaConfig({ domain: process.env.PANGEA_DOMAIN });
const redact = new RedactService(token, config);

export default async function redactText(inputText: string) {
    const response = await redact.redact(inputText);

    if (response.success) {
        return response.result.redacted_text;
    } else {
        // If error return input text
        console.log("Error", response.status, response.result);
        return inputText;
    }
}
