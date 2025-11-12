/** @format */
"use client";

import { useEffect, useState, useMemo, useContext } from "react";
import Link from "next/link";

import NavigationBar from "../../components/NavigationBar";
import { GlobalContext } from "../../components/GlobalContext";

import "../../styles/HomePage.css";
import "../../styles/ProductCard.css";

const HomePage = () => {
	const { isDayMode } = useContext(GlobalContext);

	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);

	// load /public/data/products.json
	useEffect(() => {
		let ignore = false;
		(async () => {
			try {
				const res = await fetch("/data/products.json", { cache: "no-store" });
				if (!res.ok) throw new Error(`products.json ${res.status}`);
				const data = await res.json();
				if (!ignore) setProducts(Array.isArray(data) ? data : []);
			} catch (e) {
				console.error("Failed to load /data/products.json:", e?.message || e);
				if (!ignore) setProducts([]);
			} finally {
				if (!ignore) setLoading(false);
			}
		})();
		return () => {
			ignore = true;
		};
	}, []);

	// --- derive only category flags (no night/day guessing) ----------------
	function withDerivedFlags(p) {
		const t = String(p.title || "").toLowerCase();

		const is_swim_short = /swim/.test(t);
		const is_dj_oversized = /\bdj\b/.test(t) || /dj oversized/.test(t);
		const is_boxy_oversized = /boxy/.test(t);
		const is_hoodie = /hoodie/.test(t);

		// STRICT night flag: true => night only; undefined/false => day by default
		const is_night_clothing = Boolean(p.is_night_clothing);

		return { ...p, is_swim_short, is_dj_oversized, is_boxy_oversized, is_hoodie, is_night_clothing };
	}

	// visible + derived
	const enriched = useMemo(() => {
		if (!Array.isArray(products)) return [];
		return products.filter((p) => (typeof p.visible === "boolean" ? p.visible : true)).map(withDerivedFlags);
	}, [products]);

	// STRICT mode filter: day shows !night; night shows night
	const visibleProducts = useMemo(() => {
		if (loading) return [];
		return enriched.filter((p) => (isDayMode ? !p.is_night_clothing : p.is_night_clothing));
	}, [enriched, loading, isDayMode]);

	const chips = isDayMode
		? [
				{ id: "swim", label: "Swim Shorts" },
				{ id: "dj", label: "DJ Oversized" },
				{ id: "boxy", label: "Boxy Oversized" },
				{ id: "hoodies", label: "Hoodies" },
		  ]
		: [
				{ id: "dj", label: "DJ Oversized" },
				{ id: "boxy", label: "Boxy Oversized" },
		  ];

	return (
		<div id="home-page">
			<NavigationBar />

			{/* HERO / BANNER */}
			<header id="header-banner" role="banner" aria-label="Summer Arrivals">
				<div className="hero-media">
					<img src="/images/HorizontalLogo.png" alt="Beach & Bar Wear" />
				</div>

				<div className="hero-copy">
					<h1>Summer Arrivals</h1>
					<p>{isDayMode ? "Beach. Drinks. No plans." : "Same fit. Different light."}</p>

					<nav className="subnav" aria-label="Collections">
						{chips.map((c) => (
							<a key={c.id} href={`#${c.id}`} className="chip">
								{c.label}
							</a>
						))}
					</nav>
				</div>
			</header>

			{/* CONTENT */}
			{loading ? (
				<div id="home-page-loading" aria-live="polite">
					<div className="skeleton-grid">
						{Array.from({ length: 6 }).map((_, i) => (
							<div className="skeleton-card" key={i} />
						))}
					</div>
					<p className="loading-label">Loading clothing…</p>
				</div>
			) : (
				<main id="first-line">
					{/* Swim (day only) */}
					{isDayMode && (
						<>
							<SectionHeader id="swim" title="Summer Arrivals Collection" subtitle="Mens Swim Shorts" />
							<div className="products-container">
								{visibleProducts.map((p) => (p.is_swim_short ? <ProductCard key={p.id} product={p} /> : null))}
							</div>
						</>
					)}

					{/* DJ Oversized */}
					<SectionHeader id="dj" title="Summer Arrivals Collection" subtitle="Oversized DJ Tee's" />
					<div className="products-container">
						{visibleProducts.map((p) => (p.is_dj_oversized ? <ProductCard key={p.id} product={p} /> : null))}
					</div>

					{/* Boxy Oversized */}
					<SectionHeader id="boxy" title="Summer Arrivals Collection" subtitle="Boxy Oversized Tee's" />
					<div className="products-container">
						{visibleProducts.map((p) => (p.is_boxy_oversized ? <ProductCard key={p.id} product={p} /> : null))}
					</div>

					{/* Hoodies (day only) */}
					{isDayMode && (
						<>
							<SectionHeader id="hoodies" title="Summer Arrivals Collection" subtitle="Mens Hoodies" />
							<div className="products-container">
								{visibleProducts.map((p) => (p.is_hoodie ? <ProductCard key={p.id} product={p} /> : null))}
							</div>
						</>
					)}
				</main>
			)}
		</div>
	);
};

function SectionHeader({ id, title, subtitle }) {
	return (
		<section id={id} className="summer-header" aria-labelledby={`${id}-title`}>
			<div className="header-inner">
				<h1 id={`${id}-title`}>{title}</h1>
				<h2>{subtitle}</h2>
			</div>
		</section>
	);
}

function ProductCard({ product }) {
	const largeVariant = Array.isArray(product.variants) && product.variants.find((v) => String(v.variant_title).toUpperCase() === "L");

	const frontObj = Array.isArray(product.images) ? product.images.find((img) => !img.is_back) : null;
	const backObj = Array.isArray(product.images) ? product.images.find((img) => img.is_back) : null;

	const frontUrl = frontObj ? frontObj.path : null;
	const backUrl = backObj ? backObj.path : null;

	return (
		<article className="product-card" aria-label={product.title}>
			<Link href={`/viewProduct/${product.id}`} prefetch>
				<div className="image-swapper">
					{product.is_swim_short ? (
						<>
							{frontUrl && <img className="primary" src={frontUrl} alt={product.title} />}
							{backUrl && <img className="secondary" src={backUrl} alt={product.title} />}
						</>
					) : (
						<>
							{backUrl && <img className="primary" src={backUrl} alt={product.title} />}
							{frontUrl && <img className="secondary" src={frontUrl} alt={product.title} />}
						</>
					)}
				</div>

				<footer className="price-section" aria-label="Price">
					{largeVariant && typeof largeVariant.variant_price === "number" && (
						<span>${Number(largeVariant.variant_price).toFixed(2)}</span>
					)}
				</footer>
			</Link>
		</article>
	);
}

export default HomePage;
