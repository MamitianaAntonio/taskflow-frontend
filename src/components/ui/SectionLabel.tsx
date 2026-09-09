interface SectionLabelProps {
  children: string;
  className?: string;
}

export default function SectionLabel({ children, className = "" }: SectionLabelProps) {
  return (
    <p
      className={`text-xs font-semibold uppercase tracking-widest text-(--text-muted) font-interface ${className}`}
    >
      {children}
    </p>
  );
}