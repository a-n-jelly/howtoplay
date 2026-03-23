import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, Clock, BarChart3 } from 'lucide-react';
import { defaultGames } from '@/data/games';
import { useCustomGames } from '@/hooks/useCustomGames';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/Layout';
import SetupChecklist from '@/components/SetupChecklist';
import LearnStepper from '@/components/LearnStepper';
import QuickRulesSheet from '@/components/QuickRulesSheet';
import FirstPlayAssistant from '@/components/FirstPlayAssistant';
import ExpansionSelector from '@/components/ExpansionSelector';

export default function GamePage() {
  const { id } = useParams<{ id: string }>();
  const game = getGameById(id || '');
  const [selectedExpansion, setSelectedExpansion] = useState<string | null>(null);

  if (!game) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">Game not found.</p>
          <Link to="/games" className="text-primary text-sm hover:underline mt-2 inline-block">
            ← Back to library
          </Link>
        </div>
      </Layout>
    );
  }

  const expansion = game.expansions.find(e => e.id === selectedExpansion);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        {/* Back link */}
        <Link to="/games" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary font-mono mb-4 transition-colors">
          <ArrowLeft className="w-3 h-3" /> Back to library
        </Link>

        {/* Header */}
        <div className="border-2 border-border bg-card p-6 mb-6">
          <h1 className="font-heading text-3xl font-bold mb-2">{game.name}</h1>
          <p className="text-sm text-muted-foreground mb-4">{game.description}</p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Users className="w-3 h-3" />{game.playerCount} players</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{game.playTime}</span>
            <span className="flex items-center gap-1"><BarChart3 className="w-3 h-3" />{game.category}</span>
            <Badge variant="outline" className="text-xs">{game.complexity}</Badge>
          </div>
        </div>

        {/* Expansion selector */}
        {game.expansions.length > 0 && (
          <ExpansionSelector
            expansions={game.expansions}
            selected={selectedExpansion}
            onSelect={setSelectedExpansion}
          />
        )}

        {/* Expansion info */}
        {expansion && (
          <div className="border-2 border-accent/30 bg-accent/5 p-4 mb-6 text-sm">
            <h4 className="font-heading font-bold text-accent mb-1">{expansion.name}</h4>
            <p className="text-muted-foreground text-xs mb-2">{expansion.description}</p>
            <p className="text-xs text-muted-foreground">Players: {expansion.playerCount}</p>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="setup" className="w-full">
          <TabsList className="w-full grid grid-cols-4 bg-secondary border-2 border-border h-auto p-0">
            <TabsTrigger value="setup" className="font-mono text-xs py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-none border-r border-border">Setup</TabsTrigger>
            <TabsTrigger value="learn" className="font-mono text-xs py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-none border-r border-border">Learn</TabsTrigger>
            <TabsTrigger value="quick" className="font-mono text-xs py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-none border-r border-border">Quick Rules</TabsTrigger>
            <TabsTrigger value="first" className="font-mono text-xs py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-none">First Play</TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <TabsContent value="setup">
              <SetupChecklist
                steps={game.setupSteps}
                selectedExpansion={selectedExpansion || undefined}
              />
              {expansion && expansion.setupModifications.length > 0 && (
                <div className="mt-4 border-2 border-accent/30 bg-accent/5 p-4">
                  <h4 className="font-heading text-sm font-bold text-accent mb-2">📦 {expansion.name} Setup Changes</h4>
                  <ul className="space-y-1">
                    {expansion.setupModifications.map((m, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-accent">•</span> {m}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </TabsContent>

            <TabsContent value="learn">
              <LearnStepper steps={game.learnSteps} />
            </TabsContent>

            <TabsContent value="quick">
              <QuickRulesSheet
                rules={game.quickRules}
                expansionRules={expansion?.extraRules}
              />
              {expansion && expansion.extraActions.length > 0 && (
                <div className="mt-3 border-2 border-primary/30 bg-primary/5 p-4">
                  <h4 className="font-heading text-sm font-bold text-primary mb-2">📦 Extra Actions ({expansion.name})</h4>
                  <ul className="space-y-1">
                    {expansion.extraActions.map((a, i) => (
                      <li key={i} className="text-sm">• {a}</li>
                    ))}
                  </ul>
                </div>
              )}
            </TabsContent>

            <TabsContent value="first">
              <FirstPlayAssistant steps={game.firstPlaySteps} />
            </TabsContent>
          </div>
        </Tabs>

        {/* Tips */}
        {game.tips.length > 0 && (
          <div className="mt-8">
            <h3 className="font-heading text-lg font-bold mb-3">💡 Tips</h3>
            <div className="space-y-2">
              {game.tips.map((tip, i) => (
                <div
                  key={i}
                  className={`border-2 p-3 text-sm ${
                    tip.isBeginner
                      ? 'border-success/30 bg-success/5'
                      : 'border-accent/30 bg-accent/5'
                  }`}
                >
                  <span className="text-xs font-mono text-muted-foreground mr-2">
                    {tip.isBeginner ? '🟢 Beginner' : '🟠 Advanced'}
                  </span>
                  {tip.text}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
