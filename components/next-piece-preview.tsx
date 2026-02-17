import { type Piece } from "@/hooks/use-tetris";
import { TetrisCell } from "./tetris-cell";

export function NextPiecePreview({ piece }: { piece: Piece | null }) {
  if (!piece) {
    return (
      <div className="flex h-[5.5rem] w-full items-center justify-center rounded-sm border border-border/40 bg-card">
        <span className="text-xs text-muted-foreground font-mono">---</span>
      </div>
    );
  }

  const size = piece.shape.length;
  const cellSize = "1.2rem";

  return (
    <div className="flex items-center justify-center p-2">
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${size}, ${cellSize})`,
          gridAutoRows: cellSize,
        }}
      >
        {piece.shape.map((row, y) =>
          row.map((cell, x) => (
            <TetrisCell key={`${y}-${x}`} value={cell ? piece.type : 0} />
          ))
        )}
      </div>
    </div>
  );
}
