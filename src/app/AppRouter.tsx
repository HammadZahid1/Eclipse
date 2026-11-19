import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { PageLoader } from '@/components/layout/PageLoader';
import { ROUTES } from './routes';

const HomePage = lazy(() => import('@/pages/HomePage'));
const ExplorePage = lazy(() => import('@/pages/ExplorePage'));
const SolarSystemPage = lazy(() => import('@/pages/SolarSystemPage'));
const BlackHolePage = lazy(() => import('@/pages/BlackHolePage'));
const GalaxyPage = lazy(() => import('@/pages/GalaxyPage'));
const OrbitLabPage = lazy(() => import('@/pages/OrbitLabPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));

export function AppRouter() {
  return (
    <AppShell>
      <Suspense fallback={<PageLoader />}>
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
      </Suspense>
    </AppShell>
  );
}
