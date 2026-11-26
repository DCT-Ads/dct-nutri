import { Link } from 'react-router-dom';
import { BowlArt, HeroArt } from '../components/Art';
import { Arrow, Button, Card, MacroChips, SegmentBar } from '../components/ui';
import { useApp } from '../context/AppContext';
import { workoutsBy } from '../data/workouts';
import { currentWeek, formatKcal, formatLiters } from '../lib/format';
import LanguageSwitch from '../components/LanguageSwitch';
import { WEEK_GOAL } from '../lib/nutrition';

export function WeekStrip({ dates, goal = WEEK_GOAL, phrase }) {
  const { t } = useApp();
  const week = currentWeek();
  const done = week.filter((day) => dates.includes(day.iso)).length;
  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[17px] font-semibold">{t('home.week')}</h2>
        <span className="font-semibold text-magenta">{t('home.days', { n: done, goal })}</span>
      </div>
      <div className="my-4 flex justify-between">
        {week.map((day) => {
          const hit = dates.includes(day.iso);
          return (
            <div key={day.iso} className="flex flex-col items-center gap-1.5" aria-label={`${day.letter} ${day.date}${hit ? ', con actividad' : ''}`}>
              <span className="text-[11px] text-coach">{day.letter}</span>
              <span className={`grid h-9 w-9 place-items-center rounded-full text-sm font-semibold ${hit ? 'bg-magenta text-white' : day.isToday ? 'bg-white text-carbon ring-2 ring-magenta' : 'bg-bgTint text-carbon'}`}>
                {day.date}
              </span>
            </div>
          );
        })}
      </div>
      <p className="text-[13px] leading-5 text-coach">{phrase}</p>
    </Card>
  );
}

export default function Home() {
  const { profile, waterMl, waterGoal, setSheet, workoutsDone, consumed, plan, streak, today, t, tr } = useApp();
  const list = workoutsBy('gluteos', profile.level);
  const doneIds = workoutsDone.filter((item) => item.category === 'gluteos');
  const workout = list[doneIds.length % list.length];
  const reto = Math.floor(doneIds.length / list.length) + 1;
  const dia = (doneIds.length % list.length) + 1;
  const weekDates = workoutsDone.filter((item) => item.category === 'gluteos').map((item) => item.date);
  const weekCount = currentWeek().filter((day) => weekDates.includes(day.iso)).length;
  const phrase = weekCount >= 3
    ? t('home.phraseDone')
    : weekCount > 0
      ? t('home.phraseMid')
      : t('home.phrase0');
  const name = profile.name ? profile.name.split(' ')[0] : '';
  const remaining = plan.target - consumed.kcal;

  return (
    <div>
      <header className="mb-3 flex items-center gap-3">
        <Link to="/perfil" aria-label="Ver mi perfil" className="grid h-[46px] w-[46px] place-items-center rounded-full border-2 border-magenta bg-white p-0.5">
          <span className="h-full w-full rounded-full bg-gradient-to-br from-[#F4C4D7] to-rosaPill" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] text-coach">{t('home.space')}</p>
          <h1 className="truncate font-display text-[26px] leading-none">{name ? t('home.helloName', { name }) : t('home.hello')} 🍑</h1>
        </div>
        <LanguageSwitch />
        <button type="button" aria-label={t('sheet.bellTitle')} onClick={() => setSheet('bell')} className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full bg-white shadow-card">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 8a6 6 0 0 1 12 0v5l1.5 3h-15L6 13V8z" stroke="#3A2336" strokeWidth="2" /><path d="M10 19a2 2 0 0 0 4 0" stroke="#3A2336" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
      </header>

      <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-yellowSoft px-3 py-1.5 text-sm font-semibold text-gold">
        <span aria-hidden="true">🔥</span>
        {streak > 0 ? t(streak === 1 ? 'home.streak1' : 'home.streak', { n: streak }) : t('home.streak0')}
      </div>

      <div className="mb-4 grid grid-cols-4 gap-2">
        {[
          ['/dieta', '🥗', t('nav.diet')],
          ['/pernas', '🦵', t('nav.legs')],
          ['/abdomen', '🔥', t('nav.abs')],
          ['/dieta/escanear', '📸', t('home.scan')],
        ].map(([to, icon, label]) => (
          <Link key={to} to={to} className="rounded-2xl bg-white px-1 py-3 text-center shadow-card">
            <span className="block text-xl">{icon}</span>
            <span className="mt-1 block text-[11px] font-semibold">{label}</span>
          </Link>
        ))}
      </div>

      <Card className="mb-4 overflow-hidden p-0">
        <div className="relative min-h-[168px] bg-rosaPill p-5">
          <div className="absolute bottom-0 right-0 top-0 w-[38%]">
            <HeroArt />
          </div>
          <div className="relative w-[64%]">
            <span className="inline-flex rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-magentaText">{t('home.badge')}</span>
            <h2 className="mt-2 font-display text-[25px] leading-[30px]">{t('home.hero')}</h2>
            <p className="mt-1 text-[13px] text-coach">{t('home.reto', { reto, dia })}</p>
          </div>
        </div>
        <div className="grid gap-3 p-[18px]">
          <p className="text-sm text-coach">{t('home.meta', { min: workout.minutes, n: workout.blocks.length, place: tr(workout.place) })}</p>
          <Link to={`/entreno/${workout.id}?play=1`} className="flex h-[50px] items-center justify-center gap-2 rounded-full bg-magenta font-display text-white shadow-cta">
            {t('home.start')} <Arrow />
          </Link>
          <Link to={`/entreno/${workout.id}`} className="flex h-[50px] items-center justify-center rounded-full font-medium">{t('home.see')}</Link>
        </div>
      </Card>

      <WeekStrip dates={weekDates} phrase={phrase} />

      <Card className="mt-4">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-turqCard text-xl">💧</span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold">{t('home.water')}</p>
            <p className="text-sm text-coach">{formatLiters(waterMl)}L / {formatLiters(waterGoal)}L</p>
          </div>
          <button type="button" onClick={() => setSheet('water')} className="rounded-full bg-turquesa px-4 py-2 text-sm font-semibold text-carbon">{t('home.register')}</button>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-bgTint">
          <div className="h-full rounded-full bg-turquesa" style={{ width: `${Math.min(100, (waterMl / waterGoal) * 100)}%` }} />
        </div>
      </Card>

      <Card className="mt-4">
        <div className="mb-2 flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold">{t('home.calories')}</p>
            <p className="font-display text-[28px] leading-none text-carbon">{formatKcal(consumed.kcal)} <span className="text-base text-coach">/ {formatKcal(plan.target)} kcal</span></p>
          </div>
          <Link to="/dieta/escanear" className="rounded-full bg-magenta px-4 py-2 text-sm font-semibold text-white">{t('home.scan')}</Link>
        </div>
        <SegmentBar value={consumed.kcal} max={plan.target} />
        <p className="mt-2 text-sm text-coach">{remaining >= 0 ? t('home.remain', { n: formatKcal(remaining) }) : t('home.over', { n: formatKcal(Math.abs(remaining)) })}</p>
        <div className="mt-3">
          <MacroChips {...consumed} />
        </div>
        <Link to="/dieta" className="mt-3 inline-block text-sm font-semibold text-magenta">{t('home.summaryLink')}</Link>
      </Card>

      <h2 className="mb-3 mt-6 font-display text-[26px]">{t('home.explore')}</h2>
      <div className="grid gap-3">
        <Link to="/dieta" className="flex items-center gap-3 rounded-[28px] bg-turqCard p-5 shadow-card">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold tracking-wide text-turquesaDark">{t('home.nutriK')}</p>
            <h3 className="font-display text-[26px] leading-none">{t('home.nutri')}</h3>
            <p className="mt-1 text-sm text-coach">{t('home.nutriText')}</p>
            <p className="mt-3 text-sm font-semibold">{t('home.nutriCta')}</p>
          </div>
          <BowlArt />
        </Link>
        <Link to="/abdomen" className="rounded-[28px] bg-rosaPill p-5 shadow-card">
          <p className="text-[11px] font-semibold tracking-wide text-magentaText">{t('home.absK')}</p>
          <h3 className="font-display text-[26px]">{t('nav.abs')}</h3>
          <p className="text-sm text-coach">{t('home.absText')}</p>
          <p className="mt-3 text-sm font-semibold">{t('home.trainCta')}</p>
        </Link>
        <Link to="/pernas" className="rounded-[28px] bg-white p-5 shadow-card">
          <p className="text-[11px] font-semibold tracking-wide text-coach">{t('home.legsK')}</p>
          <h3 className="font-display text-[26px]">{t('nav.legs')}</h3>
          <p className="text-sm text-coach">{t('home.legsText')}</p>
          <p className="mt-3 text-sm font-semibold">{t('home.trainCta')}</p>
        </Link>
        <Link to="/dieta/seca-21-dias" className="rounded-[28px] bg-yellowSoft p-5 shadow-card">
          <p className="text-[11px] font-semibold tracking-wide text-gold">{t('home.secaK')}</p>
          <h3 className="font-display text-[26px]">{t('home.seca')} 🔥</h3>
          <p className="text-sm text-coach">{t('home.secaText')}</p>
          <p className="mt-3 text-sm font-semibold">{t('home.secaCta')}</p>
        </Link>
      </div>
      <p className="mt-4 text-center text-xs text-gris">{t('home.session', { date: today })}</p>
      <Button variant="ghost" className="mt-1 w-full" onClick={() => setSheet('bell')}>{t('home.personalize')}</Button>
    </div>
  );
}
