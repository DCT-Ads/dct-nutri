import { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

const POSE_PHOTO = {
  squat: 'squat',
  lunge: 'lunge',
  bridge: 'bridge',
  calf: 'calf',
  hinge: 'hinge',
  kick: 'kick',
  step: 'step',
  clam: 'clam',
  crunch: 'crunch',
  touch: 'touch',
  oblique: 'oblique',
  legraise: 'legraise',
  reverse: 'reverse',
  bicycle: 'bicycle',
  plank: 'plank',
  sideplank: 'sideplank',
  deadbug: 'deadbug',
  bird: 'bird',
  russian: 'russian',
  hollow: 'hollow',
  mountain: 'mountain',
};

const POSE_VIDEO = {
  hinge: true,
  squat: true,
  lunge: true,
  bridge: true,
  calf: true,
  crunch: true,
  touch: true,
  plank: true,
  bird: true,
  oblique: true,
  legraise: true,
  reverse: true,
  bicycle: true,
  sideplank: true,
  deadbug: true,
  russian: true,
  hollow: true,
  mountain: true,
  kick: true,
  step: true,
  clam: true,
};

export function MoveArt({ pose = 'squat' }) {
  const { tr } = useApp();
  const shot = POSE_PHOTO[pose] || 'squat';
  const videoRef = useRef(null);

  useEffect(() => {
    const clip = videoRef.current;
    if (!clip) return undefined;
    clip.currentTime = 0;
    const play = clip.play();
    if (play) play.catch(() => {});
    return undefined;
  }, [shot]);

  return (
    <div className="relative h-72 overflow-hidden rounded-[24px] bg-[#F7C9DC]">
      {POSE_VIDEO[shot] ? (
        <video
          key={shot}
          ref={videoRef}
          src={`/demos/${shot}.mp4?v=glute`}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-contain p-2"
        />
      ) : (
        <>
          <img
            src={`/demos/${shot}-b.jpg?v=lift`}
            alt=""
            className="absolute inset-0 box-border h-full w-full object-contain p-2"
          />
          <img
            src={`/demos/${shot}.jpg?v=lift`}
            alt=""
            className="demo-action absolute inset-0 box-border h-full w-full object-contain p-2"
          />
        </>
      )}
      <span className="absolute bottom-2 left-3 rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-semibold text-magentaText">
        {tr('Guía visual')}
      </span>
    </div>
  );
}

export function HeroArt() {
  return (
    <svg viewBox="0 0 160 180" className="h-full w-full" aria-hidden="true">
      <ellipse cx="88" cy="168" rx="40" ry="8" fill="#F3B6D0" />
      <path d="M78 78c8 28 6 48 2 62" stroke="#E5198D" strokeWidth="10" strokeLinecap="round" />
      <path d="M80 112c18 8 28 28 24 48" stroke="#C41279" strokeWidth="9" strokeLinecap="round" />
      <path d="M80 116c-16 10-18 30-8 46" stroke="#C41279" strokeWidth="9" strokeLinecap="round" />
      <path d="M74 86c-22 8-26 4-24-8" stroke="#E5198D" strokeWidth="7" strokeLinecap="round" />
      <circle cx="86" cy="58" r="16" fill="#3A2336" />
      <path d="M74 52c6-18 28-20 34-4 6 8 2 16-6 16" fill="#3A2336" />
      <circle cx="90" cy="60" r="11" fill="#F6C7B0" />
      <path d="M70 92c10-8 22-8 34 2 8 16-2 28-16 24-12-2-20-12-18-26z" fill="#F48CB9" />
      <path d="M78 118c8 6 20 6 28-2 4 16-2 26-14 26s-18-8-14-24z" fill="#E5198D" />
    </svg>
  );
}

export function BowlArt() {
  return (
    <svg viewBox="0 0 120 90" className="h-20 w-24" aria-hidden="true">
      <ellipse cx="60" cy="58" rx="40" ry="16" fill="#9FE3D8" />
      <path d="M24 50c4 22 68 22 72 0" fill="#2FCFBE" />
      <circle cx="48" cy="40" r="10" fill="#F4C76A" />
      <circle cx="66" cy="36" r="8" fill="#E5198D" />
      <path d="M58 28c8-12 22-8 18 2" fill="#3CB371" />
      <path d="M42 30c-2-12 14-14 12 0" fill="#67C587" />
    </svg>
  );
}
