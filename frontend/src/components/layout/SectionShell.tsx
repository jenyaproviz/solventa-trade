import type { ReactNode } from "react"

type SectionShellProps = {
  children: ReactNode
  className?: string
}

export default function SectionShell({ children, className = "" }: SectionShellProps) {
  return (
    <section
      className={[
        "rounded-3xl border border-[#d4e3f3] bg-white/95 px-6 py-8 shadow-[0_10px_30px_rgba(12,59,103,0.08)] md:px-10 md:py-12 lg:px-12",
        className,
      ].join(" ")}
    >
      {children}
    </section>
  )
}
