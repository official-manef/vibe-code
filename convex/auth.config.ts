import type { AuthConfig } from "convex/server";

const domain = process.env.AUTH_ISSUER_URL;
const applicationID = process.env.AUTH_APPLICATION_ID;

export default {
  providers: domain && applicationID ? [{ domain, applicationID }] : [],
} satisfies AuthConfig;
