import { findFood, foods } from '../data/foods';

function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function averageColor(file) {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  canvas.width = 24;
  canvas.height = 24;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(bitmap, 0, 0, 24, 24);
  const { data } = ctx.getImageData(0, 0, 24, 24);
  let r = 0;
  let g = 0;
  let b = 0;
  let n = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 40) continue;
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    n += 1;
  }
  bitmap.close?.();
  if (!n) return { r: 180, g: 160, b: 140 };
  return { r: r / n, g: g / n, b: b / n };
}

function foodFromColor({ r, g, b }) {
  if (g > r + 15 && g > b) return 'ensalada';
  if (r > 170 && g > 140 && b < 110) return 'banana';
  if (r > 160 && g < 110 && b < 110) return 'fresa';
  if (r > 170 && g > 100 && b < 80) return 'batata';
  if (r > 200 && g > 200 && b > 200) return 'arroz';
  if (r > 90 && r < 170 && Math.abs(r - g) < 30 && b < r) return 'pollo';
  return 'pollo';
}

function foodFromName(name) {
  const text = String(name || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
  return foods.find((food) => food.aliases.some((alias) => text.includes(alias.normalize('NFD').replace(/\p{Diacritic}/gu, ''))) || text.includes(food.id));
}

function pack(food, extra) {
  return {
    name: food.name,
    kcal: food.kcal,
    protein: food.protein,
    carbs: food.carbs,
    fat: food.fat,
    fiber: food.fiber,
    portion: food.portion,
    ...extra,
  };
}

async function mockRecognize(file) {
  await delay(900);
  const named = foodFromName(file?.name);
  if (named) return pack(named, { confidence: 0.86, source: 'mock' });
  try {
    const color = await averageColor(file);
    return pack(findFood(foodFromColor(color)), { confidence: 0.64, source: 'mock' });
  } catch {
    return pack(findFood('ensalada'), { confidence: 0.5, source: 'mock' });
  }
}

export function visionConfigured() {
  return Boolean(import.meta.env.VITE_VISION_ENDPOINT);
}

export async function recognizeFood(file) {
  const endpoint = import.meta.env.VITE_VISION_ENDPOINT;
  if (endpoint) {
    const image = await readAsDataURL(file);
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image }),
    });
    if (!response.ok) throw new Error('La API de visión no respondió.');
    const data = await response.json();
    return {
      name: data.name || 'Alimento',
      kcal: Number(data.kcal) || 0,
      protein: Number(data.protein) || 0,
      carbs: Number(data.carbs) || 0,
      fat: Number(data.fat) || 0,
      fiber: Number(data.fiber) || 0,
      portion: data.portion || '1 porción',
      confidence: data.confidence ?? null,
      source: 'api',
    };
  }
  return mockRecognize(file);
}

export async function makeThumb(file) {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  canvas.width = 96;
  canvas.height = 96;
  const ctx = canvas.getContext('2d');
  const side = Math.min(bitmap.width, bitmap.height);
  ctx.drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, 96, 96);
  bitmap.close?.();
  return canvas.toDataURL('image/jpeg', 0.72);
}
