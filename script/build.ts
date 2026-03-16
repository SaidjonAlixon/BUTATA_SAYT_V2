import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, readFile } from "fs/promises";
import { join } from "path";

// server deps to bundle to reduce openat(2) syscalls
// which helps cold start times
const allowlist = [
  "@google/generative-ai",
  "axios",
  "connect-pg-simple",
  "cors",
  "date-fns",
  "drizzle-orm",
  "drizzle-zod",
  "express",
  "express-rate-limit",
  "express-session",
  "jsonwebtoken",
  "memorystore",
  "nanoid",
  "nodemailer",
  "openai",
  "passport",
  "passport-local",
  "pg",
  "stripe",
  "uuid",
  "ws",
  "xlsx",
  "zod",
  "zod-validation-error",
];

async function buildAll() {
  await rm("dist", { recursive: true, force: true });

  console.log("building client...");
  await viteBuild();

  console.log("building server...");
  const pkg = JSON.parse(await readFile("package.json", "utf-8"));
  const allDeps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];
  const externals = allDeps.filter((dep) => !allowlist.includes(dep));

  await esbuild({
    entryPoints: ["server/index.ts"],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: "dist/index.cjs",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: true,
    external: externals,
    logLevel: "info",
  });

  // Vercel uses api/index.ts directly (TypeScript) – no pre-build needed

  // api/admin/login – standalone handler (POST + JSON)
  console.log("building api/admin/login...");
  const { mkdir } = await import("fs/promises");
  await mkdir(join(process.cwd(), "api", "admin"), { recursive: true });
  await esbuild({
    entryPoints: [join(process.cwd(), "script", "admin-login.ts")],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: join(process.cwd(), "api", "admin", "login.js"),
    define: { "process.env.NODE_ENV": '"production"' },
    minify: true,
    external: ["@vercel/node"],
    logLevel: "info",
  });

}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
