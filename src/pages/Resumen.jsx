import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Reminders } from '../components/Reminders';
import { DietaTabs, MacroChips, WeightChart } from '../components/ui';
import { useApp } from '../context/AppContext';
import { describeMeal } from '../data/foods';
import { findProduct } from '../data/products';
import { formatKcal, formatLiters, monthMatrix } from '../lib/format';

const GLASS_ML = 250;

function GoalBar({ label, value, goal, color }) {
  const pct = Math.min(100, goal ? (value / goal) * 100 : 0);
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[11px] font-semibold">
        <span>{label}</span>
        <span className="text-coach">{Math.round(value)}/{goal}g</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-bgTint">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function BarcodeCamera({ onCode, onFail }) {
  const videoRef = useRef(null);
  const codeRef = useRef(onCode);
  const failRef = useRef(onFail);
  codeRef.current = onCode;
  failRef.current = onFail;
  useEffect(() => {
    let stream;
    let stopped = false;
    let frame;
    async function run() {
      if (!('BarcodeDetector' in window)) {
        failRef.current();
        return;
      }
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        await video.play();
        const detector = new window.BarcodeDetector({ formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128'] });
        const tick = async () => {
          if (stopped) return;
          try {
            const codes = await detector.detect(video);
            if (codes[0]?.rawValue) {
              codeRef.current(codes[0].rawValue);
              return;
            }
          } catch {
            failRef.current();
            return;
          }
          frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      } catch {
        failRef.current();
      }
    }
    run();
    return () => {
      stopped = true;
      if (frame) cancelAnimationFrame(frame);
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);
  return <video ref={videoRef} muted playsInline className="mt-3 h-28 w-full rounded-2xl bg-carbon object-cover" />;
}

export default function Resumen() {
  const {
    consumed, plan, targets, waterMl, waterGoal, todayDiary, diary, streak, addWater, addFood,
    profile, weightLog, saveProfile, circleMembers, circleCode, addCircleMember, removeCircleMember,
    today, t, tr,
  } = useApp();
  const [words, setWords] = useState('');
  const [parsed, setParsed] = useState(null);
  const [wordNote, setWordNote] = useState('');
  const [code, setCode] = useState('');
  const [product, setProduct] = useState(undefined);
  const [camera, setCamera] = useState(false);
  const [cameraNote, setCameraNote] = useState('');
  const [friendName, setFriendName] = useState('');
  const [weightDraft, setWeightDraft] = useState('');
  const [copied, setCopied] = useState(false);

  const latestFood = [...todayDiary].reverse().find((item) => item.preview || item.source === 'vision' || item.source === 'mock' || item.source === 'api');
  const month = monthMatrix(new Date());
  const loggedDays = new Set(diary.map((item) => item.date));
  const sortedWeights = [...weightLog].sort((a, b) => a.date.localeCompare(b.date));
  const latestWeight = sortedWeights.at(-1);
  const previousWeight = sortedWeights.length > 1 ? sortedWeights.at(-2) : null;
  const delta = latestWeight && previousWeight ? +(latestWeight.kg - previousWeight.kg).toFixed(1) : 0;
  const deltaLabel = `${delta > 0 ? '+' : ''}${delta.toFixed(1).replace('.', ',')}`;
  const glasses = Math.floor(waterMl / GLASS_ML);
  const youPoints = Math.min(100, todayDiary.length * 18 + glasses * 4 + (weightLog.some((item) => item.date === today) ? 10 : 0));
  const ranking = [
    ...circleMembers.map((item) => ({ ...item, you: false })),
    { id: 'you', name: t('hub.friendsYou'), points: youPoints, you: true },
  ].sort((a, b) => b.points - a.points || (a.you ? -1 : 1));

  function analyzeWords() {
    const items = describeMeal(words);
    if (!items.length) {
      setParsed(null);
      setWordNote(t('hub.wordsNone'));
      return;
    }
    setWordNote('');
    setParsed(items);
  }

  function addWords() {
    parsed.forEach((item) => addFood({ ...item, source: 'words' }));
    setParsed(null);
    setWords('');
  }

  function lookup(raw) {
    const found = findProduct(raw);
    setProduct(found);
    setCamera(false);
  }

  async function shareCircle() {
    const text = t('hub.friendsShare', { code: circleCode, name: t('hub.circleName') });
    if (navigator.share) {
      try {
        await navigator.share({ title: t('hub.circleName'), text });
        return;
      } catch {
        /* the person closed the share sheet */
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  function downloadSummary() {
    const lines = [
      `${t('diet.today')}`,
      `${formatKcal(consumed.kcal)} kcal / ${formatKcal(plan.target)} kcal`,
      `${t('macros.carbs')}: ${Math.round(consumed.carbs)} g`,
      `${t('macros.protein')}: ${Math.round(consumed.protein)} g`,
      `${t('macros.fat')}: ${Math.round(consumed.fat)} g`,
      `${t('macros.fiber')}: ${Math.round(consumed.fiber)} g`,
      `${t('hub.waterT')}: ${formatLiters(waterMl)} L`,
      `${t('peso.now')}: ${latestWeight ? `${latestWeight.kg} kg` : '—'}`,
      `${t('hub.goalLine', { n: profile.goalKg })}`,
      ...todayDiary.map((item) => `- ${item.time} ${item.name} ${item.kcal} kcal`),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'gluteos-resumo.txt';
    link.click();
    URL.revokeObjectURL(url);
  }

  function saveWeight(event) {
    event.preventDefault();
    const kg = Number(String(weightDraft).replace(',', '.'));
    if (!kg || kg < 35 || kg > 250) return;
    saveProfile({ weightKg: kg });
    setWeightDraft('');
  }

  const onCode = (value) => lookup(value);
  const onFail = () => {
    setCamera(false);
    setCameraNote(t('hub.barCamFail'));
  };

  return (
    <div>
      <DietaTabs />
      <p className="text-[13px] text-coach">{t('diet.kicker')}</p>
      <h1 className="font-display text-[32px] leading-none">{t('nav.diet')}</h1>

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <article className="rounded-[24px] bg-white p-3.5 shadow-card">
          <h2 className="font-display text-[18px] leading-tight">{t('hub.photoT')}</h2>
          <p className="mt-1 text-[11px] leading-4 text-coach">{t('hub.photoD')}</p>
          <Link to="/dieta/escanear" className="mt-3 inline-flex rounded-full bg-magenta px-3 py-1.5 text-[11px] font-semibold text-white">{t('hub.photoCta')}</Link>
          {latestFood ? (
            <div className="mt-3 rounded-2xl bg-bgTint p-2">
              <div className="flex items-center gap-2">
                <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-white text-lg">
                  {latestFood.preview ? <img src={latestFood.preview} alt="" className="h-full w-full object-cover" /> : '🍽️'}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold">{tr(latestFood.name)}</p>
                  <p className="text-[11px] text-coach">{formatKcal(latestFood.kcal)} kcal</p>
                </div>
              </div>
              <div className="mt-2"><MacroChips {...latestFood} /></div>
            </div>
          ) : null}
        </article>

        <article className="rounded-[24px] bg-rosaPill p-3.5 shadow-card">
          <h2 className="font-display text-[18px] leading-tight">{t('hub.wordsT')}</h2>
          <p className="mt-1 text-[11px] leading-4 text-coach">{t('hub.wordsD')}</p>
          <textarea
            value={words}
            onChange={(event) => setWords(event.target.value)}
            placeholder={t('hub.wordsPh')}
            rows={3}
            className="mt-3 w-full resize-none rounded-2xl bg-white px-3 py-2 text-xs outline-none ring-magenta/30 focus:ring-2"
          />
          <button type="button" onClick={analyzeWords} className="mt-2 rounded-full bg-carbon px-3 py-1.5 text-[11px] font-semibold text-white">{t('hub.wordsBtn')}</button>
          {wordNote ? <p className="mt-2 text-[11px] text-magentaText">{wordNote}</p> : null}
          {parsed ? (
            <div className="mt-3 rounded-2xl bg-white p-2">
              {parsed.map((item) => (
                <p key={item.id} className="text-xs font-semibold">{item.qty}× {tr(item.name)} · {formatKcal(item.kcal * item.qty)} kcal</p>
              ))}
              <div className="mt-2"><MacroChips carbs={sum(parsed, 'carbs')} protein={sum(parsed, 'protein')} fat={sum(parsed, 'fat')} fiber={sum(parsed, 'fiber')} /></div>
              <button type="button" onClick={addWords} className="mt-2 text-[11px] font-semibold text-magenta">{t('hub.wordsAdd')}</button>
            </div>
          ) : null}
        </article>

        <article className="row-span-2 rounded-[24px] bg-white p-3.5 shadow-card">
          <h2 className="font-display text-[18px] leading-tight">{t('hub.goalsT')}</h2>
          <p className="mt-1 text-[11px] leading-4 text-coach">{t('hub.goalsD')}</p>
          <div className="mt-3 space-y-2.5">
            <GoalBar label={t('macros.carbs')} value={consumed.carbs} goal={targets.carbs} color="#E24B6A" />
            <GoalBar label={t('macros.protein')} value={consumed.protein} goal={targets.protein} color="#7A6AE0" />
            <GoalBar label={t('macros.fat')} value={consumed.fat} goal={targets.fat} color="#E0A106" />
            <GoalBar label={t('macros.fiber')} value={consumed.fiber} goal={targets.fiber} color="#2FCFBE" />
          </div>
          <Link to="/dieta/macros" className="mt-3 inline-block text-[11px] font-semibold text-magenta">{t('hub.kcalLink')}</Link>
        </article>

        <article className="rounded-[24px] bg-[#F3EEF8] p-3.5 shadow-card">
          <h2 className="font-display text-[18px] leading-tight">{t('hub.barT')}</h2>
          <p className="mt-1 text-[11px] leading-4 text-coach">{t('hub.barD')}</p>
          <form className="mt-3 space-y-1.5" onSubmit={(event) => { event.preventDefault(); lookup(code); }}>
            <input
              value={code}
              onChange={(event) => setCode(event.target.value)}
              inputMode="numeric"
              placeholder={t('hub.barPh')}
              className="h-9 w-full rounded-xl bg-white px-2 text-xs outline-none"
            />
            <button type="submit" className="rounded-xl bg-carbon px-3 py-1.5 text-[11px] font-semibold text-white">{t('hub.barGo')}</button>
          </form>
          <button type="button" onClick={() => { setCamera((open) => !open); setCameraNote(''); }} className="mt-2 text-[11px] font-semibold text-magenta">
            {camera ? t('hub.barClose') : t('hub.barCam')}
          </button>
          {camera ? <BarcodeCamera onCode={onCode} onFail={onFail} /> : null}
          {cameraNote ? <p className="mt-2 text-[11px] text-magentaText">{cameraNote}</p> : null}
          {product === null ? <p className="mt-2 text-[11px] text-coach">{t('hub.barMiss')}</p> : null}
          {product ? (
            <div className="mt-3 rounded-2xl bg-white p-2">
              <p className="text-xs font-semibold">{tr(product.name)}</p>
              <p className="text-[11px] text-coach">{tr(product.ingredients)}</p>
              <p className="mt-1 text-[11px] font-semibold">{formatKcal(product.kcal)} kcal · {t('hub.barSugar', { n: product.sugar })}</p>
              <p className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${product.verdict === 'ok' ? 'bg-turqCard text-turquesaDark' : product.verdict === 'mid' ? 'bg-yellowSoft text-gold' : 'bg-rosaPill text-magentaText'}`}>{t(`hub.verdict.${product.verdict}`)}</p>
              <button type="button" onClick={() => addFood({ ...product, source: 'barcode' })} className="mt-2 block text-[11px] font-semibold text-magenta">{t('diary.add')}</button>
            </div>
          ) : null}
        </article>

        <button type="button" onClick={() => addWater(GLASS_ML)} className="rounded-[24px] bg-turqCard p-3.5 text-left shadow-card">
          <h2 className="font-display text-[18px] leading-tight">{t('hub.waterT')}</h2>
          <p className="mt-1 text-[11px] leading-4 text-coach">{t('hub.waterD')}</p>
          <p className="mt-4 font-display text-4xl leading-none">{formatLiters(waterMl)} L</p>
          <p className="mt-1 text-[11px] text-turquesaDark">{formatLiters(waterGoal)} L</p>
        </button>

        <article className="rounded-[24px] bg-white p-3.5 shadow-card">
          <p className="font-display text-4xl leading-none text-magenta">{streak}</p>
          <h2 className="mt-1 font-display text-[18px] leading-tight">{t('hub.streakT')}</h2>
          <p className="mt-1 text-[11px] leading-4 text-coach">{t('hub.streakD')}</p>
        </article>

        <article className="rounded-[24px] bg-white p-3.5 shadow-card">
          <h2 className="font-display text-[18px] leading-tight">{t('hub.histT')}</h2>
          <p className="mt-1 text-[11px] leading-4 text-coach">{t('hub.histD')}</p>
          <div className="mt-3 grid grid-cols-7 gap-1">
            {month.cells.filter(Boolean).slice(-14).map((cell) => (
              <span key={cell.iso} className={`h-2.5 rounded-full ${loggedDays.has(cell.iso) ? 'bg-magenta' : 'bg-bgTint'}`} />
            ))}
          </div>
          <Link to="/dieta/calendario" className="mt-3 inline-block text-[11px] font-semibold text-magenta">{t('hub.histCta')}</Link>
        </article>

        <article className="col-span-2 rounded-[24px] bg-[#F7F1E8] p-3.5 shadow-card">
          <h2 className="font-display text-[18px] leading-tight">{t('hub.healthT')}</h2>
          <p className="mt-1 text-[12px] leading-5 text-coach">{t('hub.healthD')}</p>
          <button type="button" onClick={downloadSummary} className="mt-3 rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold shadow-card">{t('hub.healthCta')}</button>
        </article>

        <article className="col-span-2 rounded-[24px] bg-white p-3.5 shadow-card">
          <div className="grid gap-3 sm:grid-cols-[1fr_1.1fr]">
            <div>
              <h2 className="font-display text-[18px] leading-tight">{t('hub.weightT')}</h2>
              <p className="mt-1 text-[11px] leading-4 text-coach">{t('hub.weightD')}</p>
              <p className="mt-3 font-display text-4xl leading-none">{latestWeight ? `${String(latestWeight.kg).replace('.', ',')} kg` : '—'}</p>
              <p className={`text-xs font-semibold ${delta < 0 ? 'text-turquesaDark' : 'text-coach'}`}>{t('hub.week', { n: deltaLabel })}</p>
              <p className="text-[11px] text-gris">{t('hub.goalLine', { n: String(profile.goalKg).replace('.', ',') })}</p>
              <form onSubmit={saveWeight} className="mt-3 flex gap-1.5">
                <input
                  value={weightDraft}
                  onChange={(event) => setWeightDraft(event.target.value)}
                  inputMode="decimal"
                  placeholder={t('peso.aria')}
                  className="h-9 w-24 rounded-xl bg-bgTint px-2 text-xs outline-none"
                />
                <button type="submit" className="rounded-xl bg-magenta px-3 text-[11px] font-semibold text-white">{t('save')}</button>
              </form>
              <Link to="/dieta/calendario" className="mt-2 inline-block text-[11px] font-semibold text-magenta">{t('hub.weekLink')}</Link>
            </div>
            <WeightChart points={sortedWeights} goal={Number(profile.goalKg)} />
          </div>
        </article>

        <article className="rounded-[24px] bg-white p-3.5 shadow-card">
          <h2 className="font-display text-[18px] leading-tight">{t('hub.friendsT')}</h2>
          <p className="mt-1 text-[11px] leading-4 text-coach">{t('hub.friendsD')}</p>
          <p className="mt-2 text-[11px] font-semibold text-magenta">{t('hub.circleName')}</p>
          <p className="mt-1 text-[11px] text-coach">{t('hub.streakLine', { n: streak })}</p>
          <div className="mt-2 flex items-center justify-between gap-2">
            <p className="text-xs font-semibold tracking-wide">{t('hub.friendsCode', { code: circleCode })}</p>
            <button type="button" onClick={shareCircle} className="rounded-full bg-magenta px-3 py-1 text-[11px] font-semibold text-white">{t('hub.friendsInvite')}</button>
          </div>
          {copied ? <p className="mt-1 text-[11px] text-magentaText">{t('hub.friendsCopied')}</p> : null}
          <ul className="mt-2 space-y-1.5">
            {ranking.map((item) => (
              <li key={item.id} className={`flex items-center justify-between rounded-xl px-2 py-1.5 text-xs ${item.you ? 'bg-rosaPill' : 'bg-bgTint'}`}>
                <span className="font-semibold">{item.name}</span>
                <span className="flex items-center gap-2">
                  <span>{t('hub.pts', { n: item.points })}</span>
                  {!item.you ? (
                    <button type="button" onClick={() => removeCircleMember(item.id)} className="text-[10px] font-semibold text-gris">{t('hub.friendsRemove')}</button>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
          <form
            className="mt-2 flex gap-1.5"
            onSubmit={(event) => {
              event.preventDefault();
              addCircleMember(friendName);
              setFriendName('');
            }}
          >
            <input value={friendName} onChange={(event) => setFriendName(event.target.value)} placeholder={t('hub.friendsPh')} className="h-8 min-w-0 flex-1 rounded-xl bg-bgTint px-2 text-xs outline-none" />
            <button type="submit" className="rounded-xl bg-carbon px-2 text-[11px] font-semibold text-white">{t('hub.friendsAdd')}</button>
          </form>
          <p className="mt-2 text-[10px] text-gris">{t('hub.friendsMeta', { n: circleMembers.length + 1 })}</p>
        </article>

        <Reminders />
      </div>

      <p className="mb-2 mt-5 text-[11px] font-semibold uppercase tracking-wide text-gris">{t('hub.more')}</p>
      <div className="grid grid-cols-2 gap-2">
        <Link to="/dieta/plan" className="rounded-2xl bg-magenta px-3 py-3 text-sm font-semibold text-white">{t('mod.plan.t')}</Link>
        <Link to="/dieta/recetas" className="rounded-2xl bg-white px-3 py-3 text-sm font-semibold shadow-card">{t('mod.rec.t')}</Link>
        <Link to="/dieta/compras" className="rounded-2xl bg-turqCard px-3 py-3 text-sm font-semibold">{t('mod.shop.t')}</Link>
        <Link to="/dieta/seca-21-dias" className="rounded-2xl bg-yellowSoft px-3 py-3 text-sm font-semibold text-gold">{t('home.seca')}</Link>
      </div>
    </div>
  );
}

function sum(items, key) {
  return items.reduce((total, item) => total + (item[key] || 0) * (item.qty || 1), 0);
}
