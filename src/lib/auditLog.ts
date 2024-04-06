/* eslint-disable no-console */

import { PangeaConfig, AuditService, PangeaErrors } from "pangea-node-sdk";

export default async function auditLog({
    message,
    actor,
    user_id,
    session_id
}: any) {
  if(process.env.PANGEA_TOKEN) {
    const token = process.env.PANGEA_TOKEN as string;
    const config = new PangeaConfig(process.env.PANGEA_AUDIT_CONFIG_ID != "" ? { domain: process.env.PANGEA_DOMAIN, configID: process.env.PANGEA_AUDIT_CONFIG_ID } :  { domain: process.env.PANGEA_DOMAIN });
    const audit = new AuditService(token, config);

    const data = {
      "message": message,
      "action": `${actor} sent a message`,
      "actor": user_id,
      "timestamp": new Date(Date.now()).toISOString(),
      "source": session_id
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
  } else {
    return false;
  }
}