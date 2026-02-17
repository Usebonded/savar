"use client";

import { useEffect, useCallback } from "react";
import { useTetris } from "@/hooks/use-tetris";
import { TetrisBoard } from "./tetris-board";
import { NextPiecePreview } from "./next-piece-preview";
import { GameInfo } from "./game-info";
import { Button } from "@/components/ui/button";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  ChevronsDown,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";

export function TetrisGame() {
  const {
    board,
    nextPiece,
    score,
    level,
    lines,
    gameState,
    startGame,
    togglePause,
    moveLeft,
    moveRight,
    moveDown,
    rotatePiece,
    hardDrop,
  } = useTetris();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (gameState === "idle" || gameState === "gameover") {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          startGame();
        }
        return;
      }

      if (e.key === "p" || e.key === "Escape") {
        e.preventDefault();
        togglePause();
        return;
      }

      if (gameState !== "playing") return;

      switch (e.key) {
        case "ArrowLeft":
        case "a":
          e.preventDefault();
          moveLeft();
          break;
        case "ArrowRight":
        case "d":
          e.preventDefault();
          moveRight();
          break;
        case "ArrowDown":
        case "s":
          e.preventDefault();
          moveDown();
          break;
        case "ArrowUp":
        case "w":
          e.preventDefault();
          rotatePiece();
          break;
        case " ":
          e.preventDefault();
          hardDrop();
          break;
      }
    },
    [
      gameState,
      startGame,
      togglePause,
      moveLeft,
      moveRight,
      moveDown,
      rotatePiece,
      hardDrop,
    ]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Title */}
      <div className="flex flex-col items-center gap-1">
        <h1 className="text-3xl font-bold tracking-[0.3em] text-foreground font-mono uppercase">
          Tetris
        </h1>
        <div className="h-px w-16 bg-primary/40" />
      </div>

      {/* Main game area */}
      <div className="flex items-start gap-5">
        {/* Left panel -- stats */}
        <div className="hidden w-32 flex-col gap-2.5 pt-0 md:flex">
          <GameInfo label="Score" value={score.toLocaleString()} />
          <GameInfo label="Level" value={level} />
          <GameInfo label="Lines" value={lines} />

          {/* Controls hint */}
          <div className="mt-2 rounded-sm border border-border/40 bg-card px-3 py-2.5">
            <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-mono">
              Controls
            </p>
            <div className="flex flex-col gap-1 text-[11px] text-muted-foreground/80 font-mono">
              <div className="flex justify-between">
                <span className="text-foreground/60">{"< >"}</span>
                <span>Move</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/60">Up</span>
                <span>Rotate</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/60">Down</span>
                <span>Soft drop</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/60">Space</span>
                <span>Hard drop</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/60">Esc</span>
                <span>Pause</span>
              </div>
            </div>
          </div>
        </div>

        {/* Game Board */}
        <div className="relative">
          <TetrisBoard board={board} />

          {/* Overlay for non-playing states */}
          {gameState !== "playing" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-sm bg-background/85 backdrop-blur-[2px]">
              {gameState === "idle" && (
                <div className="flex flex-col items-center gap-4">
                  <p className="text-sm tracking-wider text-muted-foreground font-mono">
                    Ready to play?
                  </p>
                  <Button
                    onClick={startGame}
                    size="lg"
                    className="font-mono tracking-wide"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Start Game
                  </Button>
                </div>
              )}
              {gameState === "paused" && (
                <div className="flex flex-col items-center gap-4">
                  <p className="text-xl font-bold tracking-[0.3em] text-foreground font-mono">
                    PAUSED
                  </p>
                  <Button
                    onClick={togglePause}
                    size="lg"
                    className="font-mono tracking-wide"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Resume
                  </Button>
                </div>
              )}
              {gameState === "gameover" && (
                <div className="flex flex-col items-center gap-3">
                  <p className="text-xl font-bold tracking-[0.3em] text-destructive font-mono">
                    GAME OVER
                  </p>
                  <p className="text-sm tabular-nums text-muted-foreground font-mono">
                    Score: {score.toLocaleString()}
                  </p>
                  <Button
                    onClick={startGame}
                    size="lg"
                    className="mt-1 font-mono tracking-wide"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Play Again
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right panel -- next piece + pause */}
        <div className="hidden w-32 flex-col gap-2.5 pt-0 md:flex">
          <div className="rounded-sm border border-border/40 bg-card px-3 py-2.5">
            <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-mono">
              Next
            </p>
            <NextPiecePreview piece={nextPiece} />
          </div>

          {gameState === "playing" && (
            <Button
              variant="secondary"
              size="sm"
              onClick={togglePause}
              className="w-full font-mono text-xs tracking-wide"
            >
              <Pause className="mr-1.5 h-3 w-3" />
              Pause
            </Button>
          )}
        </div>
      </div>

      {/* Mobile stats row */}
      <div className="flex w-full gap-2 md:hidden">
        <div className="flex-1">
          <GameInfo label="Score" value={score.toLocaleString()} />
        </div>
        <div className="flex-1">
          <GameInfo label="Level" value={level} />
        </div>
        <div className="flex-1">
          <GameInfo label="Lines" value={lines} />
        </div>
      </div>

      {/* Mobile next piece + pause */}
      <div className="flex w-full items-center justify-between md:hidden">
        <div>
          <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-mono">
            Next
          </p>
          <NextPiecePreview piece={nextPiece} />
        </div>
        {gameState === "playing" && (
          <Button
            variant="secondary"
            size="sm"
            onClick={togglePause}
            className="font-mono text-xs"
          >
            <Pause className="mr-1 h-3 w-3" />
            Pause
          </Button>
        )}
      </div>

      {/* Mobile touch controls */}
      <div className="flex items-center gap-2 md:hidden">
        <Button
          variant="secondary"
          size="icon"
          className="h-11 w-11 rounded-sm"
          onPointerDown={(e) => {
            e.preventDefault();
            moveLeft();
          }}
          aria-label="Move left"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="h-11 w-11 rounded-sm"
          onPointerDown={(e) => {
            e.preventDefault();
            moveDown();
          }}
          aria-label="Soft drop"
        >
          <ArrowDown className="h-5 w-5" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="h-11 w-11 rounded-sm"
          onPointerDown={(e) => {
            e.preventDefault();
            moveRight();
          }}
          aria-label="Move right"
        >
          <ArrowRight className="h-5 w-5" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="h-11 w-11 rounded-sm"
          onPointerDown={(e) => {
            e.preventDefault();
            rotatePiece();
          }}
          aria-label="Rotate"
        >
          <RotateCw className="h-5 w-5" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="h-11 w-11 rounded-sm"
          onPointerDown={(e) => {
            e.preventDefault();
            hardDrop();
          }}
          aria-label="Hard drop"
        >
          <ChevronsDown className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
