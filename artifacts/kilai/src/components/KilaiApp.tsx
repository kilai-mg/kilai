import { useState, useRef, useCallback } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { WelcomeSection } from './WelcomeSection';
import { TrayGrid } from './TrayGrid';
import { TrayViewer } from './TrayViewer';
import { WhatHappensNext } from './WhatHappensNext';
import { TheVow } from './TheVow';
import { FooterSection } from './FooterSection';
import { AboutUs } from './AboutUs';
import { BulkOrder } from './BulkOrder';
import { Blogs } from './Blogs';
import { KidsSection } from './KidsSection';
import { BottomNav, SectionId } from './BottomNav';
import { AdoptionFlow } from './AdoptionFlow';
import { TrayDetailSheet } from './TrayDetailSheet';
import { Tray } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { getListTraysQueryKey } from '@workspace/api-client-react';

// ─── Ritual section indices (swipe flow) ───
// 0 = Welcome
// 1 = Tray Grid
// 2 = Tray Viewer (entered only via tray card tap)
// 3 = What Happens Next
// 4 = The Vow
// 5 = Footer

const RITUAL_SWIPE_SECTIONS = [0, 1, 3, 4, 5]; // navigable via swipe/arrows

function prevRitual(section: number): number | null {
  const cur = section === 2 ? 1 : section;
  const idx = RITUAL_SWIPE_SECTIONS.indexOf(cur);
  if (idx <= 0) return null;
  return RITUAL_SWIPE_SECTIONS[idx - 1];
}

function nextRitual(section: number): number | null {
  const cur = section === 2 ? 1 : section;
  const idx = RITUAL_SWIPE_SECTIONS.indexOf(cur);
  if (idx < 0 || idx >= RITUAL_SWIPE_SECTIONS.length - 1) return null;
  return RITUAL_SWIPE_SECTIONS[idx + 1];
}

type Direction = 1 | -1;

export function KilaiApp() {
  // Which tab is active in the bottom nav
  const [activeTab, setActiveTab] = useState<SectionId>('ritual');

  // Within the ritual tab — which section (0–5)
  const [ritualSection, setRitualSection] = useState(0);
  const [direction, setDirection] = useState<Direction>(1);
  const [selectedTray, setSelectedTray] = useState<Tray | null>(null);
  const [adoptionVariety, setAdoptionVariety] = useState<string | null>(null);
  const [detailTray, setDetailTray] = useState<Tray | null>(null);
  const queryClient = useQueryClient();

  const prefersReduced = useReducedMotion();
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Navigate within ritual flow
  const navigateRitual = useCallback((target: number, dir?: Direction) => {
    setDirection(dir ?? (target > ritualSection ? 1 : -1));
    setRitualSection(target);
  }, [ritualSection]);

  const handleSelectTray = (tray: Tray) => {
    setSelectedTray(tray);
    navigateRitual(2, 1);
  };

  const handleAdoptTray = (tray: Tray) => setAdoptionVariety(tray.variety);
  const handleOpenAdoption = (variety: string) => setAdoptionVariety(variety);

  const handleAdoptionClose = () => {
    setAdoptionVariety(null);
    queryClient.invalidateQueries({ queryKey: getListTraysQueryKey() });
  };

  const handleViewAdoptedTray = (tray: Tray) => {
    setDetailTray(tray);
  };

  // Swipe for ritual sections only
  const handleTouchStart = (e: React.TouchEvent) => {
    if (activeTab !== 'ritual' || ritualSection === 2) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (activeTab !== 'ritual' || ritualSection === 2) return;
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    touchStartX.current = null;
    touchStartY.current = null;
    if (Math.abs(dx) < 50 || Math.abs(dy) > Math.abs(dx)) return;
    if (dx < 0) { const n = nextRitual(ritualSection); if (n !== null) navigateRitual(n, 1); }
    else         { const p = prevRitual(ritualSection); if (p !== null) navigateRitual(p, -1); }
  };

  // Motion variants — ritual sections slide; secondary sections fade
  const ritualVariants = prefersReduced
    ? { enter: { opacity: 0 }, center: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        enter:  (d: Direction) => ({ x: d * 60, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit:   (d: Direction) => ({ x: d * -60, opacity: 0 }),
      };

  const fadeVariants = {
    enter:  { opacity: 0 },
    center: { opacity: 1 },
    exit:   { opacity: 0 },
  };

  const ritualTransition  = prefersReduced ? { duration: 0.25 } : { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };
  const fadeTransition    = { duration: 0.3, ease: 'easeInOut' as const };

  const prevSection = prevRitual(ritualSection);
  const nextSection = nextRitual(ritualSection);
  const isRitual    = activeTab === 'ritual';

  return (
    <div
      className="relative w-screen overflow-hidden"
      style={{
        background: 'var(--kilai-bg)',
        height: '100dvh',
        touchAction: (isRitual && ritualSection === 2) ? 'none' : 'pan-y',
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ─── Main content area (above bottom nav) ─── */}
      <div className="absolute inset-0" style={{ bottom: '60px' }}>
        <AnimatePresence mode="wait" custom={direction}>

          {/* ── RITUAL FLOW ── */}
          {isRitual && (
            <motion.div
              key={`ritual-${ritualSection}`}
              custom={direction}
              variants={ritualVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={ritualTransition}
              className="absolute inset-0 w-full h-full"
            >
              {ritualSection === 0 && <WelcomeSection onNext={() => navigateRitual(1, 1)} />}
              {ritualSection === 1 && <TrayGrid onAdoptTray={handleAdoptTray} onViewAdoptedTray={handleViewAdoptedTray} />}
              {ritualSection === 2 && selectedTray && (
                <TrayViewer tray={selectedTray} onBack={() => navigateRitual(1, -1)} />
              )}
              {ritualSection === 3 && <WhatHappensNext />}
              {ritualSection === 4 && <TheVow />}
              {ritualSection === 5 && (
                <FooterSection onNavigate={(s) => navigateRitual(s)} />
              )}
            </motion.div>
          )}

          {/* ── ABOUT ── */}
          {activeTab === 'about' && (
            <motion.div key="about" variants={fadeVariants} initial="enter" animate="center" exit="exit"
              transition={fadeTransition} className="absolute inset-0 w-full h-full">
              <AboutUs />
            </motion.div>
          )}

          {/* ── BULK ── */}
          {activeTab === 'bulk' && (
            <motion.div key="bulk" variants={fadeVariants} initial="enter" animate="center" exit="exit"
              transition={fadeTransition} className="absolute inset-0 w-full h-full">
              <BulkOrder />
            </motion.div>
          )}

          {/* ── BLOGS ── */}
          {activeTab === 'blogs' && (
            <motion.div key="blogs" variants={fadeVariants} initial="enter" animate="center" exit="exit"
              transition={fadeTransition} className="absolute inset-0 w-full h-full">
              <Blogs />
            </motion.div>
          )}

          {/* ── KIDS ── */}
          {activeTab === 'kids' && (
            <motion.div key="kids" variants={fadeVariants} initial="enter" animate="center" exit="exit"
              transition={fadeTransition} className="absolute inset-0 w-full h-full">
              <KidsSection onOpenAdoption={handleOpenAdoption} />
            </motion.div>
          )}

        </AnimatePresence>

        {/* Desktop arrow navigation — ritual flow only */}
        {isRitual && ritualSection !== 2 && (
          <>
            {prevSection !== null && (
              <button
                onClick={() => navigateRitual(prevSection, -1)}
                data-testid="button-nav-prev"
                className="hidden md:flex fixed left-4 top-1/2 -translate-y-1/2 z-50 items-center justify-center"
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: 'rgba(241,236,221,0.3)', transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(241,236,221,0.75)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(241,236,221,0.3)')}
              >
                <ChevronLeft size={22} />
              </button>
            )}
            {nextSection !== null && (
              <button
                onClick={() => navigateRitual(nextSection, 1)}
                data-testid="button-nav-next"
                className="hidden md:flex fixed right-4 top-1/2 -translate-y-1/2 z-50 items-center justify-center"
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: 'rgba(241,236,221,0.3)', transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(241,236,221,0.75)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(241,236,221,0.3)')}
              >
                <ChevronRight size={22} />
              </button>
            )}
          </>
        )}
      </div>

      {/* ─── Adoption flow overlay ─── */}
      <AnimatePresence>
        {adoptionVariety !== null && (
          <AdoptionFlow
            preselectedVariety={adoptionVariety}
            onClose={handleAdoptionClose}
          />
        )}
      </AnimatePresence>

      {/* ─── Adopted tray detail overlay ─── */}
      <AnimatePresence>
        {detailTray && (
          <TrayDetailSheet
            tray={detailTray}
            onClose={() => setDetailTray(null)}
          />
        )}
      </AnimatePresence>

      {/* ─── Bottom navigation bar ─── */}
      <BottomNav
        active={activeTab}
        onChange={(id) => {
          setActiveTab(id);
          // When returning to ritual, restore from wherever they were
        }}
      />
    </div>
  );
}
