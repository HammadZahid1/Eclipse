import { Route, Routes } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { ROUTES } from './routes';
import HomePage from '@/pages/HomePage';
import ExplorePage from '@/pages/ExplorePage';
import SolarSystemPage from '@/pages/SolarSystemPage';
import BlackHolePage from '@/pages/BlackHolePage';
import GalaxyPage from '@/pages/GalaxyPage';
import OrbitLabPage from '@/pages/OrbitLabPage';
import AboutPage from '@/pages/AboutPage';

export function AppRouter() {
  return (
    <AppShell>
      <Routes>
        <Route path={ROUTES.home} element={<HomePage />} />
        <Route path={ROUTES.explore} element={<ExplorePage />} />
        <Route path={ROUTES.solarSystem} element={<SolarSystemPage />} />
        <Route path={ROUTES.blackHole} element={<BlackHolePage />} />
        <Route path={ROUTES.galaxy} element={<GalaxyPage />} />
        <Route path={ROUTES.orbitLab} element={<OrbitLabPage />} />
        <Route path={ROUTES.about} element={<AboutPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </AppShell>
  );
}
