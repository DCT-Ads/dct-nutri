import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { recipes } from '../data/recipes';
import { menuForDay, activeMeal } from '../data/seca';
import { DietaTabs, PageTitle, Segmented } from '../components/ui';
import { useApp } from '../context/AppContext';

export default function Compras() {
  const { recipeWeek, shoppingChecked, toggleShop, seca } = useApp();
  const [mode, setMode] = useState('recetas');
  const items = useMemo(() => {
    const map = new Map();
    if (mode === 'recetas') {
      recipes.filter((recipe) => recipeWeek.includes(recipe.id)).forEach((recipe) => {
        recipe.ingredients.forEach((item) => {
          const prev = map.get(item.name) || [];
          prev.push(item.qty);
          map.set(item.name, prev);
        });
      });
    } else if (seca.active) {
      const start = Math.floor(seca.dayCursor / 7) * 7;
      for (let day = start; day < start + 7 && day < 21; day += 1) {
        menuForDay(day).forEach((meal) => {
          const chosen = activeMeal(meal, Boolean(seca.swaps[`${day}:${meal.slot}`]));
          chosen.ingredients.forEach((name) => {
            const prev = map.get(name) || [];
            prev.push('1');
            map.set(name, prev);
          });
        });
      }
    }
    return [...map.entries()].map(([name, qty]) => ({ name, detail: qty.join(' · ') }));
  }, [mode, recipeWeek, seca]);

  return (
    <div>
      <DietaTabs />
      <PageTitle kicker="Se arma sola" title="Lista de compras" />
      <Segmented
        value={mode}
        onChange={setMode}
        options={[{ id: 'recetas', label: 'Recetas' }, { id: 'reto', label: 'Reto 21' }]}
      />
      {mode === 'reto' && !seca.active ? (
        <p className="rounded-[24px] bg-yellowSoft p-4 text-sm">El reto todavía no empezó. <Link to="/dieta/seca-21-dias" className="font-semibold">Abrir Seca en 21 días</Link></p>
      ) : null}
      <div className="grid gap-2">
        {items.map((item) => (
          <label key={item.name} className="flex items-start gap-3 rounded-2xl bg-white p-3 shadow-card">
            <input type="checkbox" checked={Boolean(shoppingChecked[item.name])} onChange={() => toggleShop(item.name)} className="mt-1 accent-magenta" />
            <span>
              <span className={`block font-medium ${shoppingChecked[item.name] ? 'text-gris line-through' : ''}`}>{item.name}</span>
              <span className="text-xs text-coach">{item.detail}</span>
            </span>
          </label>
        ))}
        {items.length === 0 && !(mode === 'reto' && !seca.active) ? <p className="text-sm text-coach">No hay ingredientes en esta lista.</p> : null}
      </div>
    </div>
  );
}
