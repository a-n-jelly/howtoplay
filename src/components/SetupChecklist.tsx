import { useState } from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { SetupStep } from '@/data/types';
import { Button } from '@/components/ui/button';

interface Props {
  steps: SetupStep[];
  selectedExpansion?: string;
  playerCount?: number;
}

export default function SetupChecklist({ steps, selectedExpansion, playerCount }: Props) {
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  const filteredSteps = steps.filter(s => {
    if (s.expansionId && s.expansionId !== selectedExpansion) return false;
    if (s.minPlayers && playerCount && playerCount < s.minPlayers) return false;
    return true;
  });

  const toggle = (n: number) => {
    setCompleted(prev => {
      const next = new Set(prev);
      next.has(n) ? next.delete(n) : next.add(n);
      return next;
    });
  };

  const allDone = filteredSteps.every(s => completed.has(s.stepNumber));
  const progress = filteredSteps.length > 0 ? (completed.size / filteredSteps.length) * 100 : 0;

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>{completed.size}/{filteredSteps.length} steps</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-secondary border border-border">
          <div
            className="h-full bg-success transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {allDone && (
        <div className="mb-4 p-3 border-2 border-success bg-success/10 text-success text-sm font-heading font-bold">
          ✅ Setup complete! You're ready to play!
        </div>
      )}

      <div className="space-y-2">
        {filteredSteps.map((step) => {
          const done = completed.has(step.stepNumber);
          return (
            <button
              key={step.stepNumber}
              onClick={() => toggle(step.stepNumber)}
              className={`w-full text-left p-3 border-2 transition-all duration-150 flex items-start gap-3 ${
                done
                  ? 'border-success/50 bg-success/5'
                  : 'border-border hover:border-primary/30 bg-card'
              }`}
            >
              <div className={`w-6 h-6 flex-shrink-0 border-2 flex items-center justify-center mt-0.5 transition-colors ${
                done ? 'border-success bg-success text-success-foreground' : 'border-border'
              }`}>
                {done && <Check className="w-4 h-4" />}
              </div>
              <div className="flex-1">
                <span className="text-xs text-muted-foreground">Step {step.stepNumber}</span>
                <p className={`text-sm ${done ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                  {step.instruction}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
            </button>
          );
        })}
      </div>

      {!allDone && (
        <Button
          onClick={() => {
            const next = filteredSteps.find(s => !completed.has(s.stepNumber));
            if (next) toggle(next.stepNumber);
          }}
          className="w-full mt-4"
        >
          Complete Next Step
        </Button>
      )}
    </div>
  );
}
