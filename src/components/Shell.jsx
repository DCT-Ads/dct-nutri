import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { findWorkout } from '../data/workouts';
import { useApp } from '../context/AppContext';

const TABS = [
  { to: '/inicio', key: 'nav.today', icon: 'home', end: true },
  { to: '/entrenos', key: 'nav.train', icon: 'train' },
  { to: '/dieta', key: 'nav.diet', icon: 'diet' },
  { to: '/pernas', key: 'nav.legs', icon: 'legs' },
  { to: '/abdomen', key: 'nav.abs', icon: 'abs' },
  { to: '/progreso', key: 'nav.progress', icon: 'chart' },
  { to: '/perfil', key: 'nav.profile', icon: 'user' },
];

function Icon({ name, active }) {
  const stroke = active ? '#E5198D' : '#9B8A95';
  const common = { fill: 'none', stroke, strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (name === 'home') {
    return <svg width="22" height="22" viewBox="0 0 24 24"><path {...common} d="M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-8.5z" /></svg>;
  }
  if (name === 'train') {
    return <svg width="22" height="22" viewBox="0 0 24 24"><path {...common} d="M7 7h10M8 7v10M16 7v10M6 12h12" /></svg>;
  }
  if (name === 'diet') {
    return <svg width="22" height="22" viewBox="0 0 24 24"><path {...common} d="M12 21s-7-4.4-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.6-7 10-7 10z" /></svg>;
  }
  if (name === 'legs') {
    return <svg width="22" height="22" viewBox="0 0 24 24"><path {...common} d="M9 3v8l-2 10M15 3v8l2 10" /></svg>;
  }
  if (name === 'abs') {
    return <svg width="22" height="22" viewBox="0 0 24 24"><path {...common} d="M12 3c2 3 2 5 0 8-2-3-2-5 0-8zM8 14h8M9 18h6" /></svg>;
  }
  if (name === 'chart') {
    return <svg width="22" height="22" viewBox="0 0 24 24"><path {...common} d="M4 19h16M7 16v-4M12 16V7M17 16v-6" /></svg>;
  }
  return <svg width="22" height="22" viewBox="0 0 24 24"><path {...common} d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zM5 20a7 7 0 0 1 14 0" /></svg>;
}

function Sheet({ title, children, onClose, closeLabel }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-center">
      <button type="button" className="absolute inset-0 bg-carbon/40" aria-label={closeLabel} onClick={onClose} />
      <div className="relative mt-auto w-full max-w-[430px] rounded-t-[28px] bg-white px-5 pb-8 pt-5 shadow-card">
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-bgTint" />
        <h2 className="mb-4 font-display text-2xl text-carbon">{title}</h2>
        {children}
      </div>
    </div>
  );
}

export default function Shell() {
  const { onboarded, sheet, setSheet, addWater, installEvent, t } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const workout = location.pathname.startsWith('/entreno/')
    ? findWorkout(location.pathname.split('/')[2])
    : null;
  const playing = new URLSearchParams(location.search).get('play') === '1';
  const showNav = onboarded && location.pathname !== '/' && !playing;
  const showFab = showNav && !location.pathname.startsWith('/dieta/escanear');

  function activeTab(tab) {
    if (workout) {
      if (tab.to === '/entrenos') return workout.category === 'gluteos';
      if (tab.to === '/pernas') return workout.category === 'piernas';
      if (tab.to === '/abdomen') return workout.category === 'abdomen';
      return false;
    }
    if (tab.end) return location.pathname === tab.to;
    return location.pathname === tab.to || location.pathname.startsWith(`${tab.to}/`);
  }

  return (
    <div className="flex h-dvh justify-center bg-[#EDE7EA]">
      <div className="relative h-dvh w-full max-w-[430px] overflow-hidden bg-bg shadow-[0_0_0_1px_rgba(58,35,54,0.05)]">
        <div className="no-scrollbar h-full overflow-y-auto">
          <div className={showNav ? 'px-5 pb-28 pt-4' : 'min-h-full'}>
            <Outlet />
          </div>
        </div>
        {showFab ? (
          <button
            type="button"
            aria-label="Agregar comida"
            onClick={() => setSheet('add')}
            className="absolute bottom-[84px] right-4 z-30 grid h-14 w-14 place-items-center rounded-full bg-magenta text-white shadow-cta"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.6" strokeLinecap="round" />
            </svg>
          </button>
        ) : null}
        {showNav ? (
          <nav className="absolute inset-x-0 bottom-0 z-20 border-t border-black/5 bg-white/95 backdrop-blur">
            <div className="grid grid-cols-7 px-0.5 pb-[max(6px,env(safe-area-inset-bottom))] pt-1">
              {TABS.map((tab) => {
                const on = activeTab(tab);
                return (
                  <NavLink key={tab.to} to={tab.to} className="flex min-w-0 flex-col items-center gap-0.5 py-1.5">
                    <span className={`grid h-7 w-9 place-items-center rounded-full ${on ? 'bg-rosaPill' : ''}`}>
                      <Icon name={tab.icon} active={on} />
                    </span>
                    <span className={`max-w-full truncate text-[9px] font-medium ${on ? 'text-magenta' : 'text-gris'}`}>{t(tab.key)}</span>
                  </NavLink>
                );
              })}
            </div>
          </nav>
        ) : null}
        {sheet === 'add' ? (
          <Sheet title={t('sheet.add')} closeLabel={t('close')} onClose={() => setSheet(null)}>
            <div className="grid gap-2">
              <button type="button" className="rounded-2xl bg-rosaPill px-4 py-4 text-left font-semibold text-magentaText" onClick={() => { setSheet(null); navigate('/dieta/escanear'); }}>{t('sheet.scan')}</button>
              <button type="button" className="rounded-2xl bg-bg px-4 py-4 text-left font-semibold" onClick={() => { setSheet(null); navigate('/dieta/diario?buscar=1'); }}>{t('sheet.search')}</button>
              <button type="button" className="rounded-2xl bg-turqCard px-4 py-4 text-left font-semibold text-turquesaDark" onClick={() => setSheet('water')}>{t('sheet.water')}</button>
            </div>
          </Sheet>
        ) : null}
        {sheet === 'water' ? (
          <Sheet title={t('sheet.waterAsk')} closeLabel={t('close')} onClose={() => setSheet(null)}>
            <div className="grid grid-cols-2 gap-2">
              {[200, 250, 350, 500].map((amount) => (
                <button key={amount} type="button" className="rounded-2xl bg-turqCard py-4 font-display text-lg text-turquesaDark" onClick={() => { addWater(amount); setSheet(null); }}>
                  {amount} ml
                </button>
              ))}
            </div>
          </Sheet>
        ) : null}
        {sheet === 'bell' ? (
          <Sheet title={t('sheet.bellTitle')} closeLabel={t('close')} onClose={() => setSheet(null)}>
            <p className="text-sm leading-6 text-coach">{t('sheet.bellBody')}</p>
            {installEvent ? <p className="mt-3 text-sm text-magentaText">{t('sheet.bellInstall')}</p> : null}
          </Sheet>
        ) : null}
      </div>
    </div>
  );
}
