import type { ReactNode } from "react"

type TextCardProps = {
  children: ReactNode
  className?: string
}

export default function TextCard({ children, className = "" }: TextCardProps) {
  return (
    <article
      className={[
        "sv-text-card rounded-2xl border border-[#d4e3f3] bg-gradient-to-br from-white to-[#f4f8ff] px-6 py-6 shadow-[0_4px_16px_rgba(12,59,103,0.06)] transition-all duration-300 ease-out transform-gpu hover:scale-[1.015] hover:-translate-y-0.5 hover:shadow-[0_10px_22px_rgba(12,59,103,0.12)] md:px-8 md:py-8",
        "[&_p]:!text-[1.08rem] [&_p]:!leading-relaxed md:[&_p]:!text-[1.18rem]",
        "[&_h2]:!text-[2rem] [&_h3]:!text-[1.5rem] md:[&_h2]:!text-[2.2rem] md:[&_h3]:!text-[1.7rem]",
        "[&_p]:!text-slate-800 [&_h2]:!text-[#0c3b67] [&_h3]:!text-[#0c3b67]",
        className,
      ].join(" ")}
    >
      {children}
    </article>
  )
}
