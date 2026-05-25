import { Link } from "react-router-dom"
import { TimerOff, Wrench, Zap, ScanSearch, HandCoins, Puzzle, TrendingUp, TrendingDown } from "lucide-react"
import SectionShell from "../components/layout/SectionShell"
import CtaPanel from "../components/ui/CtaPanel"
import InfoCard from "../components/ui/InfoCard"
import PageHero from "../components/ui/PageHero"
import SectionHeader from "../components/ui/SectionHeader"
import TagCard from "../components/ui/TagCard"

const trustSuppliers = ["Sandvik", "Metso", "Terex", "Powerscreen", "Weir"]

const issues = [
  { icon: TimerOff, title: "Downtime", text: "Production interruptions from mismatched or aging systems." },
  { icon: Wrench, title: "Maintenance cost", text: "High wear and reactive maintenance reduce margins." },
  { icon: Zap, title: "Inefficiency", text: "Low yield and bottlenecks across crushing and transfer lines." },
]

const equipment = ["Crushers", "Screens", "Conveyors"]

const process = [
  { icon: ScanSearch, title: "Supplier validation", text: "Verify technical fit and operational reliability." },
  { icon: HandCoins, title: "Cost optimization", text: "Align CAPEX and lifecycle costs with output goals." },
  { icon: Puzzle, title: "Integration", text: "Connect equipment into one coherent production flow." },
]

export default function Quarry() {
  return (
    <div className="space-y-8 md:space-y-10">
      <PageHero
        imageSrc="/regions.jpg"
        imageAlt="Quarry site and crushing operations"
        title="Quarry Equipment & Crushing Solutions"
        description="Optimize throughput and reliability with a structured equipment strategy."
        actions={[{ to: "/contact", label: "Talk to Us" }]}
      />

      <SectionShell className="border-[#e3ebf4] bg-[#f6faff]">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-[#456283]">Trusted equipment partners</p>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {trustSuppliers.map((item) => (
            <TagCard key={item} label={item} className="border-[#d4e1f1] px-4 py-3 text-sm shadow-sm" />
          ))}
        </div>
      </SectionShell>

      <SectionShell className="border-[#dbe5f1] bg-gradient-to-br from-[#f8fbff] via-[#f1f6fc] to-[#edf3fa]">
        <SectionHeader title="Operational Pain Points" />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {issues.map(({ icon: Icon, title, text }) => (
            <InfoCard key={title} icon={Icon} title={title} description={text} className="border-[#d1deed] bg-white/85" />
          ))}
        </div>
      </SectionShell>

      <SectionShell className="border-[#d8e5f3] bg-gradient-to-br from-[#f9fcff] to-[#eef5fd]">
        <SectionHeader title="Equipment Focus" />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {equipment.map((item) => (
            <TagCard key={item} label={item} />
          ))}
        </div>
      </SectionShell>

      <SectionShell className="border-[#f0d7be] bg-gradient-to-br from-[#fff9f1] via-[#fff4e7] to-[#ffefdf]">
        <SectionHeader title="Solution Process" />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {process.map(({ icon: Icon, title, text }) => (
            <InfoCard key={title} icon={Icon} title={title} description={text} className="border-[#efd3b7] bg-white/85" />
          ))}
        </div>
      </SectionShell>

      <SectionShell className="border-[#e5d3bf] bg-[#fff8ef]">
        <CtaPanel
          eyebrow="Pre-empt downtime before expansion"
          title="Validate your crushing train and integration plan before procurement."
          buttonLabel="Request Consultation"
          buttonTo="/contact"
        />
      </SectionShell>

      <SectionShell className="border-[#dbe5f1] bg-gradient-to-br from-[#f7fbff] to-[#eef5fd]">
        <SectionHeader title="Results" />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <InfoCard
            icon={TrendingUp}
            title="Productivity"
            description="Higher throughput and steadier output profile."
            className="border-[#d1deed]"
            iconClassName="text-green-600"
            titleClassName="text-lg"
          />
          <InfoCard
            icon={TrendingDown}
            title="Downtime"
            description="Fewer stoppages through better system matching."
            className="border-[#d1deed]"
            titleClassName="text-lg"
          />
          <InfoCard
            icon={TrendingDown}
            title="Cost"
            description="Lower lifecycle spend and maintenance pressure."
            className="border-[#d1deed]"
            titleClassName="text-lg"
          />
        </div>
      </SectionShell>

      <SectionShell className="border-[#dbe5f1] bg-gradient-to-br from-[#f8fbff] via-[#f1f6fc] to-[#edf3fa]">
        <SectionHeader title="Quarry Upgrade - Middle East" className="[&_h2]:text-2xl md:[&_h2]:text-3xl" />
        <p className="mt-4 rounded-xl border border-[#d1deed] bg-white/90 p-4 text-slate-800">Efficiency increased, downtime reduced through phased equipment and process integration.</p>
      </SectionShell>

      <SectionShell className="border-[#f1c9a4] bg-gradient-to-r from-[#fff8ef] via-[#fff2e2] to-[#ffe8ce]">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#0c3b67] md:text-4xl">Optimize your quarry operations</h2>
          <Link
            to="/contact"
            className="mt-5 inline-flex items-center rounded-lg bg-gradient-to-r from-orange-500 to-orange-400 px-8 py-4 text-lg font-semibold text-white shadow-[0_10px_20px_rgba(249,115,22,0.25)] transition-all hover:-translate-y-0.5 hover:from-orange-600 hover:to-orange-500"
          >
            Talk to Us
          </Link>
        </div>
      </SectionShell>
    </div>
  )
}