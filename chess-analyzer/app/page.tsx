import ChessAnalyzer from '@/components/ChessAnalyzer';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#312e2b]">
      <div className="container mx-auto px-4 py-6">
        <header className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">
            BlunderLens
          </h1>
          <p className="text-gray-400 text-sm">
            AI-Powered Chess Coach
          </p>
        </header>
        <ChessAnalyzer />
      </div>
    </main>
  );
}
