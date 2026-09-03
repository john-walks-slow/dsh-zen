/**
 * Build script for dsh-zen-tracker.
 * Bundles src/client.ts into the DSH browser module format:
 *   window.__ModuleLoader__.load({ id, factory })
 *
 * Also copies src/index.ts → lib/index.js (host-side empty apply).
 *
 * Usage: node build.mjs
 */
import { build } from "esbuild";
import { readFile, writeFile, mkdir, cp, rm } from "node:fs/promises";
import { existsSync } from "node:fs";

const PKG_NAME = "dsh-zen-tracker";

// ── Build client bundle ──────────────────────────────────────────────────────
const clientResult = await build({
	entryPoints: ["src/client.ts"],
	bundle: true,
	format: "cjs",
	target: "es2022",
	platform: "browser",
	write: false,
	minify: false,
	external: [
		"react",
		"react/jsx-runtime",
		"react-dom",
		"@deepseek-ai/*",
	],
});

const clientCode = clientResult.outputFiles[0].text;

// Wrap in the DSH module loader format
const clientOutput = `window.__ModuleLoader__.load({
	id: "${PKG_NAME}",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		${clientCode}
		return module.exports;
	}
});
`;

await mkdir("lib", { recursive: true });
await writeFile("lib/client.js", clientOutput, "utf8");
console.log("✓ Built lib/client.js");

// ── Build host entry ──────────────────────────────────────────────────────────
const hostResult = await build({
	entryPoints: ["src/index.ts"],
	bundle: true,
	format: "esm",
	target: "es2022",
	platform: "node",
	write: false,
	minify: false,
});

await writeFile("lib/index.js", hostResult.outputFiles[0].text, "utf8");
console.log("✓ Built lib/index.js");

// ── Deploy to DSH profile node_modules ───────────────────────────────────────
// Resolve the DSH home from $DSH_HOME (or the default ~/.dsh), then deploy into
// the "web" profile. No machine-specific absolute paths in the repo.
import { homedir } from "node:os";
import { join } from "node:path";

const dshHome = process.env.DSH_HOME || join(homedir(), ".dsh");
const DEPLOY_DIR = join(dshHome, "profiles", "web", "node_modules", PKG_NAME);

if (existsSync(DEPLOY_DIR)) {
	try { await rm(DEPLOY_DIR, { recursive: true, force: true }); } catch {}
}

await mkdir(DEPLOY_DIR, { recursive: true });
await cp("lib", `${DEPLOY_DIR}\\lib`, { recursive: true });
await cp("assets", `${DEPLOY_DIR}\\assets`, { recursive: true });
await cp("package.json", `${DEPLOY_DIR}\\package.json`);
await cp("cordis.patch.yml", `${DEPLOY_DIR}\\cordis.patch.yml`);
console.log("✓ Deployed to profile node_modules");

console.log("\nBuild complete.");
