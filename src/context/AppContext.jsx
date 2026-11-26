import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { defaultRecipeWeek } from '../data/recipes';
import { clock, isoDate, mealByHour, streakFromDates } from '../lib/format';
import { WATER_GOAL_ML, caloriePlan, macroTargets, sumDiary } from '../lib/nutrition';
import { detectLanguage, translate, translateContent } from '../i18n';

const AppContext = createContext(null);

const DEFAULT_REMINDERS = {
  breakfast: { on: false, time: '08:00' },
  lunch: { on: false, time: '12:00' },
  dinner: { on: false, time: '19:30' },
  water: { on: false, time: '08:00', every: 120 },
  workout: { on: false, time: '18:00' },
};

const REMINDER_COPY = {
  breakfast: ['hub.remindBreakfast', 'hub.remindBreakfastD'],
  lunch: ['hub.remindLunch', 'hub.remindLunchD'],
  dinner: ['hub.remindDinner', 'hub.remindDinnerD'],
  water: ['hub.remindWater', 'hub.remindWaterD'],
  workout: ['hub.remindWorkout', 'hub.remindWorkoutD'],
};

function makeCircleCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join('');
}

function reminderSlots(spec, now = new Date()) {
  const [hour, minute] = String(spec.time || '08:00').split(':').map(Number);
  const start = new Date(now);
  start.setHours(hour, minute, 0, 0);
  if (!spec.every) {
    if (start.getTime() <= now.getTime() + 1000) start.setDate(start.getDate() + 1);
    return [start];
  }
  const slots = [];
  for (let step = 0; step < 12; step += 1) {
    const slot = new Date(start.getTime() + step * spec.every * 60000);
    if (slot.getDate() !== start.getDate() || slot.getHours() > 22) break;
    if (slot.getTime() > now.getTime() + 1000) slots.push(slot);
  }
  if (!slots.length) {
    const tomorrow = new Date(start);
    tomorrow.setDate(tomorrow.getDate() + 1);
    slots.push(tomorrow);
  }
  return slots;
}

const STORAGE_KEY = 'dct-nutri-v1';

const defaultProfile = {
  name: '',
  level: 'principiante',
  age: 30,
  heightCm: 165,
  weightKg: 70,
  goalKg: 63,
  activity: 'moderada',
};

const defaultCircle = [
  { id: 'antonella', name: 'Antonella', points: 92 },
  { id: 'rafael', name: 'Rafael', points: 36 },
];

function loadStore() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (!data || data.version !== 1) return null;
    return data;
  } catch {
    return null;
  }
}

function initialStore() {
  const saved = loadStore();
  const today = isoDate();
  if (!saved) {
    return {
      onboarded: false,
      profile: defaultProfile,
      waterMl: 0,
      waterDate: today,
      workoutsDone: [],
      diary: [],
      weightLog: [],
      recipeWeek: defaultRecipeWeek,
      shoppingChecked: {},
      seca: emptySeca,
      language: detectLanguage(),
      circleMembers: defaultCircle,
      reminders: DEFAULT_REMINDERS,
      circleCode: makeCircleCode(),
    };
  }
  return {
    onboarded: Boolean(saved.onboarded),
    profile: { ...defaultProfile, ...(saved.profile || {}) },
    waterMl: saved.waterDate === today ? Number(saved.waterMl) || 0 : 0,
    waterDate: today,
    workoutsDone: Array.isArray(saved.workoutsDone) ? saved.workoutsDone : [],
    diary: Array.isArray(saved.diary) ? saved.diary : [],
    weightLog: Array.isArray(saved.weightLog) ? saved.weightLog : [],
    recipeWeek: Array.isArray(saved.recipeWeek) ? saved.recipeWeek : defaultRecipeWeek,
    shoppingChecked: saved.shoppingChecked && typeof saved.shoppingChecked === 'object' ? saved.shoppingChecked : {},
    seca: { ...emptySeca, ...(saved.seca || {}) },
    language: saved.language || detectLanguage(),
    circleMembers: Array.isArray(saved.circleMembers) ? saved.circleMembers : defaultCircle,
    reminders: { ...DEFAULT_REMINDERS, ...(saved.reminders || {}) },
    circleCode: saved.circleCode || makeCircleCode(),
  };
}

function writeStore(payload) {
  const raw = JSON.stringify(payload);
  try {
    localStorage.setItem(STORAGE_KEY, raw);
  } catch {
    const slim = { ...payload, diary: payload.diary.map(({ preview, ...item }) => item) };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(slim)); } catch { /* the phone is full */ }
  }
}

const emptySeca = {
  active: false,
  finished: false,
  startWeight: null,
  endWeight: null,
  dayCursor: 0,
  checks: {},
  swaps: {},
};

export function AppProvider({ children }) {
  const [boot] = useState(initialStore);
  const [onboarded, setOnboarded] = useState(boot.onboarded);
  const [profile, setProfile] = useState(boot.profile);
  const [waterMl, setWaterMl] = useState(boot.waterMl);
  const [waterDate, setWaterDate] = useState(boot.waterDate);
  const [workoutsDone, setWorkoutsDone] = useState(boot.workoutsDone);
  const [diary, setDiary] = useState(boot.diary);
  const [weightLog, setWeightLog] = useState(boot.weightLog);
  const [recipeWeek, setRecipeWeek] = useState(boot.recipeWeek);
  const [shoppingChecked, setShoppingChecked] = useState(boot.shoppingChecked);
  const [seca, setSeca] = useState(boot.seca);
  const [installEvent, setInstallEvent] = useState(null);
  const [sheet, setSheet] = useState(null);
  const [language, setLanguage] = useState(boot.language);
  const [circleMembers, setCircleMembers] = useState(boot.circleMembers);
  const [reminders, setReminders] = useState(boot.reminders);
  const [circleCode, setCircleCode] = useState(boot.circleCode);

  useEffect(() => {
    document.documentElement.lang = language === 'pt' ? 'pt-BR' : language;
  }, [language]);

  useEffect(() => {
    const today = isoDate();
    if (waterDate === today) return;
    setWaterDate(today);
    setWaterMl(0);
  }, [waterDate]);

  useEffect(() => {
    writeStore({
      version: 1,
      onboarded,
      profile,
      waterMl,
      waterDate,
      workoutsDone,
      diary,
      weightLog,
      recipeWeek,
      shoppingChecked,
      seca,
      language,
      circleMembers,
      reminders,
      circleCode,
    });
  }, [onboarded, profile, waterMl, waterDate, workoutsDone, diary, weightLog, recipeWeek, shoppingChecked, seca, language, circleMembers, reminders, circleCode]);

  useEffect(() => {
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return undefined;
    const timers = Object.entries(reminders).flatMap(([id, spec]) => {
      const copy = REMINDER_COPY[id];
      const on = spec === true || spec?.on;
      if (!on || !copy) return [];
      const item = spec && typeof spec === 'object' ? spec : DEFAULT_REMINDERS[id];
      return reminderSlots(item).map((when) => setTimeout(() => {
        try {
          new Notification(translate(language, copy[0]), { body: translate(language, copy[1]) });
        } catch { /* the tab may block it */ }
      }, when.getTime() - Date.now()));
    });
    return () => timers.forEach(clearTimeout);
  }, [reminders, language]);

  useEffect(() => {
    const onPrompt = (event) => {
      event.preventDefault();
      setInstallEvent(event);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  const today = isoDate();
  const plan = useMemo(() => caloriePlan(profile), [profile]);
  const targets = useMemo(() => macroTargets(plan.target), [plan.target]);
  const todayDiary = useMemo(() => diary.filter((item) => item.date === today), [diary, today]);
  const consumed = useMemo(() => sumDiary(todayDiary), [todayDiary]);

  const streak = useMemo(() => {
    const dates = [
      ...diary.map((item) => item.date),
      ...workoutsDone.map((item) => item.date),
    ];
    if (waterMl >= WATER_GOAL_ML) dates.push(today);
    return streakFromDates(dates, today);
  }, [diary, workoutsDone, waterMl, today]);

  const value = useMemo(() => {
    function completeOnboarding(next) {
      setProfile(next);
      setWeightLog([{ date: isoDate(), kg: Number(next.weightKg) }]);
      setOnboarded(true);
    }

    function saveProfile(partial) {
      setProfile((current) => ({ ...current, ...partial }));
      if (partial.weightKg != null) {
        const date = isoDate();
        const kg = Number(partial.weightKg);
        setWeightLog((log) => [...log.filter((item) => item.date !== date), { date, kg }]);
      }
    }

    function addWater(amount) {
      setWaterMl((current) => Math.min(4000, current + amount));
    }

    function markWorkout(id, category) {
      const date = isoDate();
      setWorkoutsDone((list) => {
        if (list.some((item) => item.id === id && item.date === date)) return list;
        return [...list, { id, category, date }];
      });
    }

    function addFood(food) {
      const qty = Number(food.qty) || 1;
      setDiary((list) => [
        ...list,
        {
          id: crypto.randomUUID(),
          date: isoDate(),
          time: clock(),
          name: food.name,
          kcal: Math.round((food.kcal || 0) * qty),
          protein: +((food.protein || 0) * qty).toFixed(1),
          carbs: +((food.carbs || 0) * qty).toFixed(1),
          fat: +((food.fat || 0) * qty).toFixed(1),
          fiber: +((food.fiber || 0) * qty).toFixed(1),
          portion: food.portion || '1 porción',
          qty,
          meal: food.meal || mealByHour(),
          source: food.source || 'manual',
          preview: food.preview || '',
        },
      ]);
    }

    function removeFood(id) {
      setDiary((list) => list.filter((item) => item.id !== id));
    }

    function updateFood(id, partial) {
      setDiary((list) => list.map((item) => {
        if (item.id !== id) return item;
        const next = { ...item };
        ['kcal', 'protein', 'carbs', 'fat', 'fiber'].forEach((key) => {
          if (partial[key] != null && partial[key] !== '') next[key] = Number(partial[key]) || 0;
        });
        return next;
      }));
    }

    function toggleRecipe(id) {
      setRecipeWeek((list) => (list.includes(id) ? list.filter((item) => item !== id) : [...list, id]));
    }

    function toggleShop(name) {
      setShoppingChecked((current) => ({ ...current, [name]: !current[name] }));
    }

    function startSeca() {
      setSeca({
        active: true,
        finished: false,
        startWeight: profile.weightKg,
        endWeight: null,
        dayCursor: 0,
        checks: {},
        swaps: {},
      });
    }

    function toggleCheck(key) {
      setSeca((current) => {
        const day = String(current.dayCursor);
        const prev = current.checks[day] || {};
        return { ...current, checks: { ...current.checks, [day]: { ...prev, [key]: !prev[key] } } };
      });
    }

    function toggleSwap(day, slot) {
      const key = `${day}:${slot}`;
      setSeca((current) => ({ ...current, swaps: { ...current.swaps, [key]: !current.swaps[key] } }));
    }

    function closeSecaDay() {
      setSeca((current) => {
        if (current.dayCursor >= 20) return { ...current, finished: true };
        return { ...current, dayCursor: current.dayCursor + 1 };
      });
    }

    function setEndWeight(kg) {
      const value = Number(kg);
      setSeca((current) => ({ ...current, endWeight: value }));
      saveProfile({ weightKg: value });
    }

    function restartSeca() {
      setSeca(emptySeca);
    }

    async function installApp() {
      if (!installEvent) return false;
      installEvent.prompt();
      const choice = await installEvent.userChoice;
      setInstallEvent(null);
      return choice.outcome === 'accepted';
    }

    function addCircleMember(name) {
      const clean = String(name || '').trim();
      if (!clean) return;
      setCircleMembers((list) => [...list, { id: crypto.randomUUID(), name: clean, points: 0 }]);
    }

    function removeCircleMember(id) {
      setCircleMembers((list) => list.filter((item) => item.id !== id));
    }

    function setReminder(id, patch) {
      setReminders((current) => {
        const prev = current[id];
        const base = prev && typeof prev === 'object'
          ? prev
          : { ...(DEFAULT_REMINDERS[id] || { time: '08:00' }), on: Boolean(prev) };
        const next = typeof patch === 'boolean' ? { on: patch } : patch;
        return { ...current, [id]: { ...base, ...next } };
      });
    }

    function resetSession() {
      setOnboarded(false);
      setWaterMl(0);
      setWaterDate(isoDate());
      setWorkoutsDone([]);
      setDiary([]);
      setWeightLog([]);
      setRecipeWeek(defaultRecipeWeek);
      setShoppingChecked({});
      setSeca(emptySeca);
      setSheet(null);
      setCircleMembers(defaultCircle);
      setReminders(DEFAULT_REMINDERS);
      setCircleCode(makeCircleCode());
    }

    const t = (key, vars) => translate(language, key, vars);
    const tr = (value) => translateContent(language, value);

    return {
      language,
      setLanguage,
      t,
      tr,
      onboarded,
      profile,
      waterMl,
      waterGoal: WATER_GOAL_ML,
      workoutsDone,
      diary,
      todayDiary,
      consumed,
      weightLog,
      recipeWeek,
      shoppingChecked,
      seca,
      plan,
      targets,
      streak,
      today,
      installEvent,
      sheet,
      setSheet,
      completeOnboarding,
      saveProfile,
      addWater,
      markWorkout,
      addFood,
      removeFood,
      updateFood,
      toggleRecipe,
      toggleShop,
      startSeca,
      toggleCheck,
      toggleSwap,
      closeSecaDay,
      setEndWeight,
      restartSeca,
      installApp,
      resetSession,
      circleMembers,
      circleCode,
      addCircleMember,
      removeCircleMember,
      reminders,
      setReminder,
    };
  }, [language, onboarded, profile, waterMl, workoutsDone, diary, todayDiary, consumed, weightLog, recipeWeek, shoppingChecked, seca, plan, targets, streak, today, installEvent, sheet, circleMembers, circleCode, reminders]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp fuera del provider');
  return ctx;
}
