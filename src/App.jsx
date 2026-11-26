import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Shell from './components/Shell';
import { useApp } from './context/AppContext';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Track from './pages/Track';
import Workout from './pages/Workout';
import Resumen from './pages/Resumen';
import Macros from './pages/Macros';
import Comidas from './pages/Comidas';
import Calendario from './pages/Calendario';
import Plan from './pages/Plan';
import Recetas from './pages/Recetas';
import Compras from './pages/Compras';
import Peso from './pages/Peso';
import Seca from './pages/Seca';
import Escanear from './pages/Escanear';
import Progreso from './pages/Progreso';
import Perfil from './pages/Perfil';

export default function App() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route path="/" element={<Gate><Onboarding /></Gate>} />
        <Route path="/inicio" element={<Gate><Home /></Gate>} />
        <Route path="/entrenos" element={<Gate><Track category="gluteos" /></Gate>} />
        <Route path="/pernas" element={<Gate><Track category="piernas" /></Gate>} />
        <Route path="/abdomen" element={<Gate><Track category="abdomen" /></Gate>} />
        <Route path="/entreno/:id" element={<Gate><Workout /></Gate>} />
        <Route path="/dieta" element={<Gate><Resumen /></Gate>} />
        <Route path="/dieta/macros" element={<Gate><Macros /></Gate>} />
        <Route path="/dieta/diario" element={<Gate><Comidas /></Gate>} />
        <Route path="/dieta/comidas" element={<Gate><Comidas /></Gate>} />
        <Route path="/dieta/calendario" element={<Gate><Calendario /></Gate>} />
        <Route path="/dieta/plan" element={<Gate><Plan /></Gate>} />
        <Route path="/dieta/recetas" element={<Gate><Recetas /></Gate>} />
        <Route path="/dieta/recetas/:id" element={<Gate><Recetas /></Gate>} />
        <Route path="/dieta/compras" element={<Gate><Compras /></Gate>} />
        <Route path="/dieta/peso" element={<Gate><Peso /></Gate>} />
        <Route path="/dieta/seca-21-dias" element={<Gate><Seca /></Gate>} />
        <Route path="/dieta/escanear" element={<Gate><Escanear /></Gate>} />
        <Route path="/progreso" element={<Gate><Progreso /></Gate>} />
        <Route path="/perfil" element={<Gate><Perfil /></Gate>} />
        <Route path="*" element={<Gate><Home /></Gate>} />
      </Route>
    </Routes>
  );
}

function Gate({ children }) {
  const { onboarded } = useApp();
  const location = useLocation();
  if (!onboarded && location.pathname !== '/') return <Navigate to="/" replace />;
  if (onboarded && location.pathname === '/') return <Navigate to="/inicio" replace />;
  return children;
}
