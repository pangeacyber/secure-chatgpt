import {
  NextRequestWithAuth,
  withAPIAuthentication,
} from "../../../../utils";

const shouldRedact = process.env.OPTIONS_REDACT_USER_PROMPTS === "true";
const shouldAudit = process.env.OPTIONS_AUDIT_USER_PROMPTS === "true";
const shouldThreatAnalyse =
  process.env.OPTIONS_THREAT_ANALYSE_SERVICE_RESPONSES === "true";

const handler = async (req: NextRequestWithAuth) => {
  return new Response(
    JSON.stringify({
      audit: shouldAudit,
      redact: shouldRedact,
      threatAnalysis: shouldThreatAnalyse,
    }),
    {
      headers: { "content-type": "application/json" },
    }
  );
};

export const GET = withAPIAuthentication(handler);
