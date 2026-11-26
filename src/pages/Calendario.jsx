import { useState } from 'react';
import { DietaTabs, PageTitle } from '../components/ui';
import { useApp } from '../context/AppContext';
import { isoDate, monthMatrix } from '../lib/format';
import { sumDiary } from '../lib/nutrition';
import { formatKcal } from '../lib/format';

export default function Calendario() {
  const { diary, workoutsDone, today } = useApp();
  const [cursor, setCursor] = useState(() => new Date());
  const [selected, setSelected] = useState(today);
  const matrix = monthMatrix(cursor);
  const meals = diary.filter((item) => item.date === selected);
  const trains = workoutsDone.filter((item) => item.date === selected);
  const totals = sumDiary(meals);

  function shift(delta) {
    const next = new Date(cursor);
    next.setMonth(next.getMonth() + delta);
    setCursor(next);
  }

  return (
    <div>
      <DietaTabs />
      <PageTitle kicker="Tu mes" title="Calendario" />
      <section className="rounded-[28px] bg-white p-4 shadow-card">
        <div className="mb-3 flex items-center justify-between">
          <button type="button" onClick={() => shift(-1)} className="h-9 w-9 rounded-full bg-bgTint" aria-label="Mes anterior">‹</button>
          <p className="font-display text-xl capitalize">{matrix.label}</p>
          <button type="button" onClick={() => shift(1)} className="h-9 w-9 rounded-full bg-bgTint" aria-label="Mes siguiente">›</button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-gris">
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((letter, index) => <span key={`${letter}-${index}`}>{letter}</span>)}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {matrix.cells.map((cell, index) => {
            if (!cell) return <span key={`e-${index}`} />;
            const hasMeal = diary.some((item) => item.date === cell.iso);
            const hasTrain = workoutsDone.some((item) => item.date === cell.iso);
            const on = selected === cell.iso;
            return (
              <button key={cell.iso} type="button" onClick={() => setSelected(cell.iso)} className={`flex h-11 flex-col items-center justify-center rounded-2xl text-sm ${on ? 'bg-magenta text-white' : cell.iso === isoDate() ? 'ring-2 ring-magenta' : 'bg-bg'}`}>
                {cell.date}
                <span className="flex gap-0.5">
                  {hasMeal ? <i className={`h-1 w-1 rounded-full ${on ? 'bg-white' : 'bg-magenta'}`} /> : null}
                  {hasTrain ? <i className={`h-1 w-1 rounded-full ${on ? 'bg-white' : 'bg-turquesa'}`} /> : null}
                </span>
              </button>
            );
          })}
        </div>
      </section>
      <section className="mt-4 rounded-[24px] bg-white p-4 shadow-card">
        <p className="text-sm text-coach">{selected}</p>
        <p className="font-display text-3xl">{formatKcal(totals.kcal)} kcal</p>
        <p className="text-sm text-coach">{meals.length} comidas · {trains.length} entrenos</p>
        {meals.length + trains.length === 0 ? <p className="mt-2 text-sm text-coach">Este día no tiene registros en la sesión.</p> : null}
      </section>
    </div>
  );
}
