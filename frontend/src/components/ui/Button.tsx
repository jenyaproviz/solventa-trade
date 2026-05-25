import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react"

type ButtonVariant = "primary" | "secondary" | "ghost"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  width?: number | string
  height?: number | string
  variant?: ButtonVariant
  fullWidth?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-orange-500 text-white hover:bg-orange-600 focus-visible:ring-orange-300",
  secondary:
    "border border-[#c9d5e3] bg-[#eaf0f7] text-[#163a5b] hover:bg-[#dfe9f4] focus-visible:ring-[#7b99b8]/40",
  ghost:
    "bg-transparent text-[#0c3b67] hover:bg-[#edf4ff] focus-visible:ring-[#1f5c92]/30",
}

function toCssSize(value?: number | string): string | undefined {
  if (value === undefined) return undefined
  return typeof value === "number" ? `${value}px` : value
}

export default function Button({
  children,
  className = "",
  width,
  height,
  variant = "primary",
  fullWidth = false,
  type = "button",
  style,
  ...props
}: ButtonProps) {
  const sizeStyle: CSSProperties = {
    width: fullWidth ? "100%" : toCssSize(width),
    height: toCssSize(height),
    ...style,
  }

  return (
    <button
      type={type}
      style={sizeStyle}
      className={[
        "inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition",
        "focus-visible:outline-none focus-visible:ring-2",
        "disabled:cursor-not-allowed disabled:opacity-70",
        variantClasses[variant],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  )
}
