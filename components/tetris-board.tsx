import { type Board, BOARD_WIDTH } from "@/hooks/use-tetris";
import { TetrisCell } from "./tetris-cell";

const CELL_SIZE = "1.6rem";

export function TetrisBoard({ board }: { board: Board }) {
  return (
    <div
      className="grid rounded-sm border border-border/60 shadow-[0_0_40px_rgba(0,0,0,0.5),inset_0_0_1px_rgba(255,255,255,0.05)]"
      style={{
        gridTemplateColumns: `repeat(${BOARD_WIDTH}, ${CELL_SIZE})`,
        gridAutoRows: CELL_SIZE,
        background:
          "linear-gradient(180deg, rgba(10,10,30,0.95) 0%, rgba(5,5,20,0.98) 100%)",
      }}
    >
      {board.map((row, y) =>
        row.map((cell, x) => <TetrisCell key={`${y}-${x}`} value={cell} />)
      )}
    </div>
  );
}
