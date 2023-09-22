/* eslint-disable no-console */

import { PangeaConfig, AuditService, PangeaErrors } from "pangea-node-sdk";

const token = process.env.PANGEA_REDACT_TOKEN as string;
const config = new PangeaConfig({ domain: process.env.PANGEA_DOMAIN });
const audit = new AuditService(token, config);

export default async function auditLog({
    message,
    actor,
    user_id,
    session_id
}: any) {

  const data = {
    "message": message,
    "actor": actor,
    "user_id": user_id,
    "timestamp": new Date(Date.now()).toISOString(),
    "session_id": session_id
  };

  try {
    const logResponse = await audit.log(data, { verbose: true });
    console.log("Response: %s", logResponse.result);
  } catch (err) {
    if (err instanceof PangeaErrors.APIError) {
      console.log(err.summary, err.pangeaResponse);
    } else {
      throw err;
    }
  }
}