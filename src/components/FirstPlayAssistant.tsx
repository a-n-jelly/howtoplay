import { useState } from 'react';
import { ChevronLeft, ChevronRight, Lightbulb } from 'lucide-react';
import { FirstPlayStep } from '@/data/types';
import { Button } from '@/components/ui/button';

interface Props {
  steps: FirstPlayStep[];
}

export default function FirstPlayAssistant({ steps }: Props) {
  const [current, setCurrent] = useState(0);
  const step = steps[current];

  return (
    <div>
      {/* Phase indicators */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
        {steps.map((s, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`px-3 py-1.5 text-xs font-mono border-2 whitespace-nowrap transition-colors ${
              i === current
                ? 'border-primary bg-primary/10 text-primary'
                : i < current
                ? 'border-success/50 bg-success/5 text-success'
                : 'border-border text-muted-foreground hover:border-primary/30'
            }`}
          >
            {s.phase}
          </button>
        ))}
      </div>

      {/* Current step */}
      <div className="border-2 border-border bg-card p-6 mb-4">
        <div className="text-xs text-muted-foreground font-mono mb-2">
          Phase {current + 1} of {steps.length}
        </div>
        <h3 className="font-heading text-xl font-bold mb-3">{step.phase}</h3>
        <p className="text-sm leading-relaxed mb-4">{step.instruction}</p>
        {step.hint && (
          <div className="border-2 border-accent/30 bg-accent/5 p-3 text-sm flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
            <span>{step.hint}</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => setCurrent(Math.max(0, current - 1))}
          disabled={current === 0}
          className="flex-1"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Previous Phase
        </Button>
        <Button
          onClick={() => setCurrent(Math.min(steps.length - 1, current + 1))}
          disabled={current === steps.length - 1}
          className="flex-1"
        >
          Next Phase <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
