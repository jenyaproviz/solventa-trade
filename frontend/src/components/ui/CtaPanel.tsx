import { Link } from "react-router-dom"

type CtaPanelProps = {
  eyebrow: string
  title: string
  buttonLabel: string
  buttonTo: string
  className?: string
}

export default function CtaPanel({
  eyebrow,
  title,
  buttonLabel,
  buttonTo,
  className = "",
}: CtaPanelProps) {
  return (
    <div
      className={[
        "flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#f0d8bf] bg-white/80 p-5",
        className,
      ].join(" ")}
    >
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-[#4b6685]">{eyebrow}</p>
        <p className="mt-1 text-lg font-semibold text-[#0c3b67]">{title}</p>
      </div>
      <Link
        to={buttonTo}
        className="inline-flex items-center rounded-lg bg-orange-500 px-5 py-2.5 font-semibold text-white shadow-[0_10px_20px_rgba(249,115,22,0.25)] transition-all hover:-translate-y-0.5 hover:bg-orange-600"
      >
        {buttonLabel}
      </Link>
    </div>
  )
}
