

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
              <p className="text-base leading-relaxed text-slate-800 md:text-lg">
                <span className="font-bold">SOLVENTA</span> is a premier
                international consulting and trade partner dedicated to fostering seamless
                commercial operations between Europe, the Middle East, and the Far East. We
                specialize in providing strategic business development, comprehensive sourcing
                solutions, and expert navigation of complex global supply chains.
                <br /><br />
                Two Decades of Multi-Industry Expertise
                <br />
                What sets SOLVENTA apart is our deep-rooted heritage of excellence. Our
                foundation is built upon 20 years of hands-on experience across a diverse
                spectrum of industrial sectors. This extensive history allows us to understand
                the unique nuances, regulatory landscapes, and operational challenges of various
                markets.
                <br /><br />
                Our core expertise spans several key industries, including:
                <br />
                Telecommunications: Navigating high-tech procurement and infrastructure development.
                <br />
                Building Materials: Sourcing and supplying essential components for large-scale construction projects.
                <br />
                Wood & Timber: Managing sustainable supply chains and quality control in the forestry sector.
                <br />
                Food Industry: Facilitating the trade of commodities and processed goods while ensuring strict adherence to international safety standards.
                <br />
                And Beyond: Our versatile methodology allows us to apply our consulting and trade principles to virtually any industrial field.
                <br /><br />
                Our Mission & Approach
                <br />
                At SOLVENTA, we believe that successful trade is built on transparency, reliability, and mutual growth. Our mission is to empower our clients by identifying lucrative market opportunities and establishing stable, long-term partnerships.
                <br />
                We do not just offer advice; we provide results-oriented solutions. Whether you are an EU manufacturer looking to expand into Asian markets or a business seeking a reliable sourcing partner in the East, SOLVENTA provides the strategic bridge necessary to achieve your goals.
                <br /><br />
                Why Partner With Us?
                <br />
                20 Years of Experience: A proven track record in diverse industrial fields.
                <br />
                Global Network: Strong, established connections across Europe and Asia.
                <br />
                Tailored Strategies: Custom-fit consulting designed for your specific business objectives.
                <br />
                Integrity: A commitment to ethical trade practices and transparent communication.
                <br />
                SOLVENTA: Your strategic partner for the next generation of global commerce.
              </p>
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

