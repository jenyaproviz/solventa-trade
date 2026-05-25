import { Link } from "react-router-dom"
import { Flame, Gauge, Link2, LandPlot, Settings2, Move3d, SearchCheck, CircleDollarSign, BarChart3, ShieldCheck } from "lucide-react"
import SectionShell from "../components/layout/SectionShell"
import CtaPanel from "../components/ui/CtaPanel"
import InfoCard from "../components/ui/InfoCard"
import PageHero from "../components/ui/PageHero"
import SectionHeader from "../components/ui/SectionHeader"
import TagCard from "../components/ui/TagCard"

const trustSuppliers = ["Maerz", "Cimprogetti", "Metso", "FLSmidth", "Claudius Peters"]

const challenges = [
  { icon: Flame, title: "Energy intensity", text: "Fuel-heavy operations pressure margins and pricing." },
  { icon: Gauge, title: "Efficiency issues", text: "Uneven process control impacts throughput and quality." },
  { icon: Link2, title: "Supplier complexity", text: "Hard to align technical fit, lifecycle cost, and support." },
]

const solutions = [
  { icon: LandPlot, title: "Kiln systems", text: "Right-fit kiln configuration for production targets." },
  { icon: Settings2, title: "Processing", text: "Optimized process chain and control points." },
  { icon: Move3d, title: "Handling", text: "Reliable material transfer and storage integration." },
]

const flow = ["Assess", "Source", "Optimize", "Execute"]

const projectTypes = ["New plant", "Efficiency upgrade", "Equipment sourcing"]

const value = [
  { icon: CircleDollarSign, title: "Lower energy cost" },
  { icon: BarChart3, title: "Better efficiency" },
  { icon: ShieldCheck, title: "Reliable sourcing" },
]

export default function Lime() {
  return (
    <div className="space-y-8 md:space-y-10">
      <PageHero
        imageSrc="/delivering.jpg"
        imageAlt="Lime production and industrial processing facility"
        title="Lime Production Equipment & Industrial Solutions"
        description="Improve efficiency with structured sourcing and process-focused execution."
        actions={[{ to: "/contact", label: "Discuss Your Project" }]}
      />

      <SectionShell className="border-[#e3ebf4] bg-[#f6faff]">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-[#456283]">Supplier trust network</p>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {trustSuppliers.map((item) => (
            <TagCard key={item} label={item} className="border-[#d4e1f1] px-4 py-3 text-sm shadow-sm" />
          ))}
        </div>
      </SectionShell>

      <SectionShell className="border-[#dbe5f1] bg-gradient-to-br from-[#f8fbff] via-[#f1f6fc] to-[#edf3fa]">
        <div className="grid gap-6 md:grid-cols-2 md:items-start">
          <div>
            <SectionHeader title="Core Challenges" />
            <div className="mt-6 space-y-4">
              {challenges.map(({ icon: Icon, title, text }) => (
                <InfoCard key={title} icon={Icon} title={title} description={text} className="border-[#d1deed] bg-white/85" />
              ))}
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-[#cfdff2] bg-white shadow-[0_12px_24px_rgba(12,59,103,0.12)]">
            <img src="/strategy.jpg" alt="Lime plant process and technical optimization" className="h-full w-full object-cover" />
          </div>
        </div>
      </SectionShell>

      <SectionShell className="border-[#f0d7be] bg-gradient-to-br from-[#fff9f1] via-[#fff4e7] to-[#ffefdf]">
        <SectionHeader title="Solution Blocks" />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {solutions.map(({ icon: Icon, title, text }) => (
            <InfoCard key={title} icon={Icon} title={title} description={text} className="border-[#efd3b7] bg-white/85" />
          ))}
        </div>
      </SectionShell>

      <SectionShell className="border-[#d8e5f3] bg-gradient-to-br from-[#f9fcff] to-[#eef5fd]">
        <SectionHeader title="Process Flow" />
        <div className="mt-6 grid gap-3 md:grid-cols-4">
          {flow.map((step, idx) => (
            <TagCard key={step} label={`Step ${idx + 1}: ${step}`} className="p-4" labelClassName="text-lg" />
          ))}
        </div>
      </SectionShell>

      <SectionShell className="border-[#e5d3bf] bg-[#fff8ef]">
        <CtaPanel
          eyebrow="Pressure-test your efficiency plan"
          title="Run a structured assessment before selecting equipment packages."
          buttonLabel="Request Consultation"
          buttonTo="/contact"
        />
      </SectionShell>

      <SectionShell className="border-[#dbe5f1] bg-gradient-to-br from-[#f7fbff] to-[#eef5fd]">
        <SectionHeader title="Project Types" />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {projectTypes.map((item) => (
            <InfoCard key={item} icon={SearchCheck} title={item} className="border-[#d1deed]" titleClassName="text-lg" />
          ))}
        </div>
      </SectionShell>

      <SectionShell className="border-[#dbe5f1] bg-gradient-to-br from-[#f8fbff] via-[#f1f6fc] to-[#edf3fa]">
        <SectionHeader title="Value Delivered" className="[&_h2]:text-2xl md:[&_h2]:text-3xl" />
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {value.map(({ icon: Icon, title }) => (
            <InfoCard key={title} icon={Icon} title={title} className="border-[#d1deed] p-4" titleClassName="text-slate-800" />
          ))}
        </div>
      </SectionShell>

      <SectionShell className="border-[#f1c9a4] bg-gradient-to-r from-[#fff8ef] via-[#fff2e2] to-[#ffe8ce]">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#0c3b67] md:text-4xl">Improve your production efficiency</h2>
          <Link
            to="/contact"
            className="mt-5 inline-flex items-center rounded-lg bg-gradient-to-r from-orange-500 to-orange-400 px-8 py-4 text-lg font-semibold text-white shadow-[0_10px_20px_rgba(249,115,22,0.25)] transition-all hover:-translate-y-0.5 hover:from-orange-600 hover:to-orange-500"
          >
            Discuss Your Project
          </Link>
        </div>
      </SectionShell>
    </div>
  )
}