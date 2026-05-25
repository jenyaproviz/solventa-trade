import type { ReactNode } from "react"
import SectionShell from "./SectionShell"

type PageSectionLayoutProps = {
  title: string
  children: ReactNode
  className?: string
  sectionClassName?: string
  theme?: "ocean" | "amber" | "slate"
}

const themeMap: Record<NonNullable<PageSectionLayoutProps["theme"]>, string> = {
  ocean:
    "relative overflow-hidden border-[#cfe2f7] bg-gradient-to-br from-[#f7fbff] via-[#edf5ff] to-[#e8f1fb] before:pointer-events-none before:absolute before:-right-20 before:-top-20 before:h-56 before:w-56 before:rounded-full before:bg-[#0c3b67]/10 before:blur-2xl",
  amber:
    "relative overflow-hidden border-[#f6d8bb] bg-gradient-to-br from-[#fffaf5] via-[#fff3e7] to-[#fff0e1] before:pointer-events-none before:absolute before:-left-16 before:-top-16 before:h-52 before:w-52 before:rounded-full before:bg-orange-300/20 before:blur-2xl",
  slate:
    "relative overflow-hidden border-[#dbe5f1] bg-gradient-to-br from-[#f8fbff] via-[#f1f6fc] to-[#edf3fa] before:pointer-events-none before:absolute before:left-1/2 before:top-0 before:h-48 before:w-48 before:-translate-x-1/2 before:rounded-full before:bg-sky-300/15 before:blur-2xl",
}

export default function PageSectionLayout({
  title,
  children,
  className = "",
  sectionClassName = "",
  theme = "ocean",
}: PageSectionLayoutProps) {
  return (
    <div className={["space-y-8 md:space-y-10", className].join(" ")}>
      <SectionShell className={[themeMap[theme], sectionClassName].join(" ")}>
        <div className="mb-6 h-1.5 w-24 rounded-full bg-gradient-to-r from-[#0c3b67] to-orange-400" />
        <div className="flex items-start justify-between gap-6">
          <h1 className="block bg-gradient-to-r from-[#0c3b67] to-[#1f5c92] bg-clip-text pb-3 text-4xl font-bold leading-[1.3] tracking-tight text-transparent md:text-5xl">
            {title}
          </h1>
        </div>

        <div className="mt-3 md:mt-4">{children}</div>
      </SectionShell>
    </div>
  )
}
