import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { LearnStep } from '@/data/types';
import { Button } from '@/components/ui/button';

interface Props {
  steps: LearnStep[];
}

export default function LearnStepper({ steps }: Props) {
  const [current, setCurrent] = useState(0);
  const step = steps[current];

  return (
    <div>
      {/* Progress */}
      <div className="flex gap-1 mb-6">
        {steps.map((s, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`flex-1 h-2 transition-colors duration-150 ${
              i === current ? 'bg-primary' : i < current ? 'bg-success' : 'bg-secondary'
            }`}
          />
        ))}
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-muted-foreground font-mono">
          {current + 1} / {steps.length}
        </span>
        <div className="flex gap-1">
          {steps.map((s, i) => (
            <span
              key={i}
              className={`text-xs px-2 py-0.5 border cursor-pointer transition-colors ${
                i === current ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground hover:border-primary/30'
              }`}
              onClick={() => setCurrent(i)}
            >
              {s.title.split(' ')[0]}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="border-2 border-border bg-card p-6 mb-4">
        <h3 className="font-heading text-2xl font-bold mb-4">{step.title}</h3>
        <p className="text-sm leading-relaxed text-foreground mb-4">{step.content}</p>
        {step.tips && step.tips.length > 0 && (
          <div className="space-y-2">
            {step.tips.map((tip, i) => (
              <div key={i} className="border-2 border-accent/30 bg-accent/5 p-3 text-sm">
                <span className="text-accent font-bold">💡 Tip:</span>{' '}
                <span className="text-foreground">{tip}</span>
              </div>
            ))}
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
          <ChevronLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <Button
          onClick={() => setCurrent(Math.min(steps.length - 1, current + 1))}
          disabled={current === steps.length - 1}
          className="flex-1"
        >
          Next <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
