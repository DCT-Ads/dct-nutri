import { Link } from 'react-router-dom';
import { DietaTabs, PageTitle } from '../components/ui';
import { useApp } from '../context/AppContext';
import { formatKcal } from '../lib/format';

export default function Plan() {
  const { plan, targets, profile } = useApp();
  const slots = [
    ['Desayuno', 0.25],
    ['Almuerzo', 0.35],
    ['Merienda', 0.15],
    ['Cena', 0.25],
  ];
  return (
    <div>
      <DietaTabs />
      <PageTitle kicker={profile.name ? `Para ${profile.name.split(' ')[0]}` : 'Tu meta'} title="Mi plan" />
      <section className="rounded-[28px] bg-magenta p-5 text-white shadow-cta">
        <p className="text-sm text-white/80">Meta</p>
        <p className="font-display text-5xl">{formatKcal(plan.target)}</p>
        <p className="text-lg">kcal / día</p>
      </section>
      <p className="mt-3 text-sm leading-6 text-coach">
        {plan.maintaining
          ? 'Tu meta no pide déficit. Mantenemos tu energía.'
          : `Tu gasto estimado es ${formatKcal(plan.tdee)} kcal. La meta deja un margen para bajar con calma.`}
        {plan.minApplied ? ' Ajustamos el mínimo para cuidarte.' : ''}
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {[
          ['Proteína', targets.protein],
          ['Carbo', targets.carbs],
          ['Grasas', targets.fat],
          ['Fibra', targets.fiber],
        ].map(([label, value]) => (
          <article key={label} className="rounded-[22px] bg-white p-4 shadow-card">
            <p className="text-sm text-coach">{label}</p>
            <p className="font-display text-2xl">{value} g</p>
          </article>
        ))}
      </div>
      <section className="mt-4 rounded-[24px] bg-white p-4 shadow-card">
        <h2 className="font-semibold">Cómo repartir el día</h2>
        {slots.map(([label, share]) => (
          <div key={label} className="mt-3 flex items-center justify-between text-sm">
            <span>{label}</span>
            <span className="font-semibold">{formatKcal(plan.target * share)} kcal</span>
          </div>
        ))}
      </section>
      <div className="mt-4 grid gap-2">
        <Link to="/dieta/recetas" className="rounded-2xl bg-white px-4 py-4 font-semibold shadow-card">Ver recetas</Link>
        <Link to="/dieta/seca-21-dias" className="rounded-2xl bg-yellowSoft px-4 py-4 font-semibold">Seca en 21 días</Link>
      </div>
      <p className="mt-4 text-xs leading-5 text-gris">Orientación general, no sustituye a un profesional de la salud.</p>
    </div>
  );
}
