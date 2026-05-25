import { Building2, Factory, HardHat, FlaskConical, ArrowRight, CheckCircle2 } from "lucide-react"
import { Link } from "react-router-dom"
import SectionShell from "../components/layout/SectionShell"
import CtaPanel from "../components/ui/CtaPanel"
import InfoCard from "../components/ui/InfoCard"
import PageHero from "../components/ui/PageHero"
import SectionHeader from "../components/ui/SectionHeader"

const industryTracks = [
  {
    Icon: Factory,
    title: "Cement",
    description: "Structured sourcing and execution for complete cement production systems.",
    to: "/services/cement",
    cta: "Open Cement Page",
  },
  {
    Icon: Building2,
    title: "Concrete",
    description: "Batching and plant deployment strategy for scalable concrete operations.",
    to: "/services/concrete",
    cta: "Open Concrete Page",
  },
  {
    Icon: HardHat,
    title: "Quarry",
    description: "Crushing and screening equipment planning to improve uptime and output.",
    to: "/services/quarry",
    cta: "Open Quarry Page",
  },
  {
    Icon: FlaskConical,
    title: "Lime",
    description: "Energy-aware lime plant equipment and process optimization services.",
    to: "/services/lime",
    cta: "Open Lime Page",
  },
]

const processPillars = [
  "Clear problem-to-solution structure",
  "Supplier validation before commitment",
  "Execution support from concept to commissioning",
  "Measured outcomes with case-driven proof",
]

const unifiedPanelClassName =
  "border-[#d0deed] bg-gradient-to-br from-white to-[#eef5ff] shadow-[0_4px_16px_rgba(12,59,103,0.08)]"

const unifiedCardClassName =
  `rounded-2xl ${unifiedPanelClassName} transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(12,59,103,0.14)]`

export default function Services() {
  return (
    <div className="space-y-8 md:space-y-10">
      <PageHero
        imageSrc="/tradeSolutions.jpg"
        imageAlt="Industrial equipment sourcing strategy"
        title="Industrial Equipment Programs for High-CAPEX Projects"
        description="Explore focused tracks for cement, concrete, quarry, and lime projects with consistent conversion logic: value, trust, pain points, system, delivery, proof, and action."
        actions={[
          { to: "/services/cement", label: "Start with Cement" },
          { to: "/contact", label: "Request Consultation", variant: "secondary" },
        ]}
        className={`sv-services-hero ${unifiedPanelClassName}`}
        heightClassName="h-[30rem] md:h-[28rem]"
        imageClassName=""
        contentClassName="pb-3"
        actionsClassName="pt-4"
        overlayClassName="from-transparent via-transparent to-transparent"
        titleClassName="!text-white drop-shadow-[0_12px_26px_rgba(0,0,0,0.42)]"
        descriptionClassName="max-w-2xl !text-white drop-shadow-[0_5px_14px_rgba(0,0,0,0.42)]"
      />

      <SectionShell className="border-[#dbe5f1] bg-gradient-to-br from-[#f8fbff] via-[#f1f6fc] to-[#edf3fa]">
        <div className="mb-8 flex items-center justify-between gap-5">
          <SectionHeader title="Choose Your Industry Page" />
          <span className="rounded-full border border-[#c9d5e3] bg-[#eaf0f7] px-4 py-1 text-sm font-semibold text-[#163a5b]">4 dedicated conversion funnels</span>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {industryTracks.map(({ Icon, title, description, to, cta }) => (
            <InfoCard
              key={title}
              title={title}
              description={description}
              className={`${unifiedCardClassName} p-6`}
              titleClassName="mt-5 text-2xl font-bold"
              descriptionClassName="text-base leading-relaxed"
            >
              <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[#d0deed] bg-white/80">
                <Icon className="h-6 w-6 text-[#0c3b67]" strokeWidth={1.8} />
              </div>
              <Link
                to={to}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-orange-600 transition-colors hover:text-orange-700"
              >
                {cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </InfoCard>
          ))}
        </div>
      </SectionShell>

      <SectionShell className="border-[#dbe5f1] bg-gradient-to-br from-[#f8fbff] via-[#f1f6fc] to-[#edf3fa]">
        <SectionHeader title="What You Can Expect on Every Track" />
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {processPillars.map((item) => (
            <li key={item} className={`${unifiedCardClassName} flex items-start gap-3 p-4`}>
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />
              <span className="text-slate-700">{item}</span>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <CtaPanel
            eyebrow="Ready to move forward?"
            title="Request consultation and we will help pick the right industry track."
            buttonLabel="Request Consultation"
            buttonTo="/contact"
            className={`${unifiedCardClassName} p-6`}
          />
        </div>
      </SectionShell>
    </div>
  )
}
