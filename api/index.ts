/**
 * Vercel serverless function entry – forwards all /api/* to Express.
 * Re-exports from script/api-index.ts so Vercel can find this source file.
 */
export { default, config } from "../script/api-index";
