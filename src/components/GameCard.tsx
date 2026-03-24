import { Link } from 'react-router-dom';
import { Users, Clock, BarChart3, Trash2 } from 'lucide-react';
import { Game } from '@/data/types';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const complexityColor: Record<string, string> = {
  low: 'bg-success/20 text-success border-success/30',
  medium: 'bg-accent/20 text-accent border-accent/30',
  high: 'bg-destructive/20 text-destructive border-destructive/30',
};

interface GameCardProps {
  game: Game;
  onDelete?: (gameSlug: string) => void;
}

export default function GameCard({ game, onDelete }: GameCardProps) {
  return (
    <div className="relative border-2 border-border bg-card hover:border-primary/50 transition-colors duration-150 group overflow-hidden">
      {game.isCustom && onDelete && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              className="absolute top-2 right-2 z-10 p-1.5 bg-destructive/90 text-destructive-foreground rounded-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
              onClick={e => e.preventDefault()}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete "{game.name}"?</AlertDialogTitle>
              <AlertDialogDescription>This will permanently remove this game from your library.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(game.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <Link to={`/games/${game.id}`} className="block">
        {game.imageUrl ? (
          <div className="w-full h-40 overflow-hidden">
            <img src={game.imageUrl} alt={game.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" style={{ imageRendering: 'auto' }} />
          </div>
        ) : (
          <div className="w-full h-40 bg-muted flex items-center justify-center">
            <span className="font-heading text-4xl font-bold text-muted-foreground/30">{game.name.charAt(0)}</span>
          </div>
        )}

        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-heading text-lg font-bold group-hover:text-primary transition-colors">{game.name}</h3>
            <Badge className={`text-xs border ${complexityColor[game.complexity]}`}>{game.complexity}</Badge>
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
        </div>
      </Link>
    </div>
  );
}