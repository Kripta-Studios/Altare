import { Routes, Route, HashRouter } from 'react-router-dom';
import { Shell } from './components/layout/Shell';
import Today from './pages/Today';
import Mass from './pages/Mass';
import Prayers from './pages/Prayers';
import Rosary from './pages/Rosary';
import Settings from './pages/Settings';
import Meditations from './pages/Meditations';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Shell />}>
          <Route path="/" element={<Today />} />
          <Route path="/mass" element={<Mass />} />
          <Route path="/prayers" element={<Prayers />} />
          <Route path="/rosary" element={<Rosary />} />
          <Route path="/meditations" element={<Meditations />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
