import dotenv from "dotenv";
dotenv.config({ path: ".env" }); // change to .env.local if that's what you use

const { refreshProductsJson } = await import("../lib/printifySync.js");

// run once and exit if you only want a single pass for debugging
const ONCE = process.env.WORKER_ONCE === "true";
const EVERY_HOUR_MS = Number(process.env.WORKER_INTERVAL_MS || 60 * 60 * 1000);

let ticking = false;

async function runOnce(tag = "startup") {
	if (ticking) return;
	ticking = true;
	const t0 = Date.now();
	try {
		console.log(`[${tag}] starting…`);
		const res = await refreshProductsJson();
		console.log(`[${tag}] ok`, res);
	} catch (e) {
		console.error(`[${tag}] failed:`, e?.message || e);
	} finally {
		console.log(`[${tag}] took ${Math.round(Date.now() - t0)} ms`);
		ticking = false;
	}
}

async function main() {
	await runOnce("startup");
	if (ONCE) return; // exit after a single run (debug mode)
	const timer = setInterval(() => runOnce("interval"), EVERY_HOUR_MS);

	const stop = () => {
		clearInterval(timer);
		process.exit(0);
	};
	process.on("SIGINT", stop);
	process.on("SIGTERM", stop);
}

main();
