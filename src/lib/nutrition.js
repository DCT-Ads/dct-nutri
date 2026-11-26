const ACTIVITY = {
  sedentaria: 1.2,
  ligera: 1.375,
  moderada: 1.55,
  activa: 1.725,
};

export const WATER_GOAL_ML = 2000;
export const FIBER_GOAL = 25;
export const WEEK_GOAL = 3;

export function caloriePlan(profile) {
  const weight = Number(profile.weightKg) || 70;
  const height = Number(profile.heightCm) || 165;
  const age = Number(profile.age) || 30;
  const bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  const tdee = bmr * (ACTIVITY[profile.activity] || 1.55);
  const delta = weight - (Number(profile.goalKg) || weight);
  let deficit = 0;
  if (delta > 12) deficit = 500;
  else if (delta > 6) deficit = 450;
  else if (delta > 0) deficit = 350;
  const raw = tdee - deficit;
  const minApplied = raw < 1400 && deficit > 0;
  const target = Math.round(Math.max(1400, raw) / 10) * 10;
  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    target,
    deficit,
    minApplied,
    maintaining: delta <= 0,
  };
}

export function macroTargets(kcal) {
  return {
    protein: Math.round((kcal * 0.3) / 4),
    carbs: Math.round((kcal * 0.4) / 4),
    fat: Math.round((kcal * 0.3) / 9),
    fiber: FIBER_GOAL,
  };
}

export function sumDiary(entries) {
  return entries.reduce(
    (acc, item) => ({
      kcal: acc.kcal + (item.kcal || 0),
      protein: acc.protein + (item.protein || 0),
      carbs: acc.carbs + (item.carbs || 0),
      fat: acc.fat + (item.fat || 0),
      fiber: acc.fiber + (item.fiber || 0),
    }),
    { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
  );
}

export function percent(value, goal) {
  if (!goal) return 0;
  return Math.round((value / goal) * 100);
}
