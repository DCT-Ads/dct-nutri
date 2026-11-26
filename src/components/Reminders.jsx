import { useState } from 'react';
import { useApp } from '../context/AppContext';

const ITEMS = [
  ['breakfast', 'hub.remindBreakfast', 'hub.remindBreakfastD'],
  ['lunch', 'hub.remindLunch', 'hub.remindLunchD'],
  ['dinner', 'hub.remindDinner', 'hub.remindDinnerD'],
  ['water', 'hub.remindWater', 'hub.remindWaterD'],
  ['workout', 'hub.remindWorkout', 'hub.remindWorkoutD'],
];

export function Reminders() {
  const { reminders, setReminder, t } = useApp();
  const [note, setNote] = useState('');

  async function toggle(id) {
    if (reminders[id]?.on) {
      setReminder(id, false);
      setNote('');
      return;
    }
    if (typeof Notification === 'undefined') {
      setNote(t('hub.remindDenied'));
      return;
    }
    const permission = Notification.permission === 'granted' ? 'granted' : await Notification.requestPermission();
    if (permission !== 'granted') {
      setNote(t('hub.remindDenied'));
      return;
    }
    setReminder(id, true);
    setNote('');
    try {
      new Notification(t('hub.remindSet'), { body: t(ITEMS.find((item) => item[0] === id)[1]) });
    } catch {
      setNote('');
    }
  }

  return (
    <article className="rounded-[24px] bg-[#F3EEF8] p-3.5 shadow-card">
      <h2 className="font-display text-[18px] leading-tight">{t('hub.remindT')}</h2>
      <p className="mt-1 text-[11px] leading-4 text-coach">{t('hub.remindD')}</p>
      {ITEMS.map(([id, title, body]) => (
        <div key={id} className="mt-2 rounded-2xl bg-white p-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <input
                type="time"
                value={reminders[id]?.time || '08:00'}
                onChange={(event) => setReminder(id, { time: event.target.value })}
                aria-label={t(title)}
                className="bg-transparent text-[10px] font-semibold uppercase tracking-wide text-gris outline-none"
              />
              <p className="text-xs font-semibold">{t(title)}</p>
              <p className="text-[11px] text-coach">{t(body)}</p>
              {id === 'water' ? <p className="text-[11px] text-gris">{t('hub.remindEvery')}</p> : null}
            </div>
            <button type="button" onClick={() => toggle(id)} className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${reminders[id]?.on ? 'bg-magenta text-white' : 'bg-bgTint text-carbon'}`}>
              {reminders[id]?.on ? t('hub.remindOn') : t('hub.remindOff')}
            </button>
          </div>
        </div>
      ))}
      {note ? <p className="mt-2 text-[11px] text-magentaText">{note}</p> : null}
    </article>
  );
}
