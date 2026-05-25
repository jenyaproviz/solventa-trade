import type { ReactNode } from "react"
import { Link } from "react-router-dom"
import SectionShell from "../layout/SectionShell"

type HeroAction = {
  to: string
  label: string
  variant?: "primary" | "secondary"
}

type PageHeroProps = {
  imageSrc: string
  imageAlt: string
  title: string
  description: string
  actions: HeroAction[]
  heightClassName?: string
  imageClassName?: string
  className?: string
  contentClassName?: string
  actionsClassName?: string
  overlayClassName?: string
  titleClassName?: string
  descriptionClassName?: string
  extraContent?: ReactNode
}

const actionVariantClass: Record<NonNullable<HeroAction["variant"]>, string> = {
  primary:
    "bg-orange-500 text-white shadow-[0_10px_20px_rgba(249,115,22,0.25)] hover:-translate-y-0.5 hover:bg-orange-600",
  secondary:
    "border border-[#c7d4e2] bg-white/90 text-[#163a5b] hover:-translate-y-0.5 hover:bg-[#edf2f8]",
}

export default function PageHero({
  imageSrc,
  imageAlt,
  title,
  description,
  actions,
  heightClassName = "h-[24rem]",
  imageClassName = "",
  className = "",
  contentClassName = "",
  actionsClassName = "",
  overlayClassName = "",
  titleClassName = "",
  descriptionClassName = "",
  extraContent,
}: PageHeroProps) {
  const titleToneClass = titleClassName ? "" : "text-[#0f2f4a]"
  const descriptionToneClass = descriptionClassName ? "" : "text-slate-800"
  const overlayToneClass = overlayClassName ? "" : "bg-gradient-to-r from-white/98 via-[#f7f9fc]/90 to-[#eef2f7]/72"

  return (
    <SectionShell
      className={[
        "sv-page-hero relative overflow-hidden border-[#d5e1ef] bg-[#f5f7fa] px-0 py-0 text-[#163a5b]",
        className,
      ].join(" ")}
    >
      <div className="relative overflow-hidden rounded-[inherit]">
        <img
          src={imageSrc}
          alt={imageAlt}
          className={[heightClassName, "sv-page-hero-image w-full object-cover", imageClassName].join(" ")}
        />
        <div
          className={[
            "sv-page-hero-overlay absolute inset-0",
            overlayToneClass,
            overlayClassName,
          ].join(" ")}
        />
        <div className="absolute inset-0 p-7 md:p-12 lg:p-14">
          <div className={["max-w-3xl space-y-5", contentClassName].join(" ")}>
            <h1 className={["text-4xl font-bold leading-tight md:text-5xl lg:text-6xl", titleToneClass, titleClassName].join(" ")}>{title}</h1>
            <p className={["text-lg md:text-xl", descriptionToneClass, descriptionClassName].join(" ")}>{description}</p>
            {actions.length > 0 ? (
              <div className={["flex flex-wrap gap-3 pt-2", actionsClassName].join(" ")}>
                {actions.map(({ to, label, variant = "primary" }) => (
                  <Link
                    key={`${to}-${label}`}
                    to={to}
                    className={[
                      "inline-flex items-center rounded-lg px-6 py-3 font-semibold transition-all",
                      variant === "secondary" ? "sv-hero-action-secondary" : "",
                      actionVariantClass[variant],
                    ].join(" ")}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            ) : null}
            {extraContent}
          </div>
        </div>
      </div>
    </SectionShell>
  )
}
