import { useApp } from '../context/AppContext';

const OPTIONS = [
  ['pt', 'PT'],
  ['en', 'EN'],
  ['es', 'ES'],
];

export default function LanguageSwitch() {
  const { language, setLanguage } = useApp();
  return (
    <div className="inline-flex rounded-full bg-white p-1 shadow-card" role="group" aria-label="Idioma">
      {OPTIONS.map(([id, label]) => (
        <button
          key={id}
          type="button"
          onClick={() => setLanguage(id)}
          className={`rounded-full px-3 py-1 text-xs font-semibold ${language === id ? 'bg-magenta text-white' : 'text-coach'}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
