type SectionHeaderProps = {
  title: string
  subtitle?: string
  className?: string
  centered?: boolean
}

export default function SectionHeader({ title, subtitle, className = "", centered = false }: SectionHeaderProps) {
  return (
    <div className={[centered ? "text-center" : "", className].join(" ")}>
      <h2 className="text-3xl font-bold text-[#0c3b67] md:text-4xl">{title}</h2>
      {subtitle ? <p className="mt-3 text-base text-slate-700 md:text-lg">{subtitle}</p> : null}
    </div>
  )
}
