import { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { defaultGames } from '@/data/games';
import { Complexity } from '@/data/types';
import GameCard from '@/components/GameCard';
import Layout from '@/components/Layout';
import { useCustomGames } from '@/hooks/useCustomGames';

const complexities: (Complexity | 'all')[] = ['all', 'low', 'medium', 'high'];

export default function GamesLibrary() {
  const [search, setSearch] = useState('');
  const [complexity, setComplexity] = useState<Complexity | 'all'>('all');
  const { customGames } = useCustomGames();
  const games = useMemo(() => [...defaultGames, ...customGames], [customGames]);

  const filtered = games.filter(g => {
    if (!g.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (complexity !== 'all' && g.complexity !== complexity) return false;
    return true;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-heading text-3xl font-bold mb-6">Game Library</h1>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search games..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 bg-popover border-2"
            />
          </div>
          <div className="flex gap-1 items-center">
            <Filter className="w-4 h-4 text-muted-foreground mr-1" />
            {complexities.map(c => (
              <button
                key={c}
                onClick={() => setComplexity(c)}
                className={`px-3 py-2 text-xs font-mono border-2 transition-colors ${
                  complexity === c
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/30'
                }`}
              >
                {c === 'all' ? 'All' : c}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(game => (
            <GameCard key={game.id} game={game} onDelete={game.isCustom ? deleteGame : undefined} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="border-2 border-border bg-card p-8 text-center text-muted-foreground text-sm">
            No games match your filters.
          </div>
        )}
      </div>
    </Layout>
  );
}
