import { DietaTabs, MacroDonut, PageTitle } from '../components/ui';
import { useApp } from '../context/AppContext';
import { percent } from '../lib/nutrition';

const ROWS = [
  { key: 'carbs', label: 'Carbo', color: 'bg-magenta', text: 'text-magenta' },
  { key: 'protein', label: 'Proteína', color: 'bg-turquesa', text: 'text-turquesaDark' },
  { key: 'fat', label: 'Grasas', color: 'bg-yellow', text: 'text-gold' },
  { key: 'fiber', label: 'Fibras', color: 'bg-[#E59A3A]', text: 'text-[#C56A2D]' },
];

export default function Macros() {
  const { consumed, targets } = useApp();
  return (
    <div>
      <DietaTabs />
      <PageTitle kicker="Del día" title="Análisis de macros" />
      <section className="flex items-center gap-4 rounded-[28px] bg-white p-5 shadow-card">
        <MacroDonut protein={consumed.protein} carbs={consumed.carbs} fat={consumed.fat} />
        <div>
          <p className="text-sm text-coach">El anillo reparte las calorías entre carbo, proteína y grasa. Los porcentajes de abajo comparan con tu meta.</p>
        </div>
      </section>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {ROWS.map((row) => {
          const value = consumed[row.key] || 0;
          const goal = targets[row.key] || 0;
          const pct = percent(value, goal);
          return (
            <article key={row.key} className="rounded-[24px] bg-white p-4 shadow-card">
              <p className="text-sm text-coach">{row.label}</p>
              <p className={`font-display text-3xl ${row.text}`}>{Math.round(value)}g</p>
              <p className="text-xs text-gris">{pct}% de {goal} g</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-bgTint">
                <div className={`h-full ${row.color}`} style={{ width: `${Math.min(100, pct)}%` }} />
              </div>
            </article>
          );
        })}
      </div>
      <p className="mt-4 text-xs leading-5 text-gris">Orientación general. No sustituye a un profesional de la salud.</p>
    </div>
  );
}
