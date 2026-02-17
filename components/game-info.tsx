export function GameInfo({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-sm border border-border/40 bg-card px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-mono">
        {label}
      </p>
      <p className="mt-1 text-xl font-bold tabular-nums text-foreground font-mono leading-none">
        {value}
      </p>
    </div>
  );
}
