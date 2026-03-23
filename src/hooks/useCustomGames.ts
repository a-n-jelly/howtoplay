import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Game } from '@/data/types';
import { Json } from '@/integrations/supabase/types';

export function useCustomGames() {
  const { user } = useAuth();
  const [customGames, setCustomGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGames = useCallback(async () => {
    if (!user) {
      setCustomGames([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('custom_games')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Failed to fetch custom games:', error);
      setCustomGames([]);
    } else {
      setCustomGames(
        (data || []).map(row => ({
          ...(row.data as unknown as Game),
          id: row.game_slug,
          name: row.name,
          imageUrl: row.image_url ?? undefined,
          isCustom: true,
        }))
      );
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const saveGame = useCallback(
    async (game: Game) => {
      if (!user) throw new Error('Must be logged in to save games');

      const { error } = await supabase.from('custom_games').upsert(
        {
          user_id: user.id,
          game_slug: game.id,
          name: game.name,
          image_url: game.imageUrl ?? null,
          data: game as unknown as Json,
        },
        { onConflict: 'user_id,game_slug' }
      );

      if (error) throw error;
      await fetchGames();
    },
    [user, fetchGames]
  );

  const deleteGame = useCallback(
    async (gameSlug: string) => {
      if (!user) throw new Error('Must be logged in to delete games');

      const { error } = await supabase
        .from('custom_games')
        .delete()
        .eq('user_id', user.id)
        .eq('game_slug', gameSlug);

      if (error) throw error;
      await fetchGames();
    },
    [user, fetchGames]
  );

  return { customGames, loading, saveGame, deleteGame, refetch: fetchGames };
}
