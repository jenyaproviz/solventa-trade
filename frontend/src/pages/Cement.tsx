import { Link } from "react-router-dom"
import { ClipboardCheck, SearchCheck, Blocks, Wrench, LifeBuoy, Landmark, Globe2 } from "lucide-react"
import SectionShell from "../components/layout/SectionShell"
import CtaPanel from "../components/ui/CtaPanel"
import InfoCard from "../components/ui/InfoCard"
import PageHero from "../components/ui/PageHero"
import SectionHeader from "../components/ui/SectionHeader"
import TagCard from "../components/ui/TagCard"

const suppliers = ["Loesche", "AUMUND", "FLSmidth", "ThyssenKrupp", "Gebr. Pfeiffer"]

const problems = [
  { icon: Landmark, title: "High CAPEX risk", desc: "Large procurement decisions with long-term financial impact." },
  { icon: SearchCheck, title: "Supplier complexity", desc: "Technical scope, pricing models, and quality levels vary heavily." },
  { icon: Globe2, title: "Cross-border challenges", desc: "Contract, logistics, and compliance alignment across regions." },
]

const solutionFlow = [
  { icon: ClipboardCheck, title: "Assess", desc: "Define scope and technical priorities." },
  { icon: SearchCheck, title: "Source", desc: "Match validated manufacturers to your needs." },
  { icon: Blocks, title: "Structure", desc: "Build a resilient supplier and cost model." },
  { icon: Wrench, title: "Execute", desc: "Coordinate procurement and deployment." },
  { icon: LifeBuoy, title: "Support", desc: "Post-award technical and commercial follow-through." },
]

const deliverables = ["Kilns & grinding", "Material handling", "Packing & dispatch"]

export default function Cement() {
  return (
    <div className="space-y-8 md:space-y-10">
      <PageHero
        imageSrc="/all.png"
        imageAlt="Cement plant and industrial processing line"
        title="Cement Plant Equipment & Industrial Solutions"
        description="Build and upgrade cement production with structured sourcing and execution."
        heightClassName="h-[26rem]"
        actions={[
          { to: "/contact", label: "Request Consultation" },
          { to: "/services", label: "View All Industries", variant: "secondary" },
        ]}
      />

      <SectionShell className="border-[#e3ebf4] bg-[#f6faff]">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-[#456283]">Working with equipment from leading manufacturers:</p>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {suppliers.map((name) => (
            <TagCard key={name} label={name} className="border-[#d4e1f1] px-4 py-3 text-sm shadow-sm" />
          ))}
        </div>
      </SectionShell>

      <SectionShell className="border-[#dbe5f1] bg-gradient-to-br from-[#f8fbff] via-[#f1f6fc] to-[#edf3fa]">
        <div className="grid gap-7 md:grid-cols-[1.1fr_1fr] md:items-center">
          <div>
            <SectionHeader title="Where Projects Break Down" />
            <div className="mt-6 space-y-4">
              {problems.map(({ icon: Icon, title, desc }) => (
                <InfoCard key={title} icon={Icon} title={title} description={desc} className="border-[#d1deed] bg-white/85 p-4" />
              ))}
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-[#cfdff2] bg-white shadow-[0_12px_24px_rgba(12,59,103,0.12)]">
            <img src="/tradeSolutions.jpg" alt="Cement machinery and industrial production equipment" className="h-full w-full object-cover" />
          </div>
        </div>
      </SectionShell>

      <SectionShell className="border-[#f0d7be] bg-gradient-to-br from-[#fff9f1] via-[#fff4e7] to-[#ffefdf]">
        <SectionHeader title="Our Execution System" />
        <div className="mt-6 grid gap-4 md:grid-cols-5">
          {solutionFlow.map(({ icon: Icon, title, desc }) => (
            <InfoCard key={title} icon={Icon} title={title} description={desc} className="border-[#efd3b7] bg-white/85 p-4" />
          ))}
        </div>
      </SectionShell>

      <SectionShell className="border-[#e5d3bf] bg-[#fff8ef]">
        <CtaPanel
          eyebrow="Need a structured bid strategy?"
          title="Get a project-specific consultation before committing CAPEX."
          buttonLabel="Request Consultation"
          buttonTo="/contact"
        />
      </SectionShell>

      <SectionShell className="border-[#d8e5f3] bg-gradient-to-br from-[#f9fcff] to-[#eef5fd]">
        <SectionHeader title="What We Deliver" />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {deliverables.map((item) => (
            <TagCard key={item} label={item} />
          ))}
        </div>
      </SectionShell>

      <SectionShell className="border-[#dbe5f1] bg-gradient-to-br from-[#f8fbff] via-[#f1f6fc] to-[#edf3fa]">
        <SectionHeader title="Cement Project - Eastern Europe" className="[&_h2]:text-2xl md:[&_h2]:text-3xl" />
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <p className="flex items-start gap-2 rounded-xl border border-[#d1deed] bg-white/90 p-4 text-slate-800"><span className="text-orange-500">✔</span><span>18% cost reduction</span></p>
          <p className="flex items-start gap-2 rounded-xl border border-[#d1deed] bg-white/90 p-4 text-slate-800"><span className="text-orange-500">✔</span><span>Optimized supplier structure</span></p>
        </div>
      </SectionShell>

      <SectionShell className="border-[#f1c9a4] bg-gradient-to-r from-[#fff8ef] via-[#fff2e2] to-[#ffe8ce]">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#0c3b67] md:text-4xl">Build your cement project with confidence</h2>
          <Link
            to="/contact"
            className="mt-5 inline-flex items-center rounded-lg bg-gradient-to-r from-orange-500 to-orange-400 px-8 py-4 text-lg font-semibold text-white shadow-[0_10px_20px_rgba(249,115,22,0.25)] transition-all hover:-translate-y-0.5 hover:from-orange-600 hover:to-orange-500"
          >
            Start Your Project
          </Link>
        </div>
      </SectionShell>
    </div>
  )
}