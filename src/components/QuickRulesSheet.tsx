import { QuickRules } from '@/data/types';

interface Props {
  rules: QuickRules;
  expansionRules?: string[];
}

function RuleSection({ title, items, icon }: { title: string; items: string[]; icon: string }) {
  return (
    <div className="border-2 border-border bg-card p-4">
      <h4 className="font-heading text-sm font-bold mb-3 text-primary flex items-center gap-2">
        <span>{icon}</span> {title}
      </h4>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="text-sm flex items-start gap-2">
            <span className="text-muted-foreground font-mono text-xs mt-0.5 flex-shrink-0">{String(i + 1).padStart(2, '0')}</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function QuickRulesSheet({ rules, expansionRules }: Props) {
  return (
    <div className="space-y-3">
      <RuleSection title="Turn Order" items={rules.turnOrder} icon="🔄" />
      <RuleSection title="Actions" items={rules.actions} icon="⚡" />
      <RuleSection title="Scoring" items={rules.scoring} icon="🏆" />
      <RuleSection title="Edge Cases" items={rules.edgeCases} icon="⚠️" />
      {expansionRules && expansionRules.length > 0 && (
        <RuleSection title="Expansion Rules" items={expansionRules} icon="📦" />
      )}
    </div>
  );
}
