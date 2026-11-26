import { Link, useParams } from 'react-router-dom';
import { findRecipe, recipes } from '../data/recipes';
import { Button, DietaTabs, PageTitle } from '../components/ui';
import { useApp } from '../context/AppContext';
import { mealByHour } from '../lib/format';

const TONE = {
  rosa: 'from-rosaPill to-rosaCard',
  mint: 'from-turqCard to-[#b7ebe3]',
  gold: 'from-yellowSoft to-[#ffe0a3]',
};

export default function Recetas() {
  const { id } = useParams();
  if (id) return <Detail id={id} />;
  return <List />;
}

function List() {
  const { recipeWeek, toggleRecipe, t, tr } = useApp();
  return (
    <div>
      <DietaTabs />
      <PageTitle kicker={t('rec.k')} title={t('tab.recipes')} />
      <div className="grid gap-3">
        {recipes.map((recipe) => (
          <article key={recipe.id} className="overflow-hidden rounded-[28px] bg-white shadow-card">
            <Link to={`/dieta/recetas/${recipe.id}`} className={`relative block h-36 overflow-hidden bg-gradient-to-br ${TONE[recipe.tone]} p-4`}>
              <span className="relative z-10 rounded-full bg-white/80 px-2 py-1 text-xs font-semibold">{recipe.minutes} min · {recipe.kcal} kcal</span>
              <span className="absolute -bottom-3 -right-1 text-7xl" aria-hidden="true">{recipe.emoji}</span>
            </Link>
            <div className="p-4">
              <Link to={`/dieta/recetas/${recipe.id}`}>
                <h2 className="font-display text-xl">{tr(recipe.name)}</h2>
                <p className="text-sm text-coach">{t('rec.kcal', { n: recipe.kcal })}</p>
              </Link>
              <button type="button" onClick={() => toggleRecipe(recipe.id)} className="mt-2 text-sm font-semibold text-magenta">
                {recipeWeek.includes(recipe.id) ? t('rec.inWeek') : t('rec.addWeek')}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Detail({ id }) {
  const recipe = findRecipe(id);
  const { addFood, t, tr } = useApp();
  if (!recipe) return <p>{t('rec.missing')}</p>;
  return (
    <div>
      <Link to="/dieta/recetas" className="text-sm font-semibold text-magenta">{t('rec.back')}</Link>
      <div className={`relative mt-3 h-40 overflow-hidden rounded-[28px] bg-gradient-to-br ${TONE[recipe.tone]}`}>
        <span className="absolute bottom-2 right-4 text-7xl">{recipe.emoji}</span>
      </div>
      <h1 className="mt-4 font-display text-3xl leading-none">{tr(recipe.name)}</h1>
      <p className="mt-2 text-sm text-coach">{recipe.minutes} min · {recipe.kcal} kcal · P {recipe.protein}g · C {recipe.carbs}g · G {recipe.fat}g · F {recipe.fiber}g</p>
      <h2 className="mt-4 font-semibold">{t('rec.ing')}</h2>
      <ul className="mt-2 grid gap-1 text-sm">
        {recipe.ingredients.map((item) => <li key={item.name}>{tr(item.name)} · {tr(item.qty)}</li>)}
      </ul>
      <h2 className="mt-4 font-semibold">{t('rec.steps')}</h2>
      <ol className="mt-2 grid gap-2 text-sm text-coach">
        {recipe.steps.map((step, index) => <li key={step}>{index + 1}. {tr(step)}</li>)}
      </ol>
      <Button className="mt-5 w-full" onClick={() => addFood({ ...recipe, portion: '1 porción', meal: mealByHour(), source: 'receta' })}>{t('rec.ate')}</Button>
    </div>
  );
}
