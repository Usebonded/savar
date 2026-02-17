import { TetrisGame } from "@/components/tetris-game";

export default function Page() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background p-4">
      <TetrisGame />
    </main>
  );
}
