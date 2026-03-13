import { Link } from 'react-router-dom';
import { Users, Clock, BarChart3 } from 'lucide-react';
import { Game } from '@/data/types';
import { Badge } from '@/components/ui/badge';

const complexityColor: Record<string, string> = {
  low: 'bg-success/20 text-success border-success/30',
  medium: 'bg-accent/20 text-accent border-accent/30',
  high: 'bg-destructive/20 text-destructive border-destructive/30',
};

export default function GameCard({ game }: { game: Game }) {
  return (
    <Link
      to={`/games/${game.id}`}
      className="block border-2 border-border bg-card hover:border-primary/50 transition-colors duration-150 p-4 group"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-heading text-lg font-bold group-hover:text-primary transition-colors">
          {game.name}
        </h3>
        <Badge className={`text-xs border ${complexityColor[game.complexity]}`}>
          {game.complexity}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{game.description}</p>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Users className="w-3 h-3" />{game.playerCount}</span>
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{game.playTime}</span>
        <span className="flex items-center gap-1"><BarChart3 className="w-3 h-3" />{game.category}</span>
      </div>
      {game.expansions.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border">
          <span className="text-xs text-accent">{game.expansions.length} expansion{game.expansions.length > 1 ? 's' : ''} available</span>
        </div>
      )}
    </Link>
  );
}
