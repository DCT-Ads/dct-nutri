import { useEffect, useState } from 'react';
import { activeMeal, dayTotals, menuForDay } from '../data/seca';
import { Button, DietaTabs, MacroChips } from '../components/ui';
import { useApp } from '../context/AppContext';
import { formatKcal } from '../lib/format';

const HABITS = [
  { id: 'water', icon: '💧', label: 'Agua completa' },
  { id: 'menu', icon: '🍽️', label: 'Seguí el menú' },
  { id: 'sugar', icon: '🚫', label: 'Sin azúcar añadida' },
];

export default function Seca() {
  const seca = useApp().seca;
  if (!seca.active) return <Intro />;
  if (seca.finished) return <Result />;
  return <Day />;
}

function Intro() {
  const { startSeca, t } = useApp();
  return (
    <div>
      <DietaTabs />
      <p className="text-sm font-semibold text-magentaText">{t('seca.introK')}</p>
      <h1 className="font-display text-4xl leading-none">{t('home.seca')}</h1>
      <p className="mt-3 text-sm leading-6 text-coach">{t('seca.intro')}</p>
      <div className="mt-5 grid grid-cols-7 gap-1">
        {Array.from({ length: 21 }, (_, index) => (
          <span key={index} className="grid h-8 place-items-center rounded-full bg-white text-[11px] font-semibold text-coach shadow-card">{index + 1}</span>
        ))}
      </div>
      <ul className="mt-5 grid gap-2 text-sm">
        <li className="rounded-2xl bg-white p-3 shadow-card">{t('seca.b1')}</li>
        <li className="rounded-2xl bg-white p-3 shadow-card">{t('seca.b2')}</li>
        <li className="rounded-2xl bg-white p-3 shadow-card">{t('seca.b3')}</li>
      </ul>
      <Button className="mt-6 w-full" onClick={startSeca}>{t('seca.go')}</Button>
    </div>
  );
}

function Day() {
  const { seca, toggleCheck, toggleSwap, closeSecaDay, waterMl, waterGoal, t, tr } = useApp();
  const [view, setView] = useState(seca.dayCursor);
  useEffect(() => setView(seca.dayCursor), [seca.dayCursor]);
  const day = view;
  const menu = menuForDay(day);
  const totals = dayTotals(day, seca.swaps);
  const checks = seca.checks[String(seca.dayCursor)] || {};
  const isCurrent = day === seca.dayCursor;
  const radius = 46;
  const circ = 2 * Math.PI * radius;
  const progress = ((seca.dayCursor + (isCurrent ? 0.15 : 1)) / 21) * circ;

  return (
    <div>
      <DietaTabs />
      <div className="flex items-center gap-4">
        <svg viewBox="0 0 120 120" className="h-24 w-24">
          <circle cx="60" cy="60" r={radius} stroke="#FBDEEC" strokeWidth="10" fill="none" />
          <circle cx="60" cy="60" r={radius} stroke="#E5198D" strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray={`${Math.min(circ, progress)} ${circ}`} transform="rotate(-90 60 60)" />
          <text x="60" y="56" textAnchor="middle" fontSize="12" fill="#7B6772">{t('seca.day', { n: '' }).split(' ')[0]}</text>
          <text x="60" y="76" textAnchor="middle" fontSize="20" fontWeight="700" fill="#3A2336">{seca.dayCursor + 1}/21</text>
        </svg>
        <div>
          <h1 className="font-display text-3xl leading-none">{t('home.seca')}</h1>
          <p className="mt-1 text-sm text-coach">{t('seca.menuKcal', { n: formatKcal(totals.kcal) })}</p>
        </div>
      </div>
      <div className="no-scrollbar mt-4 flex gap-1.5 overflow-x-auto">
        {Array.from({ length: 21 }, (_, index) => (
          <button key={index} type="button" disabled={index > seca.dayCursor} onClick={() => setView(index)} className={`h-8 w-8 shrink-0 rounded-full text-xs font-semibold ${index === day ? 'bg-magenta text-white' : index < seca.dayCursor ? 'bg-rosaPill text-magentaText' : 'bg-white text-gris'}`}>{index + 1}</button>
        ))}
      </div>
      <div className="mt-4 grid gap-3">
        {menu.map((item) => {
          const swapped = Boolean(seca.swaps[`${day}:${item.slot}`]);
          const chosen = activeMeal(item, swapped);
          return (
            <article key={item.slot} className="rounded-[24px] bg-white p-4 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-wide text-magentaText">{t(`meal.${item.slot.startsWith('snack') ? 'merienda' : item.slot}`)}</p>
              <h2 className="font-display text-xl">{tr(chosen.name)}</h2>
              <p className="text-sm text-coach">{chosen.kcal} kcal</p>
              <MacroChips carbs={chosen.carbs} protein={chosen.protein} fat={chosen.fat} fiber={chosen.fiber} />
              {isCurrent ? (
                <button type="button" className="mt-3 text-sm font-semibold text-magenta" onClick={() => toggleSwap(day, item.slot)}>
                  {swapped ? t('seca.swapBack') : t('seca.swap', { name: tr(item.swap.name) })}
                </button>
              ) : null}
              {swapped ? <p className="mt-1 text-xs text-coach">{tr(item.swap.note)}</p> : null}
            </article>
          );
        })}
      </div>
      <section className="mt-4 rounded-[24px] bg-white p-4 shadow-card">
        <h2 className="font-semibold">{t('seca.habits')}</h2>
        {waterMl >= waterGoal ? <p className="mt-1 text-xs text-turquesaDark">{t('seca.waterDone')}</p> : null}
        <div className="mt-3 grid gap-2">
          {HABITS.map((habit) => {
            const on = Boolean(checks[habit.id]);
            return (
              <button key={habit.id} type="button" disabled={!isCurrent} onClick={() => toggleCheck(habit.id)} className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-left ${on ? 'bg-rosaPill' : 'bg-bg'}`}>
                <span>{habit.icon}</span>
                <span className="flex-1 font-medium">{t(`habit.${habit.id}`)}</span>
                <span className={`h-5 w-5 rounded-full border-2 ${on ? 'border-magenta bg-magenta' : 'border-rosaCard'}`} />
              </button>
            );
          })}
        </div>
        {isCurrent ? <Button className="mt-4 w-full" onClick={closeSecaDay}>{seca.dayCursor === 20 ? t('seca.closeAll') : t('seca.close')}</Button> : <p className="mt-3 text-sm text-coach">{t('seca.past')}</p>}
        <p className="mt-2 text-xs text-gris">{t('seca.soft')}</p>
      </section>
    </div>
  );
}

function Result() {
  const { seca, setEndWeight, restartSeca, t } = useApp();
  const [value, setValue] = useState(seca.endWeight ? String(seca.endWeight) : '');
  const saved = seca.endWeight != null;
  const diff = saved ? +(seca.startWeight - seca.endWeight).toFixed(1) : null;
  return (
    <div>
      <DietaTabs />
      <p className="text-sm font-semibold text-magenta">{t('seca.care')}</p>
      <h1 className="font-display text-4xl leading-none">{t('seca.your')}</h1>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <article className="rounded-[22px] bg-white p-4 shadow-card"><p className="text-xs text-coach">{t('seca.begin')}</p><p className="font-display text-3xl">{seca.startWeight}</p></article>
        <article className="rounded-[22px] bg-rosaPill p-4"><p className="text-xs text-magentaText">{t('seca.end')}</p><p className="font-display text-3xl">{saved ? seca.endWeight : '—'}</p></article>
      </div>
      {saved ? <p className="mt-3 text-sm text-coach">{diff > 0 ? t('seca.diffDown', { n: diff }) : diff < 0 ? t('seca.diffUp') : t('seca.diffSame')}</p> : null}
      <form className="mt-4 grid gap-2" onSubmit={(event) => { event.preventDefault(); const kg = Number(value); if (kg >= 40 && kg <= 180) setEndWeight(kg); }}>
        <input value={value} onChange={(event) => setValue(event.target.value)} inputMode="decimal" placeholder={t('seca.weightPh')} className="h-12 rounded-2xl bg-white px-4 shadow-card outline-none" />
        <Button type="submit" className="w-full">{t('seca.save')}</Button>
      </form>
      <button type="button" onClick={restartSeca} className="mt-4 text-sm font-semibold text-coach">{t('seca.again')}</button>
    </div>
  );
}
