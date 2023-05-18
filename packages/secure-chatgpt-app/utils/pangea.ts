import {
  PangeaConfig,
  AuditService,
  RedactService,
  AuthNService,
  DomainIntelService,
  URLIntelService,
} from "pangea-node-sdk";

const domain = process.env.NEXT_PUBLIC_PANGEA_DOMAIN;
const token = process.env.PANGEA_SERVICE_TOKEN;

export const config = new PangeaConfig({ domain: domain });

// Audit service client
export const audit = new AuditService(token, config);

// Redact service client
export const redact = new RedactService(token, config);

// Auth service client
export const authN = new AuthNService(token, config);

// Domain Intel service client
export const domainIntel = new DomainIntelService(token, config);

// URL Intel service client
export const urlIntel = new URLIntelService(token, config);
