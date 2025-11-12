"use client";

export default function BackgroundVideo() {
	return (
		<video
			aria-hidden="true"
			autoPlay
			muted
			loop
			playsInline
			preload="metadata"
			poster="/videos/landing-poster.png" // optional fallback frame
			className="bg-video"
		>
			<source src="/videos/LandingPageBackground2.mp4" type="video/mp4" />
		</video>
	);
}
