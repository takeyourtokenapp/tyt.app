import { Sparkles, Heart, Zap, Star } from 'lucide-react';

export default function IconTest() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold">Icon Import Test</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 p-6 rounded-lg flex flex-col items-center gap-2">
            <Sparkles className="w-12 h-12 text-cyan-400" />
            <span>Sparkles</span>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg flex flex-col items-center gap-2">
            <Heart className="w-12 h-12 text-red-400" />
            <span>Heart</span>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg flex flex-col items-center gap-2">
            <Zap className="w-12 h-12 text-yellow-400" />
            <span>Zap</span>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg flex flex-col items-center gap-2">
            <Star className="w-12 h-12 text-amber-400" />
            <span>Star</span>
          </div>
        </div>

        <div className="bg-green-900/30 border border-green-500 p-4 rounded-lg">
          <p className="text-green-400 font-semibold">If you can see all 4 icons above, Sparkles import is working correctly!</p>
        </div>
      </div>
    </div>
  );
}
