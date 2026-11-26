export function isoDate(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function formatKcal(n) {
  return Math.round(Number(n) || 0).toLocaleString('es-ES');
}

export function formatLiters(ml) {
  return (Math.max(0, ml) / 1000).toFixed(1).replace('.', ',');
}

export function greeting(date = new Date()) {
  const h = date.getHours();
  if (h < 12) return 'Buenos días';
  if (h < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

export function clock(date = new Date()) {
  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

export function mealByHour(date = new Date()) {
  const h = date.getHours();
  if (h < 11) return 'desayuno';
  if (h < 16) return 'almuerzo';
  if (h < 19) return 'merienda';
  return 'cena';
}

export const MEAL_LABEL = {
  desayuno: 'Desayuno',
  almuerzo: 'Almuerzo',
  merienda: 'Merienda',
  cena: 'Cena',
};

export function currentWeek(now = new Date()) {
  const day = now.getDay();
  const monday = new Date(now);
  monday.setHours(12, 0, 0, 0);
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
  const letters = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  const today = isoDate(now);
  return letters.map((letter, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return { letter, date: d.getDate(), iso: isoDate(d), isToday: isoDate(d) === today };
  });
}

export function monthMatrix(base) {
  const year = base.getFullYear();
  const month = base.getMonth();
  const first = new Date(year, month, 1, 12);
  const startPad = (first.getDay() + 6) % 7;
  const daysIn = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startPad; i += 1) cells.push(null);
  for (let d = 1; d <= daysIn; d += 1) {
    const date = new Date(year, month, d, 12);
    cells.push({ date: d, iso: isoDate(date) });
  }
  const label = first.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  return { year, month, label, cells };
}

export function streakFromDates(dates, today = isoDate()) {
  const set = new Set(dates);
  const cursor = new Date(`${today}T12:00:00`);
  if (!set.has(isoDate(cursor))) cursor.setDate(cursor.getDate() - 1);
  let count = 0;
  while (set.has(isoDate(cursor))) {
    count += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}

export function norm(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}
