import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export function Card({ children, className = '', onClick }) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`rounded-[28px] bg-white p-[18px] text-left shadow-card ${onClick ? 'w-full active:scale-[0.99]' : ''} ${className}`}
    >
      {children}
    </Tag>
  );
}

export function Button({ children, onClick, variant = 'primary', className = '', type = 'button', disabled }) {
  const styles = {
    primary: 'bg-magenta text-white shadow-cta',
    teal: 'bg-turquesa text-carbon',
    ghost: 'bg-transparent text-carbon',
    soft: 'bg-rosaPill text-magentaText',
    white: 'bg-white text-carbon shadow-card',
  };
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`flex h-[50px] items-center justify-center gap-2 rounded-full px-5 font-display text-base transition active:scale-[0.98] disabled:opacity-50 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Back({ to }) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      aria-label="Volver"
      onClick={() => (to ? navigate(to) : navigate(-1))}
      className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white shadow-card"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M15 6l-6 6 6 6" stroke="#3A2336" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

export function PageTitle({ kicker, title, action }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div>
        {kicker ? <p className="text-[13px] text-coach">{kicker}</p> : null}
        <h1 className="font-display text-[28px] leading-none text-carbon">{title}</h1>
      </div>
      {action}
    </div>
  );
}

export function Segmented({ options, value, onChange }) {
  return (
    <div className="mb-4 flex gap-1 rounded-full bg-white p-1 shadow-card">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          className={`flex-1 rounded-full px-2 py-2 text-[12px] font-semibold ${value === option.id ? 'bg-magenta text-white' : 'text-coach'}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function DietaTabs() {
  const { pathname } = useLocation();
  const { t } = useApp();
  const tabs = [
    { to: '/dieta', label: t('tab.diet'), end: true, on: pathname === '/dieta' },
    { to: '/dieta/plan', label: t('tab.plan'), on: pathname.startsWith('/dieta/plan') },
    { to: '/dieta/recetas', label: t('tab.recipes'), on: pathname.startsWith('/dieta/recetas') },
    { to: '/dieta/diario', label: t('tab.diary'), on: pathname.startsWith('/dieta/diario') || pathname.startsWith('/dieta/comidas') },
    { to: '/dieta/seca-21-dias', label: t('tab.seca'), on: pathname.startsWith('/dieta/seca-21-dias') },
  ];
  return (
    <div className="sticky top-0 z-20 -mx-5 mb-4 bg-bg/95 px-5 py-2 backdrop-blur">
      <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={`shrink-0 rounded-full px-3.5 py-2 text-[13px] font-semibold ${tab.on ? 'bg-magenta text-white' : 'bg-white text-coach shadow-card'}`}
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export function SegmentBar({ value, max, className = 'bg-magenta' }) {
  const slots = 16;
  const filled = Math.round(Math.min(1, max ? value / max : 0) * slots);
  return (
    <div className="flex gap-[3px]" aria-hidden="true">
      {Array.from({ length: slots }, (_, index) => (
        <span key={index} className={`h-3 flex-1 rounded-sm ${index < filled ? className : 'bg-bgTint'}`} />
      ))}
    </div>
  );
}

const CHIP = {
  c: 'bg-rosaPill text-magentaText',
  p: 'bg-turqCard text-turquesaDark',
  g: 'bg-yellowSoft text-gold',
  f: 'bg-[#FFE8D6] text-[#C56A2D]',
};

export function MacroChips({ carbs = 0, protein = 0, fat = 0, fiber = 0 }) {
  const items = [
    ['c', `C:${Math.round(carbs)}g`],
    ['p', `P:${Math.round(protein)}g`],
    ['g', `G:${Math.round(fat)}g`],
    ['f', `F:${Math.round(fiber)}g`],
  ];
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map(([key, label]) => (
        <span key={key} className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${CHIP[key]}`}>
          {label}
        </span>
      ))}
    </div>
  );
}

export function MacroDonut({ protein, carbs, fat }) {
  const parts = [
    { value: carbs * 4, color: '#E5198D' },
    { value: protein * 4, color: '#2FCFBE' },
    { value: fat * 9, color: '#FBD24E' },
  ];
  const total = parts.reduce((sum, part) => sum + part.value, 0);
  const r = 36;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg viewBox="0 0 100 100" className="h-[92px] w-[92px]">
      <circle cx="50" cy="50" r={r} fill="none" stroke="#FBE7F0" strokeWidth="12" />
      {total > 0
        ? parts.map((part) => {
            const len = (part.value / total) * circ;
            const dash = `${len} ${circ - len}`;
            const el = (
              <circle
                key={part.color}
                cx="50"
                cy="50"
                r={r}
                fill="none"
                stroke={part.color}
                strokeWidth="12"
                strokeDasharray={dash}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
                transform="rotate(-90 50 50)"
              />
            );
            offset += len;
            return el;
          })
        : null}
      <circle cx="50" cy="50" r="24" fill="white" />
    </svg>
  );
}

export function WeightChart({ points, goal }) {
  if (!points.length) return <p className="text-sm text-coach">Cuando registres tu peso, la línea aparece aquí.</p>;
  const values = points.map((point) => point.kg);
  const min = Math.min(...values, goal) - 1;
  const max = Math.max(...values, goal) + 1;
  const w = 320;
  const h = 150;
  const pad = 16;
  const coords = points.map((point, index) => {
    const x = pad + (points.length === 1 ? (w - pad * 2) / 2 : (index / (points.length - 1)) * (w - pad * 2));
    const y = pad + (1 - (point.kg - min) / (max - min || 1)) * (h - pad * 2);
    return { ...point, x, y };
  });
  const d = coords.map((point, index) => `${index ? 'L' : 'M'}${point.x},${point.y}`).join(' ');
  const gy = pad + (1 - (goal - min) / (max - min || 1)) * (h - pad * 2);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
      <line x1={pad} x2={w - pad} y1={gy} y2={gy} stroke="#FBD24E" strokeDasharray="4 4" />
      <path d={d} fill="none" stroke="#E5198D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {coords.map((point) => (
        <circle key={point.date} cx={point.x} cy={point.y} r="4.5" fill="#E5198D" />
      ))}
    </svg>
  );
}

export function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-coach">{label}</span>
      <input
        {...props}
        className="h-12 w-full rounded-2xl bg-white px-4 text-carbon shadow-card outline-none ring-magenta/30 focus:ring-2"
      />
    </label>
  );
}

export function Arrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
