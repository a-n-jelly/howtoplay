import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Dice5, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { defaultGames } from '@/data/games';
import GameCard from '@/components/GameCard';
import Layout from '@/components/Layout';
import { useCustomGames } from '@/hooks/useCustomGames';

export default function Index() {
  const [search, setSearch] = useState('');
  const { customGames } = useCustomGames();
  const games = useMemo(() => [...defaultGames, ...customGames], [customGames]);

  const filtered = games.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero */}
        <div className="border-2 border-border bg-card p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Dice5 className="w-10 h-10 text-primary" />
            <h1 className="font-heading text-3xl sm:text-4xl font-bold">GameGuide</h1>
          </div>
          <p className="text-muted-foreground text-sm max-w-xl mb-6">
            Your board game companion. Learn rules, follow setup guides, and get quick references — all in one place. Perfect for game night.
          </p>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search games..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 bg-popover border-2"
            />
          </div>
        </div>

        {/* Games Grid */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-xl font-bold">
            {search ? `Results (${filtered.length})` : 'All Games'}
          </h2>
          <Link
            to="/games"
            className="text-xs text-primary flex items-center gap-1 hover:underline font-mono"
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="border-2 border-border bg-card p-8 text-center">
            <p className="text-muted-foreground text-sm">No games found.</p>
            <Link to="/add-game" className="text-primary text-sm hover:underline mt-2 inline-block">
              Add a new game →
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}
