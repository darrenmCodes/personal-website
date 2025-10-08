import Image from "next/image";
import GameOfLifeBackground from "@/components/GameOfLifeBackground";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <GameOfLifeBackground />
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm z-10"></div>
      <main className="relative z-20 text-white">
        <div className="flex items-center justify-center">
          <Hero/>
        </div>
      </main>
    </div>
  );
}
