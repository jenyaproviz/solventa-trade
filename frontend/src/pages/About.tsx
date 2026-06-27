

import SectionShell from "../components/layout/SectionShell"
import TextCard from "../components/ui/TextCard"

export default function About() {
  return (
    <div className="space-y-8 md:space-y-10">
      <SectionShell className="relative overflow-hidden border-[#dbe5f1] bg-gradient-to-br from-[#f8fbff] via-[#f1f6fc] to-[#edf3fa] before:pointer-events-none before:absolute before:-left-20 before:-top-20 before:h-56 before:w-56 before:rounded-full before:bg-sky-300/20 before:blur-3xl">
        <div className="w-full">
          <div className="flex items-start justify-between gap-6">
            <h1 className="block bg-gradient-to-r from-[#0c3b67] to-[#1f5c92] bg-clip-text pb-3 text-4xl font-bold leading-[1.3] tracking-tight text-transparent md:text-5xl">
              About the Company
            </h1>
          </div>

          <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-[1.05fr_1fr] md:gap-12">
            <TextCard className="h-full">
              <div className="space-y-6 text-base leading-relaxed text-slate-800 md:text-lg">
                <p>
                  At <span className="font-bold">SOLVENTA</span>, we help businesses expand globally by connecting them with reliable manufacturers, suppliers, and strategic business opportunities.
                </p>
                <p>
                  We specialize in international trade, supplier sourcing, procurement support, and business consulting, providing practical solutions that simplify cross-border operations and reduce commercial risks.
                </p>
                <p>
                  Our mission is to build long-term partnerships based on trust, transparency, and measurable results. Whether you are looking to source products, enter new markets, optimize your supply chain, or establish international business relationships, SOLVENTA delivers professional support at every stage of the process.
                </p>

                <div>
                  <h3 className="mb-3 text-xl font-bold text-[#0c3b67]">Our Services</h3>
                  <ul className="space-y-1.5">
                    {[
                      "International Trade",
                      "Supplier & Manufacturer Sourcing",
                      "Procurement Support",
                      "Business Consulting",
                      "Market Research",
                      "Import & Export Assistance",
                      "Commercial Representation",
                      "Business Matchmaking",
                    ].map((s) => (
                      <li key={s} className="flex items-start gap-2">
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-orange-400" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="mb-3 text-xl font-bold text-[#0c3b67]">Why Choose SOLVENTA</h3>
                  <ul className="space-y-1.5">
                    {[
                      "Reliable international network",
                      "Personalized business solutions",
                      "Professional communication",
                      "Transparent and efficient processes",
                      "Commitment to long-term partnerships",
                    ].map((s) => (
                      <li key={s} className="flex items-start gap-2">
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-orange-400" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="font-semibold text-[#0c3b67]">
                  SOLVENTA – Connecting Business Beyond Borders.
                </p>
              </div>
            </TextCard>

            <div className="flex h-full flex-col justify-between">
              <div className="relative mt-2">
                <img
                  src="/hero.png"
                  alt="International trade logistics"
                  className="w-full rounded-2xl shadow-xl"
                />
              </div>

              <h2 className="mt-60 block bg-gradient-to-r from-[#0c3b67] to-[#1f5c92] bg-clip-text pb-3 text-4xl font-bold leading-[1.3] tracking-tight text-transparent md:text-5xl">
                Strategic Outlook
              </h2>

              <div className="mt-1 flex flex-col gap-5">
                <TextCard>
                  <div className="mb-5 h-1 w-full rounded-full bg-orange-400" />
                  <h3 className="text-3xl font-bold text-[#0c3b67] md:text-4xl">Our Mission</h3>
                  <p className="mt-6 text-base leading-relaxed text-slate-800 md:text-lg">
                    To create efficient and reliable business connections between companies in Europe,
                    the Middle and the Far East by providing professional support and long-term value.
                  </p>
                </TextCard>

                <TextCard>
                  <div className="mb-5 h-1 w-full rounded-full bg-orange-400" />
                  <h3 className="text-3xl font-bold text-[#0c3b67] md:text-4xl">Our Vision</h3>
                  <p className="mt-6 text-base leading-relaxed text-slate-800 md:text-lg">
                    To become a recognized international partner in trade and consulting, helping
                    companies expand into new markets and build sustainable commercial relationships.
                  </p>
                </TextCard>
              </div>
            </div>
          </div>
        </div>
      </SectionShell>
    </div>
  )
}

