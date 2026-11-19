import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Maximize2, Menu, Minimize2, Settings2, X } from 'lucide-react';
import { ROUTES } from '@/app/routes';
import { PRODUCT_NAME } from '@/lib/constants';
import { useFullscreen } from '@/hooks/useFullscreen';
import { Button } from '@/components/ui/Button';
import { SettingsPanel } from './SettingsPanel';

const links = [
  { to: ROUTES.explore, label: 'Explore' },
  { to: ROUTES.solarSystem, label: 'Solar System' },
  { to: ROUTES.blackHole, label: 'Black Hole' },
  { to: ROUTES.galaxy, label: 'Galaxy' },
  { to: ROUTES.orbitLab, label: 'Orbit Lab' },
];

function Brand({ onClick }: { onClick?: () => void }) {
  return (
    <Link to={ROUTES.home} onClick={onClick} className="flex items-center gap-3" aria-label="ECLIPSE home">
      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-electric/50 shadow-[0_0_18px_-4px_rgba(82,153,255,0.8)]">
        <span className="h-2 w-2 rounded-full bg-cyan" />
      </span>
      <span className="text-xs font-medium tracking-[0.35em] text-ink">{PRODUCT_NAME}</span>
    </Link>
  );
}

export function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const location = useLocation();
  const { isFullscreen, supported, toggle } = useFullscreen();

  return (
    <>
      <header className="sticky top-0 z-30 h-16 border-b border-white/8 bg-void/80 backdrop-blur-xl">
        <nav className="mx-auto flex h-full max-w-[1600px] items-center justify-between gap-6 px-5 sm:px-8" aria-label="Primary navigation">
          <Brand />
          <div className="hidden items-center gap-1 lg:flex">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-[11px] tracking-wide transition-colors ${
                    isActive ? 'bg-white/6 text-cyan' : 'text-muted hover:text-ink'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            {supported && (
              <Button
                variant="ghost"
                size="sm"
                icon={isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                onClick={toggle}
              />
            )}
            <Button
              variant="ghost"
              size="sm"
              icon={<Settings2 size={15} />}
              aria-label="Open settings"
              onClick={() => setSettingsOpen(true)}
            />
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              icon={menuOpen ? <X size={17} /> : <Menu size={17} />}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            />
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-20 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-void/95 pt-16" onClick={() => setMenuOpen(false)} />
            <motion.nav
              aria-label="Mobile navigation"
              className="relative flex flex-col gap-1 px-5 pt-6"
              initial={{ y: -12 }}
              animate={{ y: 0 }}
            >
              {links.map((link, index) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center justify-between border-b border-white/8 py-4 text-lg transition-colors ${
                    location.pathname === link.to ? 'text-cyan' : 'text-ink'
                  }`}
                >
                  <span>
                    <span className="ecl-label mr-4">0{index + 1}</span>
                    {link.label}
                  </span>
                </NavLink>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
