import { useState } from 'react';
import { Link } from 'react-router-dom';
import { exercises, workoutsBy } from '../data/workouts';
import { useApp } from '../context/AppContext';
import { Card, PageTitle, Segmented } from '../components/ui';
import { WeekStrip } from './Home';

export default function Track({ category }) {
  const { profile, workoutsDone, t, tr } = useApp();
  const [level, setLevel] = useState(profile.level);
  const [focus, setFocus] = useState('todos');
  const copy = {
    kicker: t(`track.${category}.k`),
    title: t(`track.${category}.t`),
    phrase: t(`track.${category}.p`),
  };
  const items = workoutsBy(category, level, category === 'abdomen' ? focus : null);
  const dates = workoutsDone.filter((item) => item.category === category).map((item) => item.date);

  return (
    <div>
      <PageTitle kicker={copy.kicker} title={copy.title} />
      <Segmented
        value={level}
        onChange={setLevel}
        options={[
          { id: 'principiante', label: t('level.principiante') },
          { id: 'intermedio', label: t('level.intermedio') },
          { id: 'avanzado', label: t('level.avanzado') },
        ]}
      />
      {category === 'abdomen' ? (
        <div className="no-scrollbar mb-4 flex gap-2 overflow-x-auto">
          {['todos', 'inferior', 'superior', 'oblicuos', 'full'].map((id) => (
            <button key={id} type="button" onClick={() => setFocus(id)} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${focus === id ? 'bg-carbon text-white' : 'bg-white text-coach shadow-card'}`}>
              {id === 'todos' ? t('focus.todos') : t(`focus.${id}`)}
            </button>
          ))}
        </div>
      ) : null}
      <div className="mb-4">
        <WeekStrip dates={dates} phrase={copy.phrase} />
      </div>
      <div className="grid gap-3">
        {items.map((item) => (
          <Link key={item.id} to={`/entreno/${item.id}`}>
            <Card>
              <div className="mb-1 flex items-center justify-between gap-2">
                <h2 className="font-display text-xl">{tr(item.name)}</h2>
                {item.focus ? <span className="rounded-full bg-rosaPill px-2 py-1 text-[11px] font-semibold text-magentaText">{t(`focus.${item.focus}`)}</span> : null}
              </div>
              <p className="text-sm text-coach">{tr(item.blurb)}</p>
              <p className="mt-2 text-sm">{t('home.meta', { min: item.minutes, n: item.blocks.length, place: tr(item.place) })}</p>
              <p className="mt-2 text-sm font-semibold text-magentaText">
                {tr(exercises[item.blocks[0].ex].name)} — {item.blocks[0].sets}×{item.blocks[0].reps}
              </p>
            </Card>
          </Link>
        ))}
        {items.length === 0 ? <p className="text-sm text-coach">{t('track.empty')}</p> : null}
      </div>
    </div>
  );
}
