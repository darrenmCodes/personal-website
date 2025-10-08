// GameOfLifeBackground.tsx
"use client"

import { useEffect, useRef } from "react";

export default function GameOfLifeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;
    const rows = 80;
    const cols = 80;
    const cellSize = window.innerWidth / cols;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let grid = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => (Math.random() > 0.8 ? 1 : 0))
    );

    function countNeighbours(grid: number[][], r: number, c: number) {
      let count = 0;
      const rows = grid.length;
      const cols = grid[0].length;

      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;

          // Wrap around instead of skipping out-of-bounds
          const newRow = (r + dr + rows) % rows;
          const newCol = (c + dc + cols) % cols;

          count += grid[newRow][newCol];
        }
      }

      return count;
    }

    function nextGeneration() {
      const newGrid = grid.map(row => [...row]);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const n = countNeighbours(grid, r, c);
          if (grid[r][c] && (n < 2 || n > 3)) newGrid[r][c] = 0;
          else if (!grid[r][c] && n === 3) newGrid[r][c] = 1;
        }
      }
      grid = newGrid;
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          ctx.fillStyle = grid[r][c] ? "rgba(80, 150, 255, 0.25)" : "rgba(34,34,34,0.1)";
          ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
        }
      }
    }

    function handleMouseMove(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      console.log(x, y);

      const c = Math.floor(x / cellSize);
      const r = Math.floor(y / cellSize);

      for (let i = 0; i < 4; i++) {
        const dr = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        const dc = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        const nr = (r + dr + rows) % rows;
        const nc = (c + dc + cols) % cols;
        grid[nr][nc] = 1;
      }
      draw();
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    let lastUpdate = 0;
    let generation = 0;
    const updateInterval = 100; // milliseconds per update (lower = faster)
    let animationFrameId: number;

    function animate(timestamp: number) {
      if (timestamp - lastUpdate > updateInterval) {
        nextGeneration();
        draw();
        generation++;
      if (generation % 100 === 0) {
        for (let i = 0; i < 250; i++) {
          const r = Math.floor(Math.random() * rows);
          const c = Math.floor(Math.random() * cols);
          grid[r][c] = 1;
        }
      }

        lastUpdate = timestamp;
      }
      animationFrameId = requestAnimationFrame(animate);
    }

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
    />
  );
}