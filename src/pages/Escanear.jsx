import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { findFood } from '../data/foods';
import { Button, MacroChips } from '../components/ui';
import { useApp } from '../context/AppContext';
import { mealByHour } from '../lib/format';
import { makeThumb, recognizeFood, visionConfigured } from '../lib/vision';

const MEALS = ['desayuno', 'almuerzo', 'merienda', 'cena'];

export default function Escanear() {
  const { addFood, t, tr } = useApp();
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle');
  const [preview, setPreview] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);
  const [meal, setMeal] = useState(mealByHour());
  const [file, setFile] = useState(null);

  async function run(nextFile) {
    setStatus('loading');
    setError('');
    setFile(nextFile);
    try {
      const thumb = await makeThumb(nextFile);
      setPreview(thumb);
      const found = await recognizeFood(nextFile);
      setResult(found);
      setStatus('result');
    } catch (err) {
      setError(err.message || 'No pudimos leer la foto.');
      setStatus('error');
    }
  }

  async function useExample() {
    const sample = findFood('pollo');
    setPreview('');
    setResult({ ...sample, confidence: 0.7, source: 'mock' });
    setStatus('result');
  }

  function save() {
    addFood({ ...result, qty, meal, preview, source: result.source || 'scan' });
    navigate('/dieta/diario');
  }

  return (
    <div>
      <button type="button" onClick={() => navigate('/dieta')} className="text-sm font-semibold text-magenta">← Dieta</button>
      <h1 className="mt-2 font-display text-3xl">{t('scan.title')}</h1>
      <p className="mt-1 text-sm text-coach">{t('scan.lead')}</p>
      {!visionConfigured() ? <p className="mt-2 text-xs text-gris">{t('scan.demo')}</p> : null}

      {status !== 'result' ? (
        <div className="mt-4">
          <label className="flex h-48 cursor-pointer flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-rosaCard bg-white text-center">
            <span className="font-display text-2xl text-magenta">📸</span>
            <span className="mt-2 text-sm font-semibold">{t('scan.pick')}</span>
            <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(event) => { const next = event.target.files?.[0]; if (next) run(next); }} />
          </label>
          {preview ? <img src={preview} alt="Vista previa" className="mt-3 h-24 w-24 rounded-2xl object-cover" /> : null}
          {status === 'loading' ? <p className="mt-3 text-sm text-magenta">{t('scan.loading')}</p> : null}
          {status === 'error' ? (
            <div className="mt-3">
              <p className="text-sm text-magentaText">{error}</p>
              <Button className="mt-2 w-full" variant="soft" onClick={() => file && run(file)}>Reintentar</Button>
            </div>
          ) : null}
          <Button className="mt-4 w-full" variant="white" onClick={useExample}>{t('scan.example')}</Button>
          <Button className="mt-2 w-full" variant="ghost" onClick={() => navigate('/dieta/diario?buscar=1')}>{t('scan.manual')}</Button>
        </div>
      ) : (
        <div className="mt-4 rounded-[28px] bg-white p-4 shadow-card">
          {preview ? <img src={preview} alt="" className="mb-3 h-36 w-full rounded-2xl object-cover" /> : null}
          <p className="text-xs font-semibold uppercase tracking-wide text-magentaText">{result.source === 'api' ? t('scan.api') : t('scan.mock')}</p>
          <h2 className="font-display text-2xl">{tr(result.name)}</h2>
          <p className="text-sm text-coach">{Math.round(result.kcal * qty)} kcal · {result.portion}{result.confidence ? ` · ${Math.round(result.confidence * 100)}%` : ''}</p>
          <div className="mt-3"><MacroChips carbs={result.carbs * qty} protein={result.protein * qty} fat={result.fat * qty} fiber={result.fiber * qty} /></div>
          <div className="mt-4 flex flex-wrap gap-2">
            {MEALS.map((id) => (
              <button key={id} type="button" onClick={() => setMeal(id)} className={`rounded-full px-3 py-1 text-xs font-semibold ${meal === id ? 'bg-magenta text-white' : 'bg-bgTint'}`}>{t(`meal.${id}`)}</button>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button type="button" className="h-10 w-10 rounded-full bg-bgTint" onClick={() => setQty((value) => Math.max(0.5, +(value - 0.5).toFixed(1)))}>−</button>
            <span>{t('scan.portion', { n: qty })}</span>
            <button type="button" className="h-10 w-10 rounded-full bg-bgTint" onClick={() => setQty((value) => +(value + 0.5).toFixed(1))}>+</button>
          </div>
          <Button className="mt-4 w-full" onClick={save}>{t('diary.add')}</Button>
          <Button className="mt-2 w-full" variant="ghost" onClick={() => navigate('/dieta/diario?buscar=1')}>{t('scan.fix')}</Button>
        </div>
      )}
    </div>
  );
}
