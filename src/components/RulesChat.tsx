import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Game } from '@/data/types';
import { toast } from 'sonner';

type Msg = { role: 'user' | 'assistant'; content: string };

function serializeGameContext(game: Game): string {
  const lines: string[] = [`Game: ${game.name}`, `Players: ${game.playerCount}`, `Play Time: ${game.playTime}`, `Complexity: ${game.complexity}`, ''];

  if (game.setupSteps.length > 0) {
    lines.push('SETUP:');
    game.setupSteps.forEach(s => lines.push(`${s.stepNumber}. ${s.instruction}`));
    lines.push('');
  }

  if (game.quickRules) {
    const qr = game.quickRules;
    if (qr.turnOrder.length) { lines.push('TURN ORDER:'); qr.turnOrder.forEach((t, i) => lines.push(`${i + 1}. ${t}`)); lines.push(''); }
    if (qr.actions.length) { lines.push('ACTIONS:'); qr.actions.forEach(a => lines.push(`- ${a}`)); lines.push(''); }
    if (qr.scoring.length) { lines.push('SCORING:'); qr.scoring.forEach(s => lines.push(`- ${s}`)); lines.push(''); }
    if (qr.edgeCases.length) { lines.push('EDGE CASES:'); qr.edgeCases.forEach(e => lines.push(`- ${e}`)); lines.push(''); }
  }

  if (game.turnPhases.length > 0) {
    lines.push('TURN PHASES:');
    game.turnPhases.forEach(p => { lines.push(`${p.name}: ${p.description}`); p.actions.forEach(a => lines.push(`  - ${a}`)); });
    lines.push('');
  }

  if (game.actions.length > 0) {
    lines.push('DETAILED ACTIONS:');
    game.actions.forEach(a => { lines.push(`${a.name}: ${a.description}${a.cost ? ` (Cost: ${a.cost})` : ''}${a.example ? ` Example: ${a.example}` : ''}`); });
    lines.push('');
  }

  if (game.ruleSnippets.length > 0) {
    lines.push('RULES:');
    game.ruleSnippets.forEach(r => lines.push(`[${r.category}] ${r.text}${r.example ? ` (e.g. ${r.example})` : ''}`));
    lines.push('');
  }

  if (game.learnSteps.length > 0) {
    lines.push('HOW TO LEARN:');
    game.learnSteps.forEach(s => { lines.push(`${s.title}: ${s.content}`); s.tips?.forEach(t => lines.push(`  Tip: ${t}`)); });
    lines.push('');
  }

  if (game.tips.length > 0) {
    lines.push('TIPS:');
    game.tips.forEach(t => lines.push(`- ${t.isBeginner ? '[Beginner]' : '[Advanced]'} ${t.text}`));
    lines.push('');
  }

  if (game.expansions.length > 0) {
    lines.push('EXPANSIONS:');
    game.expansions.forEach(e => {
      lines.push(`${e.name} (${e.playerCount} players): ${e.description}`);
      if (e.setupModifications.length) e.setupModifications.forEach(m => lines.push(`  Setup: ${m}`));
      if (e.extraRules.length) e.extraRules.forEach(r => lines.push(`  Rule: ${r}`));
      if (e.extraActions.length) e.extraActions.forEach(a => lines.push(`  Action: ${a}`));
    });
  }

  return lines.join('\n');
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ask-rules`;

async function streamChat({
  gameContext, messages, onDelta, onDone, onError,
}: {
  gameContext: string; messages: Msg[];
  onDelta: (text: string) => void; onDone: () => void; onError: (msg: string) => void;
}) {
  const resp = await fetch(CHAT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ gameContext, messages }),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ error: 'Request failed' }));
    onError(err.error || `Error ${resp.status}`);
    return;
  }
  if (!resp.body) { onError('No response body'); return; }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buf = '';
  let done = false;

  while (!done) {
    const { done: readerDone, value } = await reader.read();
    if (readerDone) break;
    buf += decoder.decode(value, { stream: true });

    let idx: number;
    while ((idx = buf.indexOf('\n')) !== -1) {
      let line = buf.slice(0, idx);
      buf = buf.slice(idx + 1);
      if (line.endsWith('\r')) line = line.slice(0, -1);
      if (line.startsWith(':') || line.trim() === '') continue;
      if (!line.startsWith('data: ')) continue;
      const json = line.slice(6).trim();
      if (json === '[DONE]') { done = true; break; }
      try {
        const parsed = JSON.parse(json);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) onDelta(content);
      } catch {
        buf = line + '\n' + buf;
        break;
      }
    }
  }
  onDone();
}

export default function RulesChat({ game }: { game: Game }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const gameContext = useMemo(() => serializeGameContext(game), [game]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');

    const userMsg: Msg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    let assistantSoFar = '';
    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant') {
          return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
        }
        return [...prev, { role: 'assistant', content: assistantSoFar }];
      });
    };

    try {
      await streamChat({
        gameContext,
        messages: [...messages, userMsg],
        onDelta: upsert,
        onDone: () => setLoading(false),
        onError: (msg) => { toast.error(msg); setLoading(false); },
      });
    } catch {
      toast.error('Failed to connect to AI');
      setLoading(false);
    }
  }, [input, loading, messages, gameContext]);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
        aria-label="Ask about rules"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[calc(100vh-4rem)] border-2 border-border bg-card shadow-xl flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary">
        <span className="font-heading font-bold text-sm">🎲 Rules Q&A — {game.name}</span>
        <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-xs text-muted-foreground text-center mt-8">
            Ask me anything about {game.name}'s rules, setup, or strategy!
          </p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] px-3 py-2 text-sm ${
                m.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground border border-border'
              }`}
            >
              {m.role === 'assistant' ? (
                <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:m-0 [&>ul]:m-0 [&>ol]:m-0">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              ) : (
                m.content
              )}
            </div>
          </div>
        ))}
        {loading && messages[messages.length - 1]?.role !== 'assistant' && (
          <div className="flex justify-start">
            <div className="bg-secondary border border-border px-3 py-2 text-sm text-muted-foreground animate-pulse">
              Thinking…
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border p-3 flex gap-2">
        <Input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="Ask a rules question…"
          className="text-sm h-9"
          disabled={loading}
        />
        <Button size="sm" onClick={send} disabled={loading || !input.trim()} className="h-9 px-3">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
