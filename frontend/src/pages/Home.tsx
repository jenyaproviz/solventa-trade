import { Link } from "react-router-dom"
import SectionShell from "../components/layout/SectionShell"
import TextCard from "../components/ui/TextCard"

const unifiedPanelClassName = "border-[#dbe5f1] bg-gradient-to-br from-[#f8fbff] via-[#f1f6fc] to-[#edf3fa]"

export default function Home() {
	return (
		<div className="space-y-8">
			{/* Hero Section */}
			<SectionShell className="relative overflow-hidden border-[#cfe2f7] bg-gradient-to-br from-[#f7fbff] via-[#edf5ff] to-[#e8f1fb] before:pointer-events-none before:absolute before:-right-20 before:-top-24 before:h-64 before:w-64 before:rounded-full before:bg-[#0c3b67]/10 before:blur-3xl">
				<div className="space-y-6 pt-1">
					<h1 className="block bg-gradient-to-r from-[#0c3b67] via-[#1f5c92] to-[#0c3b67] bg-clip-text pb-4 text-4xl font-bold leading-[1.3] tracking-tight text-transparent md:text-5xl lg:text-6xl">
						Smart Trade. Trusted Consulting.
					</h1>
					<p className="text-lg leading-relaxed text-slate-800 md:text-xl">
						Welcome to Solventa Trade & Consulting. We support international trade,
						sourcing, and practical business growth between Europe, the Middle East,
						and Asia.
					</p>
					<div className="flex flex-wrap gap-4 pt-4">
						<Link
							to="/services"
							className="rounded-lg bg-gradient-to-r from-orange-500 to-orange-400 px-6 py-3 font-semibold text-white shadow-[0_10px_20px_rgba(249,115,22,0.25)] transition-all hover:-translate-y-0.5 hover:from-orange-600 hover:to-orange-500 md:px-8 md:py-4"
						>
							Explore Our Services
						</Link>
						<Link
							to="/contact"
							className="rounded-lg border-2 border-[#0c3b67] bg-white/70 px-6 py-3 font-semibold text-[#0c3b67] transition-all hover:-translate-y-0.5 hover:bg-[#eef5ff] md:px-8 md:py-4"
						>
							Get in Touch
						</Link>
					</div>
				</div>
			</SectionShell>

			{/* Visual Showcase */}
			<SectionShell className="relative overflow-hidden border-[#d7e5f5] bg-gradient-to-br from-[#f9fcff] via-[#f1f7ff] to-[#ebf3fd]">
				<div className="space-y-5">
					<h2 className="bg-gradient-to-r from-[#0c3b67] to-[#1f5c92] bg-clip-text text-3xl font-bold tracking-tight text-transparent md:text-4xl">
						Global Operations in Action
					</h2>
					<p className="max-w-3xl text-base leading-relaxed text-slate-700 md:text-lg">
						A quick visual view of Solventa&apos;s logistics, market intelligence,
						partnerships, and worldwide trade network.
					</p>
					<div className="overflow-hidden rounded-2xl border border-[#cfdff2] bg-white/80 shadow-[0_12px_24px_rgba(12,59,103,0.12)]">
						<img
							src="/image.jpg"
							alt="Solventa global operations and logistics collage"
							className="h-auto w-full object-cover"
						/>
					</div>
				</div>
			</SectionShell>

			{/* What We Do Section */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<TextCard>
					<h3 className="text-2xl font-bold text-[#0c3b67]">International Trade</h3>
					<p className="mt-3 text-slate-800">
						Connecting businesses across Europe, the Middle East, and Asia with 
						seamless trade solutions and market expertise.
					</p>
				</TextCard>

				<TextCard>
					<h3 className="text-2xl font-bold text-[#0c3b67]">Sourcing Excellence</h3>
					<p className="mt-3 text-slate-800">
						Find reliable suppliers and optimize your supply chain with our 
						comprehensive sourcing network.
					</p>
				</TextCard>

				<TextCard>
					<h3 className="text-2xl font-bold text-[#0c3b67]">Business Consulting</h3>
					<p className="mt-3 text-slate-800">
						Strategic guidance for business growth, market entry, and operational 
						excellence in emerging markets.
					</p>
				</TextCard>
			</div>

			{/* Why Choose Us Section */}
			<SectionShell className={unifiedPanelClassName}>
				<h2 className="mb-8 text-3xl font-bold text-[#0c3b67] md:text-4xl">
					Why Choose Solventa?
				</h2>
				<div className="grid gap-6 md:grid-cols-2">
					<div className="space-y-3">
						<div className="flex items-start gap-4">
							<div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-orange-500 text-white font-bold">
								✓
							</div>
							<div>
								<h4 className="font-semibold text-[#0c3b67]">Proven Expertise</h4>
								<p className="text-sm text-slate-700">Years of experience in international trade</p>
							</div>
						</div>
						<div className="flex items-start gap-4">
							<div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-orange-500 text-white font-bold">
								✓
							</div>
							<div>
								<h4 className="font-semibold text-[#0c3b67]">Global Network</h4>
								<p className="text-sm text-slate-700">Connections across multiple continents</p>
							</div>
						</div>
					</div>
					<div className="space-y-3">
						<div className="flex items-start gap-4">
							<div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-orange-500 text-white font-bold">
								✓
							</div>
							<div>
								<h4 className="font-semibold text-[#0c3b67]">Personalized Solutions</h4>
								<p className="text-sm text-slate-700">Tailored strategies for your business needs</p>
							</div>
						</div>
						<div className="flex items-start gap-4">
							<div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-orange-500 text-white font-bold">
								✓
							</div>
							<div>
								<h4 className="font-semibold text-[#0c3b67]">24/7 Support</h4>
								<p className="text-sm text-slate-700">Always available across time zones</p>
							</div>
						</div>
					</div>
				</div>
			</SectionShell>

			{/* Call to Action Section */}
			<SectionShell className={unifiedPanelClassName}>
				<div className="text-center space-y-6">
					<h2 className="text-3xl font-bold text-[#0c3b67] md:text-4xl">
						Ready to Grow Your Business?
					</h2>
					<p className="mx-auto max-w-2xl text-lg text-slate-800">
						Let's discuss how Solventa can help you navigate international markets 
						and achieve your business goals.
					</p>
					<Link
						to="/contact"
						className="inline-block rounded-lg bg-gradient-to-r from-orange-500 to-orange-400 px-8 py-4 text-lg font-semibold text-white shadow-[0_10px_20px_rgba(249,115,22,0.25)] transition-all hover:-translate-y-0.5 hover:from-orange-600 hover:to-orange-500"
					>
						Contact Us Today
					</Link>
				</div>
			</SectionShell>
		</div>
	)
}
