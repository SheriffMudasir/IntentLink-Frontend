import { Hero } from "@/components/sections/hero";
import { ProblemSolution } from "@/components/sections/problem-solution";
import { Features } from "@/components/sections/features";
import { TechStack } from "@/components/sections/tech-stack";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <TechStack />
      <ProblemSolution />
      <Features />

      {/* Footer */}
      <footer className="py-8 text-center text-gray-600 text-sm relative z-10 border-t border-white/5 bg-black/40">
        <p>© 2025 IntentLink. Built for the Future of DeFi.</p>
      </footer>
    </div>
  );
}