import { type CellValue } from "@/hooks/use-tetris";

const CELL_STYLES: Record<
  string,
  { bg: string; highlight: string; shadow: string }
> = {
  I: { bg: "#22d3ee", highlight: "#67e8f9", shadow: "#0891b2" },
  O: { bg: "#facc15", highlight: "#fde047", shadow: "#ca8a04" },
  T: { bg: "#c026d3", highlight: "#d946ef", shadow: "#86198f" },
  S: { bg: "#22c55e", highlight: "#4ade80", shadow: "#15803d" },
  Z: { bg: "#ef4444", highlight: "#f87171", shadow: "#b91c1c" },
  J: { bg: "#3b82f6", highlight: "#60a5fa", shadow: "#1d4ed8" },
  L: { bg: "#f97316", highlight: "#fb923c", shadow: "#c2410c" },
};

export function TetrisCell({ value }: { value: CellValue }) {
  const strValue = String(value);
  const isGhost = strValue.startsWith("ghost_");

  if (value === 0) {
    return (
      <div
        className="border border-border/20"
        style={{ background: "rgba(255,255,255,0.02)" }}
      />
    );
  }

  if (isGhost) {
    const pieceType = strValue.replace("ghost_", "");
    const style = CELL_STYLES[pieceType];
    return (
      <div
        className="rounded-[1px]"
        style={{
          background: style?.bg ?? "transparent",
          opacity: 0.15,
          border: `1px solid ${style?.highlight ?? "transparent"}`,
        }}
      />
    );
  }

  const style = CELL_STYLES[strValue];
  return (
    <div
      className="rounded-[1px]"
      style={{
        background: `linear-gradient(135deg, ${style?.highlight ?? "#888"} 0%, ${style?.bg ?? "#666"} 40%, ${style?.shadow ?? "#444"} 100%)`,
        borderTop: `1px solid ${style?.highlight ?? "#aaa"}`,
        borderLeft: `1px solid ${style?.highlight ?? "#aaa"}`,
        borderBottom: `1px solid ${style?.shadow ?? "#333"}`,
        borderRight: `1px solid ${style?.shadow ?? "#333"}`,
        boxShadow: `inset 0 0 3px rgba(255,255,255,0.2)`,
      }}
    />
  );
}
