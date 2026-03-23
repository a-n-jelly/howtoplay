import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save, Sparkles, ChevronDown, Loader2 } from 'lucide-react';
import { Game, Complexity } from '@/data/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useCustomGames } from '@/hooks/useCustomGames';
import { useAuth } from '@/contexts/AuthContext';

function generateId(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'game-' + Date.now();
}

export default function AddGame() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { saveGame } = useCustomGames();

  const [gameName, setGameName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedGame, setGeneratedGame] = useState<Game | null>(null);
  const [showManual, setShowManual] = useState(false);

  // Manual form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [playerCount, setPlayerCount] = useState('');
  const [playTime, setPlayTime] = useState('');
  const [complexity, setComplexity] = useState<Complexity>('medium');
  const [category, setCategory] = useState('');
  const [setupSteps, setSetupSteps] = useState<string[]>(['']);
  const [learnGoal, setLearnGoal] = useState('');
  const [learnSetup, setLearnSetup] = useState('');
  const [learnTurns, setLearnTurns] = useState('');
  const [learnActions, setLearnActions] = useState('');
  const [learnScoring, setLearnScoring] = useState('');
  const [turnOrder, setTurnOrder] = useState<string[]>(['']);
  const [actions, setActions] = useState<string[]>(['']);
  const [scoring, setScoring] = useState<string[]>(['']);
  const [tips, setTips] = useState<string[]>(['']);

  const addItem = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => [...prev, '']);
  };

  const updateItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number, value: string) => {
    setter(prev => prev.map((item, i) => i === index ? value : item));
  };

  const removeItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    if (!gameName.trim()) {
      toast({ title: 'Name required', description: 'Enter a board game name to generate.', variant: 'destructive' });
      return;
    }

    setIsGenerating(true);
    setGeneratedGame(null);

    try {
      // Generate game data
      const { data: gameData, error: gameError } = await supabase.functions.invoke('generate-game', {
        body: { name: gameName.trim() },
      });

      if (gameError) throw new Error(gameError.message || 'Failed to generate game');
      if (gameData?.error) throw new Error(gameData.error);

      // Generate image in parallel (don't block on failure)
      let imageUrl: string | undefined;
      try {
        const { data: imageData } = await supabase.functions.invoke('generate-game-image', {
          body: { name: gameName.trim() },
        });
        if (imageData?.imageUrl) {
          imageUrl = imageData.imageUrl;
        }
      } catch (imgErr) {
        console.warn('Image generation failed, continuing without image:', imgErr);
      }

      const game: Game = {
        id: generateId(gameData.name || gameName),
        ...gameData,
        imageUrl,
        isCustom: true,
      };

      setGeneratedGame(game);
      toast({ title: 'Game generated!', description: 'Review the guide below and save it to your library.' });
    } catch (err) {
      console.error('Generation error:', err);
      toast({
        title: 'Generation failed',
        description: err instanceof Error ? err.message : 'Something went wrong. Try again or add manually.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveGenerated = async () => {
    if (!generatedGame) return;
    if (!user) {
      toast({ title: 'Sign in required', description: 'Please sign in to save games.', variant: 'destructive' });
      navigate('/auth');
      return;
    }
    try {
      await saveGame(generatedGame);
      toast({ title: 'Game saved!', description: `${generatedGame.name} has been added to your library.` });
      navigate(`/games/${generatedGame.id}`);
    } catch (err) {
      toast({ title: 'Save failed', description: 'Could not save game. Please try again.', variant: 'destructive' });
    }
  };

  const handleSaveManual = () => {
    if (!name.trim()) {
      toast({ title: 'Name required', description: 'Please enter a game name.', variant: 'destructive' });
      return;
    }

    const game: Game = {
      id: generateId(name),
      name: name.trim(),
      description: description.trim(),
      playerCount: playerCount.trim() || '2-4',
      playTime: playTime.trim() || '30-60 min',
      complexity,
      category: category.trim() || 'General',
      expansions: [],
      setupSteps: setupSteps.filter(s => s.trim()).map((s, i) => ({ stepNumber: i + 1, instruction: s.trim() })),
      learnSteps: [
        { title: '🎯 Goal', content: learnGoal || 'No goal description yet.' },
        { title: '🛠️ Setup', content: learnSetup || 'No setup description yet.' },
        { title: '🔄 Turns', content: learnTurns || 'No turn description yet.' },
        { title: '⚡ Actions', content: learnActions || 'No actions description yet.' },
        { title: '🏆 Scoring', content: learnScoring || 'No scoring description yet.' },
      ],
      quickRules: {
        turnOrder: turnOrder.filter(s => s.trim()),
        actions: actions.filter(s => s.trim()),
        scoring: scoring.filter(s => s.trim()),
        edgeCases: [],
      },
      turnPhases: [],
      actions: [],
      ruleSnippets: [],
      tips: tips.filter(s => s.trim()).map(t => ({ text: t.trim(), isBeginner: true })),
      firstPlaySteps: [],
      isCustom: true,
    };

    saveCustomGame(game);
    toast({ title: 'Game saved!', description: `${game.name} has been added to your library.` });
    navigate(`/games/${game.id}`);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="font-heading text-3xl font-bold mb-6">Add New Game</h1>

        {/* AI Generator */}
        <div className="border-2 border-primary/30 bg-primary/5 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-accent" />
            <h2 className="font-heading text-lg font-bold">AI Game Generator</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Enter a board game name and our AI will generate a complete guide with setup steps, rules, tips, and more.
          </p>
          <div className="flex gap-2">
            <Input
              value={gameName}
              onChange={e => setGameName(e.target.value)}
              placeholder="e.g. Pandemic, Azul, Root..."
              className="bg-popover border-2 flex-1"
              disabled={isGenerating}
              onKeyDown={e => e.key === 'Enter' && handleGenerate()}
            />
            <Button onClick={handleGenerate} disabled={isGenerating} className="min-w-[140px]">
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Loading state */}
        {isGenerating && (
          <div className="border-2 border-border bg-card p-8 mb-6 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Generating game guide for <strong className="text-foreground">{gameName}</strong>...</p>
            <p className="text-xs text-muted-foreground mt-1">This may take 10-20 seconds</p>
          </div>
        )}

        {/* Generated Game Preview */}
        {generatedGame && !isGenerating && (
          <div className="border-2 border-success/30 bg-success/5 p-6 mb-6">
            <h2 className="font-heading text-lg font-bold text-success mb-4">✓ Game Guide Generated</h2>

            {generatedGame.imageUrl && (
              <div className="w-full h-48 overflow-hidden border-2 border-border mb-4">
                <img
                  src={generatedGame.imageUrl}
                  alt={generatedGame.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="space-y-3 text-sm">
              <div>
                <span className="text-muted-foreground font-mono text-xs">Name:</span>
                <p className="font-bold">{generatedGame.name}</p>
              </div>
              <div>
                <span className="text-muted-foreground font-mono text-xs">Description:</span>
                <p>{generatedGame.description}</p>
              </div>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span>👥 {generatedGame.playerCount}</span>
                <span>⏱ {generatedGame.playTime}</span>
                <span>📊 {generatedGame.complexity}</span>
                <span>🏷 {generatedGame.category}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-muted-foreground font-mono">Setup steps:</span>
                  <span className="ml-1">{generatedGame.setupSteps.length}</span>
                </div>
                <div>
                  <span className="text-muted-foreground font-mono">Learn steps:</span>
                  <span className="ml-1">{generatedGame.learnSteps.length}</span>
                </div>
                <div>
                  <span className="text-muted-foreground font-mono">Tips:</span>
                  <span className="ml-1">{generatedGame.tips.length}</span>
                </div>
                <div>
                  <span className="text-muted-foreground font-mono">Expansions:</span>
                  <span className="ml-1">{generatedGame.expansions.length}</span>
                </div>
              </div>
            </div>

            <Button onClick={handleSaveGenerated} className="w-full mt-4 h-12 text-base">
              <Save className="w-5 h-5 mr-2" /> Save to Library
            </Button>
          </div>
        )}

        {/* Manual toggle */}
        <button
          onClick={() => setShowManual(!showManual)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 font-mono"
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${showManual ? 'rotate-180' : ''}`} />
          Or add manually
        </button>

        {/* Manual Form */}
        {showManual && (
          <>
            <Section title="Basic Info">
              <Field label="Game Name *">
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Pandemic" className="bg-popover border-2" />
              </Field>
              <Field label="Description">
                <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description of the game..." className="bg-popover border-2" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Players">
                  <Input value={playerCount} onChange={e => setPlayerCount(e.target.value)} placeholder="2-4" className="bg-popover border-2" />
                </Field>
                <Field label="Play Time">
                  <Input value={playTime} onChange={e => setPlayTime(e.target.value)} placeholder="30-60 min" className="bg-popover border-2" />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Complexity">
                  <div className="flex gap-1">
                    {(['low', 'medium', 'high'] as Complexity[]).map(c => (
                      <button
                        key={c}
                        onClick={() => setComplexity(c)}
                        className={`flex-1 px-3 py-2 text-xs font-mono border-2 transition-colors ${
                          complexity === c ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/30'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label="Category">
                  <Input value={category} onChange={e => setCategory(e.target.value)} placeholder="Strategy" className="bg-popover border-2" />
                </Field>
              </div>
            </Section>

            <Section title="Setup Steps">
              <DynamicList items={setupSteps} setItems={setSetupSteps} placeholder="Step instruction..." onAdd={() => addItem(setSetupSteps)} onUpdate={(i, v) => updateItem(setSetupSteps, i, v)} onRemove={(i) => removeItem(setSetupSteps, i)} />
            </Section>

            <Section title="Learn Mode (5 Screens)">
              <Field label="🎯 Goal — What's the objective?">
                <Textarea value={learnGoal} onChange={e => setLearnGoal(e.target.value)} placeholder="Be the first to..." className="bg-popover border-2" rows={2} />
              </Field>
              <Field label="🛠️ Setup — How to set up">
                <Textarea value={learnSetup} onChange={e => setLearnSetup(e.target.value)} placeholder="Each player gets..." className="bg-popover border-2" rows={2} />
              </Field>
              <Field label="🔄 Turns — How turns work">
                <Textarea value={learnTurns} onChange={e => setLearnTurns(e.target.value)} placeholder="On your turn..." className="bg-popover border-2" rows={2} />
              </Field>
              <Field label="⚡ Actions — What you can do">
                <Textarea value={learnActions} onChange={e => setLearnActions(e.target.value)} placeholder="You can..." className="bg-popover border-2" rows={2} />
              </Field>
              <Field label="🏆 Scoring — How to win">
                <Textarea value={learnScoring} onChange={e => setLearnScoring(e.target.value)} placeholder="Points are scored by..." className="bg-popover border-2" rows={2} />
              </Field>
            </Section>

            <Section title="Quick Rules">
              <Field label="Turn Order">
                <DynamicList items={turnOrder} setItems={setTurnOrder} placeholder="Step..." onAdd={() => addItem(setTurnOrder)} onUpdate={(i, v) => updateItem(setTurnOrder, i, v)} onRemove={(i) => removeItem(setTurnOrder, i)} />
              </Field>
              <Field label="Actions">
                <DynamicList items={actions} setItems={setActions} placeholder="Action..." onAdd={() => addItem(setActions)} onUpdate={(i, v) => updateItem(setActions, i, v)} onRemove={(i) => removeItem(setActions, i)} />
              </Field>
              <Field label="Scoring">
                <DynamicList items={scoring} setItems={setScoring} placeholder="Scoring rule..." onAdd={() => addItem(setScoring)} onUpdate={(i, v) => updateItem(setScoring, i, v)} onRemove={(i) => removeItem(setScoring, i)} />
              </Field>
            </Section>

            <Section title="Beginner Tips">
              <DynamicList items={tips} setItems={setTips} placeholder="Tip for new players..." onAdd={() => addItem(setTips)} onUpdate={(i, v) => updateItem(setTips, i, v)} onRemove={(i) => removeItem(setTips, i)} />
            </Section>

            <Button onClick={handleSaveManual} className="w-full h-12 text-base mt-4">
              <Save className="w-5 h-5 mr-2" /> Save Game
            </Button>
          </>
        )}
      </div>
    </Layout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-2 border-border bg-card p-4 mb-4">
      <h2 className="font-heading text-lg font-bold mb-4">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground font-mono block mb-1">{label}</label>
      {children}
    </div>
  );
}

interface DynamicListProps {
  items: string[];
  setItems: React.Dispatch<React.SetStateAction<string[]>>;
  placeholder: string;
  onAdd: () => void;
  onUpdate: (index: number, value: string) => void;
  onRemove: (index: number) => void;
}

function DynamicList({ items, placeholder, onAdd, onUpdate, onRemove }: DynamicListProps) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <span className="text-xs text-muted-foreground font-mono mt-2.5 w-5 text-right flex-shrink-0">{i + 1}</span>
          <Input
            value={item}
            onChange={e => onUpdate(i, e.target.value)}
            placeholder={placeholder}
            className="bg-popover border-2 flex-1"
          />
          <button
            onClick={() => onRemove(i)}
            className="text-muted-foreground hover:text-destructive transition-colors p-2"
            type="button"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={onAdd} className="w-full border-dashed" type="button">
        <Plus className="w-3 h-3 mr-1" /> Add
      </Button>
    </div>
  );
}
