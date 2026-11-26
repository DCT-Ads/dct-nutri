import { useState } from 'react';
import { Button, DietaTabs, PageTitle, WeightChart } from '../components/ui';
import { useApp } from '../context/AppContext';

export default function Peso() {
  const { profile, weightLog, saveProfile } = useApp();
  const [value, setValue] = useState(String(profile.weightKg));
  const initial = weightLog[0]?.kg ?? profile.weightKg;
  const delta = +(profile.weightKg - initial).toFixed(1);

  return (
    <div>
      <DietaTabs />
      <PageTitle kicker="Sin prisa" title="Progreso de peso" />
      <div className="grid grid-cols-3 gap-2">
        {[
          ['Inicial', initial],
          ['Actual', profile.weightKg],
          ['Meta', profile.goalKg],
        ].map(([label, kg]) => (
          <article key={label} className="rounded-[22px] bg-white p-3 text-center shadow-card">
            <p className="text-xs text-coach">{label}</p>
            <p className="font-display text-2xl">{kg}</p>
          </article>
        ))}
      </div>
      <p className="mt-3 text-sm text-coach">{delta === 0 ? 'Hoy estás en el mismo punto de partida.' : delta < 0 ? `Llevas ${Math.abs(delta)} kg por debajo del inicio.` : `El número subió ${delta} kg. El peso no lo dice todo.`}</p>
      <section className="mt-4 rounded-[28px] bg-white p-4 shadow-card">
        <WeightChart points={weightLog} goal={Number(profile.goalKg)} />
        <p className="text-xs text-gris">La línea punteada es tu meta.</p>
      </section>
      <form
        className="mt-4 grid gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          const kg = Number(value);
          if (kg >= 40 && kg <= 180) saveProfile({ weightKg: kg });
        }}
      >
        <input value={value} onChange={(event) => setValue(event.target.value)} inputMode="decimal" className="h-12 rounded-2xl bg-white px-4 shadow-card outline-none" aria-label="Peso de hoy" />
        <Button type="submit" className="w-full">Registrar peso de hoy</Button>
      </form>
    </div>
  );
}
