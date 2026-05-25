import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

type InfoCardProps = {
  title: string
  description?: string
  icon?: LucideIcon
  children?: ReactNode
  className?: string
  titleClassName?: string
  descriptionClassName?: string
  iconClassName?: string
  centered?: boolean
}

export default function InfoCard({
  title,
  description,
  icon: Icon,
  children,
  className = "",
  titleClassName = "",
  descriptionClassName = "",
  iconClassName = "",
  centered = false,
}: InfoCardProps) {
  return (
    <article className={["rounded-xl border bg-white/90 p-5", className].join(" ")}>
      {Icon ? (
        <Icon
          className={[
            "h-5 w-5 text-orange-500",
            centered ? "mx-auto" : "",
            iconClassName,
          ].join(" ")}
        />
      ) : null}
      <h3 className={["mt-3 font-semibold text-[#0c3b67]", centered ? "text-center" : "", titleClassName].join(" ")}>{title}</h3>
      {description ? (
        <p className={["mt-1 text-sm text-slate-700", centered ? "text-center" : "", descriptionClassName].join(" ")}>{description}</p>
      ) : null}
      {children}
    </article>
  )
}
