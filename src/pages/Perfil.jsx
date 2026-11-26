import { useState } from 'react';
import { Reminders } from '../components/Reminders';
import { Button, Field, PageTitle } from '../components/ui';
import LanguageSwitch from '../components/LanguageSwitch';
import { useApp } from '../context/AppContext';
import { formatKcal } from '../lib/format';

export default function Perfil() {
  const { profile, saveProfile, plan, installEvent, installApp, resetSession, t } = useApp();
  const [form, setForm] = useState(profile);
  const [note, setNote] = useState('');

  function set(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function save(event) {
    event.preventDefault();
    const age = Number(form.age);
    const heightCm = Number(form.heightCm);
    const weightKg = Number(form.weightKg);
    const goalKg = Number(form.goalKg);
    if (age < 18 || heightCm < 140 || weightKg < 40 || goalKg < 40) {
      setNote(t('perfil.bad'));
      return;
    }
    saveProfile({ ...form, age, heightCm, weightKg, goalKg });
    setNote(t('perfil.ok'));
  }

  return (
    <div>
      <PageTitle kicker={t('perfil.k')} title={t('nav.profile')} />
      <div className="mb-4"><LanguageSwitch /></div>
      <div className="mb-4 flex items-center gap-3">
        <span className="h-14 w-14 rounded-full bg-gradient-to-br from-[#F4C4D7] to-magenta" />
        <div>
          <p className="font-display text-2xl">{form.name || t('perfil.fallback')}</p>
          <p className="text-sm text-coach">{t('perfil.meta', { n: formatKcal(plan.target) })}</p>
        </div>
      </div>
      <form className="grid gap-3" onSubmit={save}>
        <Field label={t('onb.name')} value={form.name} onChange={(event) => set('name', event.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <Field label={t('onb.age')} inputMode="numeric" value={form.age} onChange={(event) => set('age', event.target.value)} />
          <Field label={t('onb.height')} inputMode="decimal" value={form.heightCm} onChange={(event) => set('heightCm', event.target.value)} />
          <Field label={t('perfil.weight')} inputMode="decimal" value={form.weightKg} onChange={(event) => set('weightKg', event.target.value)} />
          <Field label={t('perfil.goal')} inputMode="decimal" value={form.goalKg} onChange={(event) => set('goalKg', event.target.value)} />
        </div>
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-medium text-coach">{t('perfil.level')}</span>
          <select value={form.level} onChange={(event) => set('level', event.target.value)} className="h-12 w-full rounded-2xl bg-white px-4 shadow-card">
            <option value="principiante">{t('level.principiante')}</option>
            <option value="intermedio">{t('level.intermedio')}</option>
            <option value="avanzado">{t('level.avanzado')}</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-medium text-coach">{t('perfil.activity')}</span>
          <select value={form.activity} onChange={(event) => set('activity', event.target.value)} className="h-12 w-full rounded-2xl bg-white px-4 shadow-card">
            <option value="sedentaria">{t('act.sedentaria')}</option>
            <option value="ligera">{t('act.ligera')}</option>
            <option value="moderada">{t('act.moderada')}</option>
            <option value="activa">{t('act.activa')}</option>
          </select>
        </label>
        {note ? <p className="text-sm text-magentaText">{note}</p> : null}
        <Button type="submit" className="w-full">{t('save')}</Button>
      </form>
      <section className="mt-4 rounded-[24px] bg-white p-4 shadow-card">
        <h2 className="font-semibold">{t('perfil.install')}</h2>
        <p className="mt-1 text-sm text-coach">{t('perfil.installText')}</p>
        {installEvent ? <Button className="mt-3 w-full" onClick={installApp}>{t('perfil.install')}</Button> : <p className="mt-2 text-sm text-gris">{t('perfil.installHint')}</p>}
      </section>
      <div className="mt-4"><Reminders /></div>
      <p className="mt-4 text-xs leading-5 text-gris">{t('perfil.session')}</p>
      <button type="button" onClick={resetSession} className="mt-3 text-sm font-semibold text-magenta">{t('perfil.reset')}</button>
    </div>
  );
}
