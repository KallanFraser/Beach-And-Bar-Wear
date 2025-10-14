/** @format */
import { useContext } from "react";
import { useRouter } from "next/router";
import NavigationBar from "../Components/NavigationBar.jsx";
import { GlobalContext } from "../GlobalContext.jsx";

const HomePage = () => {
	const { products, loading, isDayMode } = useContext(GlobalContext);

	// Filter based on current mode (unchanged)
	const visibleProducts =
		!loading && Array.isArray(products)
			? products.filter((p) =>
					isDayMode ? p.is_night_clothing === false : p.is_night_clothing === true
			  )
			: [];

	// ✅ Chips/quick-jumps shown per mode
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

					{/* ✅ Quick jump chips are now mode-aware */}
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
							<SectionHeader
								id="swim"
								title="Summer Arrivals Collection"
								subtitle="Mens Swim Shorts"
							/>
							<div className="products-container">
								{visibleProducts.map((p) =>
									p.is_swim_short ? <ProductCard key={p.id} product={p} /> : null
								)}
							</div>
						</>
					)}

					{/* DJ Oversized */}
					<SectionHeader id="dj" title="Summer Arrivals Collection" subtitle="Oversized DJ Tee's" />
					<div className="products-container">
						{visibleProducts.map((p) =>
							p.is_dj_oversized ? <ProductCard key={p.id} product={p} /> : null
						)}
					</div>

					{/* Boxy Oversized */}
					<SectionHeader
						id="boxy"
						title="Summer Arrivals Collection"
						subtitle="Boxy Oversized Tee's"
					/>
					<div className="products-container">
						{visibleProducts.map((p) =>
							p.is_boxy_oversized ? <ProductCard key={p.id} product={p} /> : null
						)}
					</div>

					{/* Hoodies (✅ day only now) */}
					{isDayMode && (
						<>
							<SectionHeader
								id="hoodies"
								title="Summer Arrivals Collection"
								subtitle="Mens Hoodies"
							/>
							<div className="products-container">
								{visibleProducts.map((p) =>
									p.is_hoodie ? <ProductCard key={p.id} product={p} /> : null
								)}
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
	const router = useRouter();
	const largeVariant = product.variants.find((v) => /(^|\W)L($|\W)/i.test(v.title));
	const frontObj = product.images.find((img) => !img.is_back) || null;
	const backObj = product.images.find((img) => img.is_back) || null;
	const frontUrl = frontObj ? frontObj.path : null;
	const backUrl = backObj ? backObj.path : null;

	const handleClick = () => router.push(`/ViewProductPage/${product.id}`);

	return (
		<article
			className="product-card"
			onClick={handleClick}
			role="button"
			tabIndex={0}
			aria-label={product.title}
		>
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
				{largeVariant && <span>${largeVariant.price.toFixed(2)}</span>}
			</footer>
		</article>
	);
}

export default HomePage;
