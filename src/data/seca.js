const meal = (name, kcal, protein, carbs, fat, fiber, ingredients, swap) => ({
  name,
  kcal,
  protein,
  carbs,
  fat,
  fiber,
  ingredients,
  swap,
});

const desayunos = [
  meal('Avena con frutos rojos', 300, 12, 44, 7, 6, ['Avena 40 g', 'Leche descremada 200 ml', 'Fresas 80 g'], { name: 'Yogur con avena', kcal: 280, protein: 16, carbs: 32, fat: 7, fiber: 4, note: 'Misma energía, más fresca.', ingredients: ['Yogur natural 170 g', 'Avena 30 g'] }),
  meal('Tortilla de claras y tomate', 250, 22, 8, 12, 2, ['Huevo 1', 'Claras 3', 'Tomate 1'], { name: 'Huevos revueltos con espinaca', kcal: 260, protein: 18, carbs: 6, fat: 16, fiber: 2, note: 'Cambio equivalente de desayuno salado.', ingredients: ['Huevos 2', 'Espinaca 1 taza'] }),
  meal('Tostada integral con huevo', 280, 16, 24, 12, 3, ['Pan integral 1', 'Huevo 1', 'Palta 1/4'], { name: 'Tortilla de maíz con huevo', kcal: 270, protein: 14, carbs: 26, fat: 11, fiber: 3, note: 'El pan se cambia por tortilla.', ingredients: ['Tortilla de maíz 1', 'Huevo 1'] }),
  meal('Yogur griego con banana', 290, 18, 36, 6, 4, ['Yogur natural 170 g', 'Banana 1/2', 'Canela'], { name: 'Yogur con fresas', kcal: 220, protein: 16, carbs: 24, fat: 5, fiber: 3, note: 'Menos energía si el día pide calma.', ingredients: ['Yogur natural 170 g', 'Fresas 100 g'] }),
  meal('Batido de fresa', 260, 20, 30, 4, 3, ['Leche descremada 250 ml', 'Fresas 100 g', 'Avena 20 g'], { name: 'Leche con avena fría', kcal: 250, protein: 14, carbs: 34, fat: 5, fiber: 3, note: 'Sin licuadora.', ingredients: ['Leche 250 ml', 'Avena 30 g'] }),
  meal('Panqueque de avena', 310, 16, 40, 8, 5, ['Avena 40 g', 'Huevo 1', 'Banana 1/2'], { name: 'Avena cocida simple', kcal: 280, protein: 12, carbs: 42, fat: 6, fiber: 5, note: 'La misma base, sin sartén.', ingredients: ['Avena 40 g', 'Leche 200 ml'] }),
  meal('Revuelto con espinaca', 270, 18, 8, 16, 3, ['Huevos 2', 'Espinaca 1 taza', 'Tomate'], { name: 'Claras con champiñón', kcal: 180, protein: 22, carbs: 6, fat: 6, fiber: 2, note: 'Versión más ligera.', ingredients: ['Claras 4', 'Champiñón 80 g'] }),
];

const almuerzos = [
  meal('Pollo a la plancha y ensalada', 430, 40, 18, 16, 6, ['Pechuga 130 g', 'Hojas verdes', 'Aceite 1 cdita'], { name: 'Pollo con batata', kcal: 460, protein: 38, carbs: 36, fat: 12, fiber: 5, note: 'La ensalada se cambia por batata.', ingredients: ['Pechuga 120 g', 'Batata 180 g'] }),
  meal('Pescado con verduras', 420, 34, 20, 18, 6, ['Pescado blanco 140 g', 'Calabacín', 'Tomate'], { name: 'Pescado con papa', kcal: 440, protein: 34, carbs: 32, fat: 14, fiber: 4, note: 'Verdura por papa cocida.', ingredients: ['Pescado 140 g', 'Papa 150 g'] }),
  meal('Bowl de atún', 390, 34, 28, 12, 6, ['Atún 1 lata', 'Arroz 100 g', 'Hojas'], { name: 'Atún con batata', kcal: 400, protein: 32, carbs: 36, fat: 10, fiber: 5, note: 'El arroz se cambia por batata.', ingredients: ['Atún 1 lata', 'Batata 180 g'] }),
  meal('Lentejas con verduras', 420, 22, 58, 8, 14, ['Lentejas 80 g', 'Zanahoria', 'Calabacín'], { name: 'Garbanzos con ensalada', kcal: 400, protein: 18, carbs: 52, fat: 10, fiber: 12, note: 'Otra legumbre, misma idea.', ingredients: ['Garbanzos 80 g', 'Hojas verdes'] }),
  meal('Pechuga con arroz', 480, 40, 48, 10, 2, ['Pechuga 120 g', 'Arroz 150 g', 'Ensalada'], { name: 'Pechuga con batata', kcal: 450, protein: 38, carbs: 40, fat: 10, fiber: 5, note: 'Cambia el arroz por batata.', ingredients: ['Pechuga 120 g', 'Batata 180 g'] }),
  meal('Ensalada de quinua', 410, 16, 52, 14, 7, ['Quinua 70 g', 'Verduras', 'Aceite 1 cdita'], { name: 'Quinua con pollo', kcal: 460, protein: 34, carbs: 42, fat: 12, fiber: 6, note: 'Suma proteína si tienes hambre.', ingredients: ['Quinua 60 g', 'Pollo 80 g'] }),
  meal('Wrap de pavo', 400, 30, 38, 12, 5, ['Tortilla integral', 'Pavo 80 g', 'Hummus'], { name: 'Pavo con ensalada', kcal: 280, protein: 32, carbs: 10, fat: 10, fiber: 4, note: 'Sin tortilla, más ligero.', ingredients: ['Pavo 100 g', 'Hojas verdes'] }),
];

const cenas = [
  meal('Sopa de verduras con pollo', 340, 28, 22, 10, 6, ['Pollo 80 g', 'Verduras', 'Caldo'], { name: 'Caldo con tortilla de claras', kcal: 250, protein: 26, carbs: 8, fat: 10, fiber: 2, note: 'Cena más corta.', ingredients: ['Claras 4', 'Caldo de verduras'] }),
  meal('Salmón al horno y brócoli', 420, 32, 12, 24, 5, ['Salmón 110 g', 'Brócoli 150 g'], { name: 'Pescado blanco y brócoli', kcal: 280, protein: 32, carbs: 10, fat: 10, fiber: 5, note: 'Menos grasa, mismo plato.', ingredients: ['Pescado blanco 140 g', 'Brócoli'] }),
  meal('Revuelto de calabacín', 300, 18, 12, 18, 4, ['Huevos 2', 'Calabacín', 'Tomate'], { name: 'Claras con calabacín', kcal: 180, protein: 20, carbs: 8, fat: 6, fiber: 3, note: 'Versión más ligera.', ingredients: ['Claras 4', 'Calabacín'] }),
  meal('Ensalada tibia de garbanzos', 380, 16, 46, 12, 11, ['Garbanzos 80 g', 'Verduras', 'Limón'], { name: 'Garbanzos con batata', kcal: 400, protein: 14, carbs: 58, fat: 8, fiber: 12, note: 'La ensalada se cambia por batata.', ingredients: ['Garbanzos 70 g', 'Batata 150 g'] }),
  meal('Tortilla de espinaca', 320, 22, 8, 20, 3, ['Huevos 2', 'Espinaca', 'Queso fresco 30 g'], { name: 'Espinaca con pechuga', kcal: 280, protein: 34, carbs: 6, fat: 10, fiber: 3, note: 'Cena salada equivalente.', ingredients: ['Pechuga 100 g', 'Espinaca'] }),
  meal('Pavo con brócoli', 340, 36, 12, 12, 5, ['Pavo 120 g', 'Brócoli 150 g'], { name: 'Pavo con batata', kcal: 400, protein: 34, carbs: 36, fat: 8, fiber: 4, note: 'Suma batata si entrenaste.', ingredients: ['Pavo 100 g', 'Batata 160 g'] }),
  meal('Caldo de pollo y zucchini', 300, 26, 16, 10, 4, ['Pollo 80 g', 'Zucchini', 'Fideos de zucchini'], { name: 'Pollo con papa chica', kcal: 340, protein: 28, carbs: 24, fat: 8, fiber: 3, note: 'El zucchini se cambia por papa.', ingredients: ['Pollo 90 g', 'Papa 120 g'] }),
];

const snacks = [
  meal('Manzana', 95, 0, 25, 0, 4, ['Manzana 1'], { name: 'Pera', kcal: 100, protein: 1, carbs: 26, fat: 0, fiber: 5, note: 'Fruta equivalente.', ingredients: ['Pera 1'] }),
  meal('Yogur natural', 100, 10, 7, 3, 0, ['Yogur 170 g'], { name: 'Yogur con canela', kcal: 110, protein: 10, carbs: 9, fat: 3, fiber: 0, note: 'Sin azúcar añadida.', ingredients: ['Yogur 170 g', 'Canela'] }),
  meal('Almendras', 140, 5, 5, 12, 3, ['Almendras 18 g'], { name: 'Queso fresco', kcal: 120, protein: 10, carbs: 2, fat: 8, fiber: 0, note: 'Otro snack que sacia.', ingredients: ['Queso fresco 50 g'] }),
  meal('Zanahoria con hummus', 140, 5, 16, 6, 5, ['Zanahoria 1', 'Hummus 2 cdas'], { name: 'Pepino con hummus', kcal: 120, protein: 4, carbs: 12, fat: 6, fiber: 3, note: 'Más fresco.', ingredients: ['Pepino', 'Hummus 2 cdas'] }),
  meal('Gelatina sin azúcar', 40, 2, 2, 0, 0, ['Gelatina sin azúcar'], { name: 'Té y fruta', kcal: 60, protein: 1, carbs: 14, fat: 0, fiber: 2, note: 'Si quieres masticar algo.', ingredients: ['Té', 'Fresas 80 g'] }),
  meal('Pepino y queso fresco', 130, 10, 4, 8, 1, ['Pepino', 'Queso fresco 40 g'], { name: 'Tomate y queso fresco', kcal: 130, protein: 9, carbs: 5, fat: 8, fiber: 1, note: 'Mismo snack, otra verdura.', ingredients: ['Tomate', 'Queso fresco 40 g'] }),
  meal('Té y 2 galletas de arroz', 90, 2, 18, 1, 1, ['Té', 'Galletas de arroz 2'], { name: 'Té y manzana', kcal: 95, protein: 0, carbs: 25, fat: 0, fiber: 4, note: 'La galleta se cambia por fruta.', ingredients: ['Té', 'Manzana 1'] }),
];

export function menuForDay(dayIndex) {
  const i = ((dayIndex % 7) + 7) % 7;
  return [
    { slot: 'desayuno', label: 'Desayuno', ...desayunos[i] },
    { slot: 'snack1', label: 'Merienda', ...snacks[i] },
    { slot: 'almuerzo', label: 'Almuerzo', ...almuerzos[i] },
    { slot: 'snack2', label: 'Merienda', ...snacks[(i + 3) % 7] },
    { slot: 'cena', label: 'Cena', ...cenas[(i + 3) % 7] },
  ];
}

export function activeMeal(mealItem, swapped) {
  if (!swapped) return mealItem;
  return { ...mealItem, ...mealItem.swap, label: mealItem.label, slot: mealItem.slot };
}

export function dayTotals(dayIndex, swaps = {}) {
  return menuForDay(dayIndex).reduce(
    (acc, item) => {
      const chosen = activeMeal(item, Boolean(swaps[`${dayIndex}:${item.slot}`]));
      return {
        kcal: acc.kcal + chosen.kcal,
        protein: acc.protein + chosen.protein,
        carbs: acc.carbs + chosen.carbs,
        fat: acc.fat + chosen.fat,
        fiber: acc.fiber + chosen.fiber,
      };
    },
    { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
  );
}
