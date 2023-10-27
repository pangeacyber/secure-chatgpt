import { PangeaConfig, RedactService } from "pangea-node-sdk";

export default async function redactText(inputText: string) {
    if(process.env.PANGEA_TOKEN) {
        const token = process.env.PANGEA_TOKEN as string;
        const config = new PangeaConfig({ domain: process.env.PANGEA_DOMAIN });
        const redact = new RedactService(token, config);

        const response = await redact.redact(inputText);

        if (response.success) {
            return response.result.redacted_text;
        } else {
            // If error return input text
            console.log("Error", response.status, response.result);
            return inputText;
        }
    } else {
        return false;
    }
}
