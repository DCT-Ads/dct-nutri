import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchFoods } from '../data/foods';
import { DietaTabs, MacroChips, PageTitle } from '../components/ui';
import { useApp } from '../context/AppContext';
import { formatKcal, mealByHour } from '../lib/format';

const PERIODS = ['today', 'week', 'month'];
const MACRO_FIELDS = [
  ['kcal', 'kcal'],
  ['protein', 'macros.protein'],
  ['carbs', 'macros.carbs'],
  ['fat', 'macros.fat'],
  ['fiber', 'macros.fiber'],
];

function inWindow(date, period, today) {
  if (period === 'today') return date === today;
  const then = new Date(`${date}T12:00:00`);
  const now = new Date(`${today}T12:00:00`);
  if (then > now) return false;
  if (period === 'week') return (now - then) / 86400000 < 7;
  return then.getFullYear() === now.getFullYear() && then.getMonth() === now.getMonth();
}

function labelDate(iso, language) {
  const locale = language === 'pt' ? 'pt-BR' : language;
  return new Date(`${iso}T12:00:00`).toLocaleDateString(locale, { weekday: 'short', day: 'numeric', month: 'short' });
}

const MEALS = ['desayuno', 'almuerzo', 'merienda', 'cena'];

export default function Comidas() {
  const { diary, today, consumed, plan, addFood, removeFood, updateFood, language, t, tr } = useApp();
  const [params] = useSearchParams();
  const [query, setQuery] = useState('');
  const [logQuery, setLogQuery] = useState('');
  const [period, setPeriod] = useState('today');
  const [open, setOpen] = useState(params.get('buscar') === '1');
  const [picked, setPicked] = useState(null);
  const [qty, setQty] = useState(1);
  const [meal, setMeal] = useState(mealByHour());
  const [selected, setSelected] = useState(null);
  const [draft, setDraft] = useState(null);
  const [editing, setEditing] = useState(false);
  const results = useMemo(() => searchFoods(query).slice(0, 8), [query]);
  const needle = logQuery.trim().toLocaleLowerCase();
  const visible = diary.filter((item) => inWindow(item.date, period, today) && (!needle || `${tr(item.name)} ${item.name}`.toLocaleLowerCase().includes(needle)));
  const dates = [...new Set(visible.map((item) => item.date))].sort().reverse();

  function confirm() {
    if (!picked) return;
    addFood({ ...picked, qty, meal, source: 'manual' });
    setPicked(null);
    setOpen(false);
    setQuery('');
  }

  return (
    <div>
      <DietaTabs />
      <PageTitle kicker={`${formatKcal(consumed.kcal)} / ${formatKcal(plan.target)} kcal`} title={t('mod.diary.t')} action={
        <button type="button" onClick={() => setOpen(true)} className="rounded-full bg-magenta px-3 py-2 text-xs font-semibold text-white">{t('diary.search')}</button>
      } />
      <div className="mb-3 flex gap-2">
        {PERIODS.map((id) => (
          <button key={id} type="button" onClick={() => setPeriod(id)} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${period === id ? 'bg-magenta text-white' : 'bg-white text-carbon shadow-card'}`}>{t(`diary.${id}`)}</button>
        ))}
      </div>
      <input value={logQuery} onChange={(event) => setLogQuery(event.target.value)} placeholder={t('diary.logPh')} className="mb-4 h-11 w-full rounded-2xl bg-white px-4 text-sm shadow-card outline-none" />
      {dates.length === 0 ? <p className="rounded-[24px] bg-white p-4 text-sm text-coach shadow-card">{t('diary.empty')}</p> : null}
      <div className="grid gap-4">
        {dates.map((date) => {
          const groups = MEALS.map((id) => ({ id, items: visible.filter((item) => item.date === date && item.meal === id) })).filter((group) => group.items.length);
          return (
            <section key={date}>
              {period !== 'today' ? <h2 className="mb-2 text-sm font-semibold capitalize text-magentaText">{labelDate(date, language)}</h2> : null}
              {groups.map((group) => (
                <div key={group.id} className="mb-3">
                  <h3 className="mb-2 text-sm font-semibold text-coach">{t(`meal.${group.id}`)}</h3>
                  <div className="grid gap-2">
                    {group.items.map((item) => (
                      <button key={item.id} type="button" onClick={() => { setSelected(item); setDraft({ kcal: item.kcal, protein: item.protein, carbs: item.carbs, fat: item.fat, fiber: item.fiber }); setEditing(false); }} className="flex items-center gap-3 rounded-[22px] bg-white p-3 text-left shadow-card">
                        <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-2xl bg-rosaPill">
                          {item.preview ? <img src={item.preview} alt="" className="h-full w-full object-cover" /> : '🍽️'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold">{tr(item.name)}</p>
                          <p className="text-xs text-coach">{item.time}</p>
                        </div>
                        <p className="text-sm font-semibold">{formatKcal(item.kcal)}</p>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          );
        })}
      </div>

      {selected ? (
        <div className="fixed inset-0 z-50 flex justify-center">
          <button type="button" className="absolute inset-0 bg-carbon/40" aria-label="Cerrar" onClick={() => setSelected(null)} />
          <div className="relative mt-auto w-full max-w-[430px] rounded-t-[28px] bg-white p-5">
            <p className="font-display text-5xl">{formatKcal(selected.kcal)} <span className="text-xl">kcal</span></p>
            <p className="mt-1 font-semibold">{tr(selected.name)}</p>
            <div className="mt-3"><MacroChips {...(editing ? draft : selected)} /></div>
            {editing && draft ? (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {MACRO_FIELDS.map(([key, label]) => (
                  <label key={key} className="text-[11px] font-semibold text-coach">
                    {key === 'kcal' ? 'kcal' : t(label)}
                    <input inputMode="decimal" value={draft[key]} onChange={(event) => setDraft((current) => ({ ...current, [key]: event.target.value }))} className="mt-1 h-10 w-full rounded-xl bg-bgTint px-3 text-sm font-semibold text-carbon outline-none" />
                  </label>
                ))}
              </div>
            ) : null}
            <div className="mt-4 flex items-center justify-between">
              <button type="button" className="text-sm font-semibold text-magenta" onClick={() => { removeFood(selected.id); setSelected(null); }}>{t('diary.remove')}</button>
              {editing ? (
                <button type="button" className="rounded-full bg-magenta px-4 py-2 text-sm font-semibold text-white" onClick={() => { updateFood(selected.id, draft); setSelected(null); }}>{t('diary.saveEdit')}</button>
              ) : (
                <button type="button" className="text-sm font-semibold" onClick={() => setEditing(true)}>{t('diary.edit')}</button>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {open ? (
        <div className="fixed inset-0 z-50 flex justify-center bg-bg">
          <div className="flex h-full w-full max-w-[430px] flex-col px-5 pt-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-2xl">{t('diary.find')}</h2>
              <button type="button" onClick={() => setOpen(false)} className="text-sm font-semibold">{t('close')}</button>
            </div>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('diary.ph')} className="h-12 rounded-2xl bg-white px-4 shadow-card outline-none" />
            <div className="mt-3 grid gap-2 overflow-y-auto pb-8">
              {results.map((food) => (
                <button key={food.id} type="button" onClick={() => { setPicked(food); setQty(1); }} className="rounded-2xl bg-white px-4 py-3 text-left shadow-card">
                  <p className="font-semibold">{tr(food.name)}</p>
                  <p className="text-xs text-coach">{food.kcal} kcal · {tr(food.portion)}</p>
                </button>
              ))}
            </div>
          </div>
          {picked ? (
            <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-[430px] rounded-t-[28px] bg-white p-5 shadow-card">
              <p className="font-semibold">{tr(picked.name)}</p>
              <div className="mt-3 flex gap-2">
                {MEALS.map((id) => (
                  <button key={id} type="button" onClick={() => setMeal(id)} className={`rounded-full px-2 py-1 text-[11px] font-semibold ${meal === id ? 'bg-magenta text-white' : 'bg-bgTint'}`}>{t(`meal.${id}`)}</button>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-3">
                <button type="button" className="h-10 w-10 rounded-full bg-bgTint" onClick={() => setQty((value) => Math.max(0.5, value - 0.5))}>−</button>
                <span className="font-display text-xl">{t('diary.portion', { n: qty })}</span>
                <button type="button" className="h-10 w-10 rounded-full bg-bgTint" onClick={() => setQty((value) => value + 0.5)}>+</button>
              </div>
              <button type="button" onClick={confirm} className="mt-4 h-[50px] w-full rounded-full bg-magenta font-display text-white">{t('diary.add')}</button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
