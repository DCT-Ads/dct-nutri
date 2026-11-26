import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { caloriePlan } from '../lib/nutrition';
import { formatKcal } from '../lib/format';
import { Button, Field } from '../components/ui';
import LanguageSwitch from '../components/LanguageSwitch';

const LEVELS = [
  { id: 'principiante', emoji: '🌱' },
  { id: 'intermedio', emoji: '🌿' },
  { id: 'avanzado', emoji: '🌳' },
];

const ACTIVITIES = ['sedentaria', 'ligera', 'moderada', 'activa'];

export default function Onboarding() {
  const { completeOnboarding, t } = useApp();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '',
    level: 'principiante',
    age: '',
    heightCm: '',
    weightKg: '',
    goalKg: '',
    activity: 'moderada',
  });
  const [error, setError] = useState('');

  function set(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function nextBody() {
    const age = Number(form.age);
    const heightCm = Number(form.heightCm);
    const weightKg = Number(form.weightKg);
    const goalKg = Number(form.goalKg);
    if (age < 18 || age > 80) {
      setError(t('onb.ageError'));
      return;
    }
    if (heightCm < 140 || heightCm > 210 || weightKg < 40 || weightKg > 180 || goalKg < 40 || goalKg > 180) {
      setError(t('onb.numError'));
      return;
    }
    setError('');
    setStep(2);
  }

  function finish() {
    completeOnboarding({
      name: form.name.trim(),
      level: form.level,
      age: Number(form.age),
      heightCm: Number(form.heightCm),
      weightKg: Number(form.weightKg),
      goalKg: Number(form.goalKg),
      activity: form.activity,
    });
  }

  const preview = caloriePlan({
    age: Number(form.age) || 30,
    heightCm: Number(form.heightCm) || 165,
    weightKg: Number(form.weightKg) || 70,
    goalKg: Number(form.goalKg) || 63,
    activity: form.activity,
  });

  return (
    <div className="flex min-h-dvh flex-col px-5 pb-8 pt-8">
      <div className="mb-4 flex items-start justify-between gap-3">
        <img src="/logo.png" alt="DCT Nutri" className="h-24 w-24 rounded-[24px] object-cover shadow-card" />
        <LanguageSwitch />
      </div>
      <p className="text-[13px] text-coach">{t('onb.kicker')}</p>
      <h1 className="mt-1 font-display text-[34px] leading-none text-carbon">{t('onb.title')}</h1>
      <div className="mt-4 flex gap-1.5">
        {[0, 1, 2].map((item) => (
          <span key={item} className={`h-1.5 flex-1 rounded-full ${item <= step ? 'bg-magenta' : 'bg-rosaCard'}`} />
        ))}
      </div>

      {step === 0 ? (
        <div className="mt-6 flex flex-1 flex-col">
          <h2 className="mb-3 font-display text-2xl">{t('onb.level')}</h2>
          <div className="grid gap-3">
            {LEVELS.map((level) => (
              <button
                key={level.id}
                type="button"
                onClick={() => set('level', level.id)}
                className={`rounded-[24px] p-4 text-left shadow-card ${form.level === level.id ? 'bg-rosaPill ring-2 ring-magenta' : 'bg-white'}`}
              >
                <p className="font-display text-xl">{level.emoji} {t(`level.${level.id}`)}</p>
                <p className="mt-1 text-sm text-coach">{t(`onb.level.${level.id}`)}</p>
              </button>
            ))}
          </div>
          <Button className="mt-auto w-full" onClick={() => setStep(1)}>{t('next')}</Button>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="mt-6 flex flex-1 flex-col gap-3">
          <h2 className="font-display text-2xl">{t('onb.about')}</h2>
          <Field label={t('onb.name')} value={form.name} placeholder={t('onb.namePh')} onChange={(e) => set('name', e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <Field label={t('onb.age')} inputMode="numeric" value={form.age} placeholder="28" onChange={(e) => set('age', e.target.value)} />
            <Field label={t('onb.height')} inputMode="decimal" value={form.heightCm} placeholder="165" onChange={(e) => set('heightCm', e.target.value)} />
            <Field label={t('onb.weight')} inputMode="decimal" value={form.weightKg} placeholder="70" onChange={(e) => set('weightKg', e.target.value)} />
            <Field label={t('onb.goal')} inputMode="decimal" value={form.goalKg} placeholder="63" onChange={(e) => set('goalKg', e.target.value)} />
          </div>
          {error ? <p className="text-sm text-magentaText">{error}</p> : null}
          <div className="mt-auto grid grid-cols-2 gap-2">
            <Button variant="white" onClick={() => setStep(0)}>{t('onb.back')}</Button>
            <Button onClick={nextBody}>{t('next')}</Button>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="mt-6 flex flex-1 flex-col">
          <h2 className="mb-3 font-display text-2xl">{t('onb.move')}</h2>
          <div className="grid gap-2">
            {ACTIVITIES.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => set('activity', id)}
                className={`rounded-[22px] px-4 py-3 text-left ${form.activity === id ? 'bg-rosaPill ring-2 ring-magenta' : 'bg-white shadow-card'}`}
              >
                <p className="font-semibold">{t(`act.${id}`)}</p>
                <p className="text-sm text-coach">{t(`act.${id}.text`)}</p>
              </button>
            ))}
          </div>
          <div className="mt-4 rounded-[24px] bg-white p-4 shadow-card">
            <p className="text-[13px] text-coach">{t('onb.meta')}</p>
            <p className="font-display text-3xl text-magenta">{formatKcal(preview.target)} kcal</p>
            <p className="text-sm text-coach">{t('onb.metaNote')}</p>
          </div>
          <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
            <Button variant="white" onClick={() => setStep(1)}>{t('onb.back')}</Button>
            <Button onClick={finish}>{t('onb.enter')}</Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
