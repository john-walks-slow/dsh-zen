/**
 * Host half: serve the pet spritesheet through a fixed route.
 * @module dsh-zen-tracker
 */
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const ATLAS_PATH = fileURLToPath(new URL("../assets/spritesheet.webp", import.meta.url));

const name = "zen-tracker";
const inject = ["webServer"];

function apply(ctx: any) {
	const route = {
		kind: "exact",
		path: "/dsh-zen-tracker/spritesheet.webp",
		handler: async (req: any, res: any) => {
			if (req.method !== "GET" && req.method !== "HEAD") {
				res.writeHead(405, { allow: "GET, HEAD" });
				res.end();
				return;
			}
			const body = await readFile(ATLAS_PATH);
			res.writeHead(200, {
				"cache-control": "public, max-age=3600, immutable",
				"content-length": String(body.byteLength),
				"content-type": "image/webp",
			});
			res.end(req.method === "HEAD" ? undefined : body);
		},
	};
	ctx.effect(() => ctx.webServer.register(route), "zen-tracker: spritesheet route");
}

export { apply, inject, name };
