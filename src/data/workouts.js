export const exercises = {
  puente: { name: 'Puente de glúteos', pose: 'bridge', cue: 'Empuja con los talones y aprieta arriba.' },
  patada: { name: 'Patada de glúteo', pose: 'kick', cue: 'Cadera quieta. El talón busca el techo.' },
  sentadilla: { name: 'Sentadilla', pose: 'squat', cue: 'Rodillas siguen la línea de los pies.' },
  abduccion: { name: 'Abducción de cadera', pose: 'clam', cue: 'Abre sin girar la pelvis.' },
  clam: { name: 'Almeja', pose: 'clam', cue: 'Talones juntos, abre la rodilla de arriba.' },
  zancada: { name: 'Zancada', pose: 'lunge', cue: 'Paso largo. La rodilla de atrás baja con control.' },
  bulgara: { name: 'Sentadilla búlgara', pose: 'lunge', cue: 'Pie de atrás apoyado. Baja en vertical.' },
  rdl: { name: 'Peso muerto rumano', pose: 'hinge', cue: 'Cadera atrás, espalda larga.' },
  gemelo: { name: 'Elevación de talones', pose: 'calf', cue: 'Sube lento y pausa un segundo arriba.' },
  step: { name: 'Step-up', pose: 'step', cue: 'Empuja con la pierna de arriba.' },
  hipthrust: { name: 'Hip thrust', pose: 'bridge', cue: 'Costillas abajo. Aprieta el glúteo arriba.' },
  sumo: { name: 'Sentadilla sumo', pose: 'squat', cue: 'Pies abiertos y rodillas hacia afuera.' },
  banda: { name: 'Caminata lateral con banda', pose: 'squat', cue: 'Media sentadilla y pasos cortos.' },
  frog: { name: 'Frog pump', pose: 'bridge', cue: 'Plantas juntas, cadera al techo.' },
  una: { name: 'Puente a una pierna', pose: 'bridge', cue: 'Mantén la cadera nivelada.' },
  silla: { name: 'Sentadilla a la silla', pose: 'squat', cue: 'Toca y vuelve a subir sin dejarte caer.' },
  pared: { name: 'Sentadilla en la pared', pose: 'squat', cue: 'Espalda apoyada, rodillas cerca de 90°.' },
  lateral: { name: 'Zancada lateral', pose: 'lunge', cue: 'Siéntate hacia un lado y vuelve al centro.' },
  crunch: { name: 'Crunch', pose: 'crunch', cue: 'Despega solo los hombros. Cuello relajado.' },
  inverso: { name: 'Crunch inverso', pose: 'reverse', cue: 'Rodillas al pecho, sin impulso.' },
  piernas: { name: 'Elevación de piernas', pose: 'legraise', cue: 'Lumbar pegada al piso.' },
  bici: { name: 'Bicicleta', pose: 'bicycle', cue: 'Codo a la rodilla contraria, sin prisa.' },
  plancha: { name: 'Plancha', pose: 'plank', cue: 'Una línea de la cabeza a los pies.' },
  lateralpl: { name: 'Plancha lateral', pose: 'sideplank', cue: 'Cadera arriba, hombros alineados.' },
  deadbug: { name: 'Dead bug', pose: 'deadbug', cue: 'Lumbar quieta al alargar brazo y pierna.' },
  bird: { name: 'Pájaro-perro', pose: 'bird', cue: 'Alarga sin arquear la espalda.' },
  ruso: { name: 'Giro ruso', pose: 'russian', cue: 'Gira el pecho, no solo los brazos.' },
  hollow: { name: 'Hollow', pose: 'hollow', cue: 'Abdomen firme. Baja solo hasta donde controles.' },
  escalador: { name: 'Escaladores', pose: 'mountain', cue: 'Manos bajo los hombros.' },
  oblicuo: { name: 'Encogimiento oblicuo', pose: 'oblique', cue: 'Acerca la costilla a la cadera.' },
  toque: { name: 'Toque de tobillos', pose: 'touch', cue: 'Alcanza el tobillo sin tirar del cuello.' },
};

const b = (ex, sets, reps, rest) => ({ ex, sets, reps, rest });

export const workouts = [
  { id: 'g-p-1', category: 'gluteos', level: 'principiante', name: 'Despertar de glúteos', minutes: 20, place: 'En casa', blurb: 'Activación suave para empezar el reto.', blocks: [b('puente', 3, '12', 30), b('patada', 3, '10', 30), b('sentadilla', 3, '10', 40), b('clam', 3, '12', 25), b('abduccion', 3, '12', 25)] },
  { id: 'g-p-2', category: 'gluteos', level: 'principiante', name: 'Ritmo suave', minutes: 22, place: 'En casa', blurb: 'Más repeticiones, mismo cuidado.', blocks: [b('sentadilla', 3, '12', 40), b('puente', 3, '15', 30), b('zancada', 3, '8', 40), b('frog', 3, '15', 30), b('banda', 3, '10', 30)] },
  { id: 'g-p-3', category: 'gluteos', level: 'principiante', name: 'Confianza', minutes: 24, place: 'En casa', blurb: 'Equilibrio y control, sin apuro.', blocks: [b('silla', 3, '12', 40), b('una', 3, '8', 35), b('patada', 3, '12', 30), b('lateral', 3, '8', 35), b('plancha', 3, '20 s', 30)] },
  { id: 'g-i-1', category: 'gluteos', level: 'intermedio', name: 'Glúteos en fuego', minutes: 20, place: 'En casa', blurb: 'El día 1 de tu nivel, directo al punto.', blocks: [b('sentadilla', 4, '12', 40), b('hipthrust', 4, '12', 40), b('zancada', 3, '10', 40), b('patada', 3, '12', 30), b('banda', 3, '12', 30)] },
  { id: 'g-i-2', category: 'gluteos', level: 'intermedio', name: 'Empuje', minutes: 28, place: 'En casa', blurb: 'Cadera fuerte y piernas presentes.', blocks: [b('sumo', 4, '12', 40), b('puente', 4, '15', 30), b('bulgara', 3, '8', 45), b('rdl', 3, '10', 40), b('gemelo', 3, '15', 25)] },
  { id: 'g-i-3', category: 'gluteos', level: 'intermedio', name: 'Resistencia', minutes: 30, place: 'Gimnasio', blurb: 'Series un poco más largas.', blocks: [b('hipthrust', 4, '10', 45), b('sentadilla', 4, '10', 50), b('rdl', 3, '10', 45), b('zancada', 3, '10', 40), b('abduccion', 3, '15', 30)] },
  { id: 'g-a-1', category: 'gluteos', level: 'avanzado', name: 'Control total', minutes: 20, place: 'En casa', blurb: 'Pocas concesiones, mucha técnica.', blocks: [b('bulgara', 4, '10', 45), b('una', 4, '10', 40), b('rdl', 4, '12', 40), b('frog', 4, '20', 30), b('plancha', 3, '30 s', 30)] },
  { id: 'g-a-2', category: 'gluteos', level: 'avanzado', name: 'Potencia', minutes: 34, place: 'Gimnasio', blurb: 'Carga y pausa. Calidad primero.', blocks: [b('sentadilla', 5, '8', 60), b('hipthrust', 4, '8', 60), b('rdl', 4, '8', 50), b('zancada', 3, '12', 40), b('gemelo', 4, '12', 30)] },
  { id: 'g-a-3', category: 'gluteos', level: 'avanzado', name: 'Densidad', minutes: 32, place: 'Gimnasio', blurb: 'Volumen corto y exigente.', blocks: [b('sumo', 4, '10', 50), b('bulgara', 4, '8', 50), b('banda', 4, '12', 30), b('step', 3, '10', 40), b('una', 3, '10', 40)] },

  { id: 'p-p-1', category: 'piernas', level: 'principiante', name: 'Base de piernas', minutes: 20, place: 'En casa', blurb: 'Sentadilla, zancada y gemelo para arrancar.', blocks: [b('silla', 3, '12', 40), b('zancada', 3, '8', 40), b('puente', 3, '12', 30), b('gemelo', 3, '12', 25), b('pared', 3, '20 s', 30)] },
  { id: 'p-p-2', category: 'piernas', level: 'principiante', name: 'Piernas despiertas', minutes: 24, place: 'En casa', blurb: 'Un poco más de recorrido.', blocks: [b('sentadilla', 3, '12', 40), b('step', 3, '8', 40), b('lateral', 3, '8', 35), b('gemelo', 3, '15', 25), b('rdl', 3, '10', 40)] },
  { id: 'p-i-1', category: 'piernas', level: 'intermedio', name: 'Piernas firmes', minutes: 28, place: 'En casa', blurb: 'Búlgara y bisagra, a tu ritmo.', blocks: [b('sentadilla', 4, '12', 45), b('bulgara', 3, '8', 45), b('rdl', 3, '10', 45), b('zancada', 3, '10', 40), b('gemelo', 3, '15', 25)] },
  { id: 'p-i-2', category: 'piernas', level: 'intermedio', name: 'Día de gimnasio', minutes: 32, place: 'Gimnasio', blurb: 'La misma lógica, con más apoyo.', blocks: [b('sentadilla', 4, '10', 60), b('rdl', 4, '10', 50), b('zancada', 3, '10', 40), b('step', 3, '10', 40), b('gemelo', 4, '12', 30)] },
  { id: 'p-a-1', category: 'piernas', level: 'avanzado', name: 'Fuerza de piernas', minutes: 34, place: 'Gimnasio', blurb: 'Series más pesadas, descanso real.', blocks: [b('sentadilla', 5, '6', 75), b('rdl', 4, '8', 60), b('bulgara', 4, '8', 50), b('step', 3, '8', 40), b('gemelo', 4, '10', 30)] },
  { id: 'p-a-2', category: 'piernas', level: 'avanzado', name: 'Resistencia de piernas', minutes: 30, place: 'En casa', blurb: 'Repeticiones altas y control.', blocks: [b('sentadilla', 4, '15', 40), b('zancada', 4, '12', 40), b('sumo', 4, '12', 40), b('pared', 3, '40 s', 30), b('gemelo', 4, '20', 25)] },

  { id: 'a-p-1', category: 'abdomen', level: 'principiante', focus: 'inferior', name: 'Abdomen inferior suave', minutes: 18, place: 'En casa', blurb: 'Lumbar protegida, abdomen despierto.', blocks: [b('inverso', 3, '10', 30), b('piernas', 3, '8', 30), b('deadbug', 3, '8', 30), b('plancha', 3, '20 s', 30)] },
  { id: 'a-p-2', category: 'abdomen', level: 'principiante', focus: 'superior', name: 'Abdomen superior', minutes: 16, place: 'En casa', blurb: 'Crunch corto, sin tirar del cuello.', blocks: [b('crunch', 3, '12', 25), b('toque', 3, '12', 25), b('plancha', 3, '20 s', 30), b('bird', 3, '8', 25)] },
  { id: 'a-p-3', category: 'abdomen', level: 'principiante', focus: 'oblicuos', name: 'Oblicuos suaves', minutes: 18, place: 'En casa', blurb: 'Giros lentos y plancha de lado.', blocks: [b('oblicuo', 3, '10', 25), b('bici', 3, '8', 30), b('lateralpl', 3, '15 s', 25), b('ruso', 3, '10', 30)] },
  { id: 'a-p-4', category: 'abdomen', level: 'principiante', focus: 'full', name: 'Core completo', minutes: 20, place: 'En casa', blurb: 'Un poco de cada zona.', blocks: [b('deadbug', 3, '8', 25), b('plancha', 3, '20 s', 30), b('bird', 3, '8', 25), b('crunch', 3, '12', 25), b('inverso', 3, '10', 30)] },
  { id: 'a-i-1', category: 'abdomen', level: 'intermedio', focus: 'inferior', name: 'Inferior en control', minutes: 22, place: 'En casa', blurb: 'Piernas largas, lumbar quieta.', blocks: [b('piernas', 4, '10', 30), b('inverso', 4, '12', 30), b('hollow', 3, '20 s', 30), b('plancha', 3, '30 s', 30)] },
  { id: 'a-i-2', category: 'abdomen', level: 'intermedio', focus: 'superior', name: 'Superior y ritmo', minutes: 20, place: 'En casa', blurb: 'Más repeticiones, misma forma.', blocks: [b('crunch', 4, '15', 25), b('toque', 3, '16', 25), b('escalador', 3, '20', 30), b('plancha', 3, '30 s', 30)] },
  { id: 'a-i-3', category: 'abdomen', level: 'intermedio', focus: 'oblicuos', name: 'Oblicuos', minutes: 22, place: 'En casa', blurb: 'Bici, giro y plancha lateral.', blocks: [b('bici', 4, '12', 30), b('ruso', 3, '16', 30), b('lateralpl', 3, '25 s', 25), b('oblicuo', 3, '12', 25)] },
  { id: 'a-i-4', category: 'abdomen', level: 'intermedio', focus: 'full', name: 'Full core', minutes: 24, place: 'En casa', blurb: 'El circuito completo del medio.', blocks: [b('hollow', 4, '20 s', 30), b('deadbug', 3, '10', 25), b('escalador', 3, '24', 30), b('bici', 3, '12', 30), b('lateralpl', 3, '20 s', 25)] },
  { id: 'a-a-1', category: 'abdomen', level: 'avanzado', focus: 'inferior', name: 'Inferior avanzado', minutes: 24, place: 'En casa', blurb: 'Hollow largo y piernas firmes.', blocks: [b('piernas', 4, '12', 30), b('hollow', 4, '30 s', 30), b('inverso', 4, '15', 30), b('plancha', 3, '40 s', 30)] },
  { id: 'a-a-2', category: 'abdomen', level: 'avanzado', focus: 'oblicuos', name: 'Oblicuos avanzados', minutes: 24, place: 'En casa', blurb: 'Más tiempo de lado, mismo cuidado.', blocks: [b('bici', 4, '20', 25), b('ruso', 4, '20', 25), b('lateralpl', 4, '30 s', 25), b('escalador', 3, '30', 30)] },
  { id: 'a-a-3', category: 'abdomen', level: 'avanzado', focus: 'full', name: 'Full core avanzado', minutes: 26, place: 'En casa', blurb: 'El reto largo de abdomen.', blocks: [b('hollow', 4, '30 s', 30), b('plancha', 4, '40 s', 30), b('deadbug', 4, '10', 25), b('bici', 4, '16', 25), b('bird', 3, '10', 25)] },
];

export const FOCUS_LABEL = {
  inferior: 'Abdomen inferior',
  superior: 'Abdomen superior',
  oblicuos: 'Oblicuos',
  full: 'Full core',
};

export function workoutsBy(category, level, focus) {
  return workouts.filter((item) => {
    if (item.category !== category || item.level !== level) return false;
    if (focus && focus !== 'todos' && item.focus !== focus) return false;
    return true;
  });
}

export function findWorkout(id) {
  return workouts.find((item) => item.id === id);
}
