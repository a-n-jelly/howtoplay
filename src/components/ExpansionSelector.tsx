import { Expansion } from '@/data/types';

interface Props {
  expansions: Expansion[];
  selected: string | null;
  onSelect: (id: string | null) => void;
}

export default function ExpansionSelector({ expansions, selected, onSelect }: Props) {
  if (expansions.length === 0) return null;

  return (
    <div className="mb-4">
      <label className="text-xs text-muted-foreground font-mono block mb-2">Expansion</label>
      <div className="flex flex-wrap gap-1">
        <button
          onClick={() => onSelect(null)}
          className={`px-3 py-1.5 text-xs font-mono border-2 transition-colors ${
            selected === null
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border text-muted-foreground hover:border-primary/30'
          }`}
        >
          Base Game
        </button>
        {expansions.map(exp => (
          <button
            key={exp.id}
            onClick={() => onSelect(exp.id)}
            className={`px-3 py-1.5 text-xs font-mono border-2 transition-colors ${
              selected === exp.id
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border text-muted-foreground hover:border-primary/30'
            }`}
          >
            {exp.name}
          </button>
        ))}
      </div>
    </div>
  );
}
