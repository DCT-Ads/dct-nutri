import { Link } from 'react-router-dom';
import { PageTitle, WeightChart } from '../components/ui';
import { useApp } from '../context/AppContext';
import { currentWeek, formatKcal, formatLiters } from '../lib/format';

export default function Progreso() {
  const { workoutsDone, streak, consumed, plan, waterMl, waterGoal, weightLog, profile } = useApp();
  const week = currentWeek().map((day) => day.iso);
  const weekCount = workoutsDone.filter((item) => week.includes(item.date)).length;
  const byCategory = ['gluteos', 'piernas', 'abdomen'].map((category) => ({
    category,
    count: workoutsDone.filter((item) => item.category === category).length,
  }));
  const labels = { gluteos: 'Glúteos', piernas: 'Piernas', abdomen: 'Abdomen' };

  return (
    <div>
      <PageTitle kicker="Tu constancia" title="Progreso" />
      <div className="grid grid-cols-2 gap-2">
        <article className="rounded-[24px] bg-yellowSoft p-4"><p className="text-xs text-gold">Racha</p><p className="font-display text-3xl">{streak}</p><p className="text-xs text-coach">días seguidos</p></article>
        <article className="rounded-[24px] bg-white p-4 shadow-card"><p className="text-xs text-coach">Entrenos de la semana</p><p className="font-display text-3xl">{weekCount}</p></article>
        <article className="rounded-[24px] bg-white p-4 shadow-card"><p className="text-xs text-coach">Calorías de hoy</p><p className="font-display text-3xl">{formatKcal(consumed.kcal)}</p><p className="text-xs text-gris">de {formatKcal(plan.target)}</p></article>
        <article className="rounded-[24px] bg-turqCard p-4"><p className="text-xs text-turquesaDark">Agua</p><p className="font-display text-3xl">{formatLiters(waterMl)}L</p><p className="text-xs text-coach">de {formatLiters(waterGoal)}L</p></article>
      </div>
      <section className="mt-4 rounded-[24px] bg-white p-4 shadow-card">
        <h2 className="font-semibold">Por zona</h2>
        {byCategory.map((item) => (
          <div key={item.category} className="mt-3">
            <div className="flex justify-between text-sm"><span>{labels[item.category]}</span><span>{item.count}</span></div>
            <div className="mt-1 h-2 rounded-full bg-bgTint"><div className="h-full rounded-full bg-magenta" style={{ width: `${Math.min(100, item.count * 20)}%` }} /></div>
          </div>
        ))}
      </section>
      <section className="mt-4 rounded-[24px] bg-white p-4 shadow-card">
        <h2 className="mb-2 font-semibold">Peso</h2>
        <WeightChart points={weightLog} goal={Number(profile.goalKg)} />
        <Link to="/dieta/peso" className="text-sm font-semibold text-magenta">Registrar peso →</Link>
      </section>
    </div>
  );
}
