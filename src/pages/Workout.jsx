import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { exercises, findWorkout } from '../data/workouts';
import { MoveArt } from '../components/Art';
import { Button, Card } from '../components/ui';
import { useApp } from '../context/AppContext';

export default function Workout() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const playing = params.get('play') === '1';
  const { t } = useApp();
  const workout = findWorkout(id);
  if (!workout) return <p>{t('work.missing')}</p>;
  return playing ? <Player workout={workout} /> : <List workout={workout} />;
}

function List({ workout }) {
  const { t, tr } = useApp();
  return (
    <div>
      <Link to={workout.category === 'piernas' ? '/pernas' : workout.category === 'abdomen' ? '/abdomen' : '/entrenos'} className="text-sm font-semibold text-magenta">{t('work.back')}</Link>
      <h1 className="mt-2 font-display text-[30px] leading-none">{tr(workout.name)}</h1>
      <p className="mt-2 text-sm text-coach">{t('home.meta', { min: workout.minutes, n: workout.blocks.length, place: tr(workout.place) })}</p>
      <div className="mt-4 grid gap-3">
        {workout.blocks.map((block, index) => {
          const exercise = exercises[block.ex];
          return (
            <Card key={`${block.ex}-${index}`}>
              <MoveArt pose={exercise.pose} />
              <h2 className="mt-3 font-display text-xl">{tr(exercise.name)}</h2>
              <p className="text-sm font-semibold text-magenta">{block.sets}×{block.reps}</p>
              <p className="text-sm text-coach">{tr(exercise.cue)}</p>
              <p className="mt-1 text-xs text-gris">{t('work.restLabel', { n: block.rest })}</p>
            </Card>
          );
        })}
      </div>
      <Link to={`/entreno/${workout.id}?play=1`} className="mt-4 flex h-[50px] items-center justify-center rounded-full bg-magenta font-display text-white shadow-cta">{t('home.start')}</Link>
    </div>
  );
}

function Player({ workout }) {
  const { markWorkout, t, tr } = useApp();
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [serie, setSerie] = useState(0);
  const [phase, setPhase] = useState('work');
  const [restLeft, setRestLeft] = useState(0);
  const block = workout.blocks[index];
  const exercise = exercises[block.ex];

  useEffect(() => {
    if (phase !== 'rest') return undefined;
    const timer = setInterval(() => {
      setRestLeft((current) => {
        if (current <= 1) {
          setPhase('work');
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, index, serie]);

  function finish() {
    markWorkout(workout.id, workout.category);
    setPhase('done');
  }

  function completeSet() {
    if (serie + 1 < block.sets) {
      setSerie((current) => current + 1);
      setRestLeft(block.rest);
      setPhase('rest');
      return;
    }
    if (index + 1 < workout.blocks.length) {
      setIndex((current) => current + 1);
      setSerie(0);
      setRestLeft(block.rest);
      setPhase('rest');
      return;
    }
    finish();
  }

  if (phase === 'done') {
    return (
      <div className="flex min-h-[70dvh] flex-col justify-center text-center">
        <p className="text-sm text-coach">{t('work.doneK')}</p>
        <h1 className="mt-2 font-display text-4xl">{t('work.doneT')}</h1>
        <p className="mt-3 text-sm text-coach">{t('work.doneP')}</p>
        <Button className="mt-6 w-full" onClick={() => navigate('/inicio')}>{t('work.backHome')}</Button>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-coach">{t('work.exercise', { n: index + 1, total: workout.blocks.length })}</p>
      <h1 className="font-display text-3xl leading-none">{tr(exercise.name)}</h1>
      <div className="mt-4"><MoveArt pose={exercise.pose} /></div>
      {phase === 'rest' ? (
        <Card className="mt-4 text-center">
          <p className="text-sm text-coach">{t('work.rest')}</p>
          <p className="font-display text-6xl text-magenta">{restLeft}</p>
          <Button className="mt-3 w-full" variant="soft" onClick={() => setPhase('work')}>{t('work.skip')}</Button>
        </Card>
      ) : (
        <Card className="mt-4">
          <p className="text-sm text-coach">{t('work.set', { n: serie + 1, total: block.sets })}</p>
          <p className="font-display text-4xl">{block.reps}</p>
          <p className="mt-2 text-sm text-coach">{tr(exercise.cue)}</p>
          <Button className="mt-4 w-full" onClick={completeSet}>{t('work.doneSet')}</Button>
        </Card>
      )}
    </div>
  );
}
