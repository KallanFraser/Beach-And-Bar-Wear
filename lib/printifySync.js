import fs from "fs";
import path from "path";

const BASE_URL = "https://api.printify.com/v1";
const PUBLIC_DIR = path.resolve(process.cwd(), "public");
const IMAGES_DIR = path.join(PUBLIC_DIR, "images");
const DATA_DIR = path.join(PUBLIC_DIR, "data");
const DATA_FILE = path.join(DATA_DIR, "products.json");

// ----- NIGHT LIST (exact titles you gave, normalized) -----
const NIGHT_TITLES_RAW = [
	"Beach And Bar Wear - Oversized Loose Dj Tee - Summer Essentials - Caves",
	"Beach And Bar Wear - Oversized Loose DJ Tee - Summer Essentials - Palms On Fire",
	"Beach And Bar Wear - Oversized Loose DJ Tee - Summer Essentials - Classic Essential Black",
	"Beach And Bar Wear - Oversized Loose DJ Tee - Summer Essentials - These Eyes See",
	"Beach And Bar Wear - Oversized Loose DJ Tee - Summer Essentials - From Dusk Til Dawn",
	"Beach And Bar Wear - Oversized Loose DJ Tee - Summer Essentials - Smoke And Sweat",
	"Beach and Bar Wear - Oversized Boxy Tee - Summer Essentials - Club Essential",
	"Beach And Bar Wear - Oversized Boxy Tee - Summer Essentials - Eyes Up",
	"Beach And Bar Wear - Oversized Boxy Tee - Summer Essentials - C'est La Vie",
	"Beach And Bar Wear - Oversized Boxy Tee - Summer Essentials - From Dusk Til Dawn",
	"Beach and Bar Wear - Boxy Oversized Fit - Summer Essentials - Sweat & Smoke",
	"Beach And Bar Wear - Oversized Boxy Fit - Summer Essentials - Service Suspended",
];
const norm = (s) =>
	String(s || "")
		.toLowerCase()
		.replace(/\s+/g, " ")
		.trim();
const NIGHT_TITLES = new Set(NIGHT_TITLES_RAW.map(norm));

// ---- helpers
function ensureDir(dir) {
	if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}
function atomicWriteJson(filePath, json) {
	const tmp = `${filePath}.tmp`;
	fs.writeFileSync(tmp, JSON.stringify(json, null, 2), "utf8");
	fs.renameSync(tmp, filePath);
}
function extractSize(title) {
	const m = title?.match(/\b(?:5XL|4XL|3XL|2XL|XL|XS|L|M|S)\b/);
	return m ? m[0] : title;
}
function parseProducts(data) {
	const allowed = new Set(["S", "M", "L", "XL"]);
	if (!Array.isArray(data)) return [];
	return data.map(({ id, title, variants = [], images = [], visible }) => {
		const filteredVariants = variants
			.filter((v) => v.is_enabled)
			.map((v) => ({
				variant_sku: v.sku,
				variant_ID: v.id,
				variant_price: v.price / 100,
				variant_cost: v.cost / 100,
				variant_title: extractSize(v.title),
				variant_availability: Boolean(v.is_available),
			}))
			.filter((v) => allowed.has(v.variant_title));

		const enabledVariantIds = new Set(filteredVariants.map((v) => v.variant_ID));
		const matchedImages = images
			.filter((img) => img.variant_ids?.some((vid) => enabledVariantIds.has(vid)))
			.map((img) => ({
				src: img.src,
				is_selected: /[?&]camera_label=(?:front|back)(?=$|&)/.test(img.src),
				is_back: /[?&]camera_label=back(?=$|&)/.test(img.src),
			}));

		return { id, title, visible, variants: filteredVariants, images: matchedImages };
	});
}

// ---- fetch with timeout
async function fetchWithTimeout(url, opts = {}, ms = 20000) {
	const controller = new AbortController();
	const t = setTimeout(() => controller.abort(), ms);
	try {
		const res = await fetch(url, { ...opts, signal: controller.signal });
		return res;
	} finally {
		clearTimeout(t);
	}
}

async function printifyGet(p) {
	const PRINTIFY_TOKEN = process.env.printifyAccessToken;
	if (!PRINTIFY_TOKEN) throw new Error("Missing printifyAccessToken");
	const url = `${BASE_URL}${p}`;
	console.log(`→ GET ${url}`);
	const res = await fetchWithTimeout(
		url,
		{
			headers: {
				Authorization: `Bearer ${PRINTIFY_TOKEN}`,
				"Content-Type": "application/json",
			},
			cache: "no-store",
		},
		20000
	);
	if (!res.ok) {
		const text = await res.text().catch(() => "");
		throw new Error(`Printify ${p} failed: ${res.status} ${text}`);
	}
	return res.json();
}

async function downloadToPublic(imageURL, productId, index) {
	const res = await fetchWithTimeout(imageURL, { cache: "no-store" }, 30000);
	if (!res.ok) throw new Error(`img ${imageURL} ${res.status}`);
	const ab = await res.arrayBuffer();

	const ext = new URL(imageURL).pathname.match(/\.\w+$/)?.[0] ?? ".jpg";
	const filename = `${productId}_${index}${ext}`;
	const filepath = path.join(IMAGES_DIR, filename);
	fs.writeFileSync(filepath, Buffer.from(ab));
	return `/images/${filename}`;
}

// ---- tiny semaphore for bounded parallelism
function pLimit(concurrency) {
	let active = 0;
	const queue = [];
	const next = () => {
		active--;
		if (queue.length) queue.shift()();
	};
	return (fn) =>
		new Promise((resolve, reject) => {
			const run = () => {
				active++;
				fn().then(
					(v) => {
						resolve(v);
						next();
					},
					(e) => {
						reject(e);
						next();
					}
				);
			};
			if (active < concurrency) run();
			else queue.push(run);
		});
}

/* ------------------------------ main api ----------------------------- */
export async function refreshProductsJson() {
	console.time("refreshProductsJson");
	const SHOP_ID = process.env.printifyShopID;
	const PRINTIFY_TOKEN = process.env.printifyAccessToken;
	if (!PRINTIFY_TOKEN || !SHOP_ID) throw new Error("Missing printify envs");

	ensureDir(IMAGES_DIR);
	ensureDir(DATA_DIR);

	// 1) products
	const resp = await printifyGet(`/shops/${SHOP_ID}/products.json`);
	const raw = resp?.data || [];
	console.log(`✓ fetched products: ${raw.length}`);
	const parsed = parseProducts(raw);

	// 2) images (bounded concurrency)
	const limit = pLimit(4);
	let totalImages = 0;
	let doneImages = 0;
	let nightCount = 0;

	const out = [];
	for (const p of parsed) totalImages += p.images.length;
	console.log(`→ downloading ${totalImages} images (max 4 at a time)…`);

	for (const p of parsed) {
		// mark night flag from title list
		const isNight = NIGHT_TITLES.has(norm(p.title));
		if (isNight) nightCount++;

		const tasks = p.images.map((img, i) =>
			limit(async () => {
				try {
					const local = await downloadToPublic(img.src, p.id, i);
					doneImages++;
					if (doneImages % 5 === 0 || doneImages === totalImages) {
						console.log(`  … ${doneImages}/${totalImages} images`);
					}
					return { path: local, is_selected: img.is_selected, is_back: img.is_back };
				} catch (e) {
					console.warn(`  × image failed for product ${p.id} #${i}: ${e.message}`);
					return null;
				}
			})
		);
		const results = await Promise.all(tasks);
		out.push({ ...p, is_night_clothing: isNight, images: results.filter(Boolean) });
	}

	// 3) write json
	atomicWriteJson(DATA_FILE, out);
	console.log(`✓ wrote ${out.length} products → ${DATA_FILE} (night-marked: ${nightCount})`);
	console.timeEnd("refreshProductsJson");
	return { count: out.length, images: doneImages, night: nightCount, file: "/data/products.json" };
}
