import { Link } from "react-router-dom"
import { Gauge, Building2, ArrowRightCircle, Factory } from "lucide-react"
import SectionShell from "../components/layout/SectionShell"
import CtaPanel from "../components/ui/CtaPanel"
import InfoCard from "../components/ui/InfoCard"
import PageHero from "../components/ui/PageHero"
import SectionHeader from "../components/ui/SectionHeader"
import TagCard from "../components/ui/TagCard"

const trustSuppliers = ["Schwing Stetter", "Liebherr", "SICOMA", "ELKON", "Meka"]

const problems = [
  { icon: Factory, title: "Scaling production", text: "Move from local output to reliable high-volume capacity." },
  { icon: Gauge, title: "Cost vs performance", text: "Balance throughput, quality, and operating expense." },
  { icon: Building2, title: "Multi-site complexity", text: "Standardize systems across plants and regions." },
]

const flow = ["Concept", "Equipment", "Deployment", "Expansion"]

const services = ["Batching plants", "Mixing systems", "Material handling"]

const useCases = ["New plant", "Multi-location rollout", "Upgrade"]

export default function Concrete() {
  return (
    <div className="space-y-8 md:space-y-10">
      <PageHero
        imageSrc="/image.jpg"
        imageAlt="Concrete plant and batching operations"
        title="Concrete Plant Equipment & Batching Solutions"
        description="Scale production with structured design, deployment, and supplier execution."
        actions={[{ to: "/contact", label: "Start Your Project" }]}
      />

      <SectionShell className="border-[#e3ebf4] bg-[#f6faff]">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-[#456283]">Trusted supplier ecosystem</p>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {trustSuppliers.map((item) => (
            <TagCard key={item} label={item} className="border-[#d4e1f1] px-4 py-3 text-sm shadow-sm" />
          ))}
        </div>
      </SectionShell>

      <SectionShell className="border-[#dbe5f1] bg-gradient-to-br from-[#f8fbff] via-[#f1f6fc] to-[#edf3fa]">
        <SectionHeader title="Production Pressure Points" />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {problems.map(({ icon: Icon, title, text }) => (
            <InfoCard key={title} icon={Icon} title={title} description={text} className="border-[#d1deed] bg-white/85" />
          ))}
        </div>
      </SectionShell>

      <SectionShell className="border-[#f0d7be] bg-gradient-to-br from-[#fff9f1] via-[#fff4e7] to-[#ffefdf]">
        <SectionHeader title="Solution Flow" />
        <div className="mt-6 grid gap-3 md:grid-cols-4">
          {flow.map((step, idx) => (
            <TagCard key={step} label={`Step ${idx + 1}: ${step}`} className="border-[#efd3b7] bg-white/85 p-4" labelClassName="text-lg" />
          ))}
        </div>
      </SectionShell>

      <SectionShell className="border-[#e5d3bf] bg-[#fff8ef]">
        <CtaPanel
          eyebrow="Need fast scope validation?"
          title="Align concept, equipment, and rollout before procurement starts."
          buttonLabel="Request Consultation"
          buttonTo="/contact"
        />
      </SectionShell>

      <SectionShell className="border-[#d8e5f3] bg-gradient-to-br from-[#f9fcff] to-[#eef5fd]">
        <SectionHeader title="Services" />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {services.map((item) => (
            <TagCard key={item} label={item} />
          ))}
        </div>
      </SectionShell>

      <SectionShell className="border-[#dbe5f1] bg-gradient-to-br from-[#f7fbff] to-[#eef5fd]">
        <SectionHeader title="Use Cases" />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {useCases.map((item) => (
            <InfoCard key={item} icon={ArrowRightCircle} title={item} className="border-[#d1deed]" titleClassName="text-lg" />
          ))}
        </div>
      </SectionShell>

      <SectionShell className="border-[#dbe5f1] bg-gradient-to-br from-[#f8fbff] via-[#f1f6fc] to-[#edf3fa]">
        <SectionHeader title="Proof Snapshot" className="[&_h2]:text-2xl md:[&_h2]:text-3xl" />
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <TagCard label="Faster deployment cycles" className="border-[#d1deed] p-4" labelClassName="text-slate-800" />
          <TagCard label="Lower commissioning friction" className="border-[#d1deed] p-4" labelClassName="text-slate-800" />
          <TagCard label="Improved consistency across sites" className="border-[#d1deed] p-4" labelClassName="text-slate-800" />
        </div>
      </SectionShell>

      <SectionShell className="border-[#f1c9a4] bg-gradient-to-r from-[#fff8ef] via-[#fff2e2] to-[#ffe8ce]">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#0c3b67] md:text-4xl">Scale your operations efficiently</h2>
          <Link
            to="/contact"
            className="mt-5 inline-flex items-center rounded-lg bg-gradient-to-r from-orange-500 to-orange-400 px-8 py-4 text-lg font-semibold text-white shadow-[0_10px_20px_rgba(249,115,22,0.25)] transition-all hover:-translate-y-0.5 hover:from-orange-600 hover:to-orange-500"
          >
            Request Consultation
          </Link>
        </div>
      </SectionShell>
    </div>
  )
}