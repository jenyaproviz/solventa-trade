type TagCardProps = {
  label: string
  className?: string
  labelClassName?: string
}

export default function TagCard({ label, className = "", labelClassName = "" }: TagCardProps) {
  return (
    <div
      className={[
        "rounded-xl border border-[#d3e1f1] bg-white p-6 text-center text-lg font-semibold text-[#0c3b67]",
        className,
      ].join(" ")}
    >
      <span className={labelClassName}>{label}</span>
    </div>
  )
}
