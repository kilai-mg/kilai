import { useState, useRef, useCallback, useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, LogIn, LogOut } from 'lucide-react';
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
import { SignIn } from './SignIn';
import { AdminDashboard } from './AdminDashboard';
import { Tray, AuthUser, useLogout, useGetMe, getGetMeQueryKey } from '@workspace/api-client-react';
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
  const [showSignIn, setShowSignIn] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  const queryClient = useQueryClient();
  const { mutateAsync: logoutMutation } = useLogout();

  // Try restoring session on mount
  const { data: meData } = useGetMe({
    query: {
      queryKey: getGetMeQueryKey(),
      retry: false,
    },
  });

  useEffect(() => {
    if (meData && !user) {
      setUser(meData);
    }
  }, [meData]);

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

  const handleSignInSuccess = (loggedInUser: AuthUser) => {
    setUser(loggedInUser);
    setShowSignIn(false);
    if (loggedInUser.isAdmin) setShowAdmin(true);
  };

  const handleLogout = async () => {
    try {
      await logoutMutation();
    } catch {}
    setUser(null);
    setShowAdmin(false);
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

  // suppress unused warning — handleSelectTray is wired via TrayGrid internals
  void handleSelectTray;

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
      {/* ─── Auth / Admin header controls ─── */}
      <div style={{ position: 'absolute', top: 14, left: 14, zIndex: 40, display: 'flex', gap: '8px' }}>
        {user ? (
          <>
            {user.isAdmin && (
              <button
                onClick={() => setShowAdmin(true)}
                style={{
                  background: 'rgba(168,201,138,0.12)',
                  border: '1px solid rgba(168,201,138,0.22)',
                  borderRadius: '8px',
                  color: 'var(--kilai-sprout)',
                  cursor: 'pointer',
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '0.55rem',
                  padding: '5px 10px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                Admin
              </button>
            )}
            <button
              onClick={handleLogout}
              title="Sign out"
              style={{
                background: 'rgba(168,201,138,0.06)',
                border: '1px solid rgba(168,201,138,0.12)',
                borderRadius: '8px',
                color: 'rgba(241,236,221,0.4)',
                cursor: 'pointer',
                padding: '5px 8px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <LogOut size={13} strokeWidth={1.5} />
            </button>
          </>
        ) : (
          <button
            onClick={() => setShowSignIn(true)}
            style={{
              background: 'rgba(168,201,138,0.08)',
              border: '1px solid rgba(168,201,138,0.18)',
              borderRadius: '8px',
              color: 'rgba(168,201,138,0.7)',
              cursor: 'pointer',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '0.55rem',
              padding: '5px 10px',
              letterSpacing: '0.12em',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <LogIn size={12} strokeWidth={1.5} />
            Sign in
          </button>
        )}
      </div>

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

        {/* Desktop arrow navigation — ritual flow only, upgraded pill buttons */}
        {isRitual && ritualSection !== 2 && (
          <>
            {prevSection !== null && (
              <button
                onClick={() => navigateRitual(prevSection, -1)}
                data-testid="button-nav-prev"
                className="hidden md:flex fixed left-3 top-1/2 -translate-y-1/2 z-50 items-center justify-center"
                style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: 'rgba(8,15,10,0.7)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(168,201,138,0.14)',
                  cursor: 'pointer',
                  color: 'rgba(241,236,221,0.45)',
                  transition: 'color 0.2s, border-color 0.2s, background 0.2s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.color = 'rgba(241,236,221,0.9)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(168,201,138,0.35)';
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(8,15,10,0.88)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.color = 'rgba(241,236,221,0.45)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(168,201,138,0.14)';
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(8,15,10,0.7)';
                }}
              >
                <ChevronLeft size={18} />
              </button>
            )}
            {nextSection !== null && (
              <button
                onClick={() => navigateRitual(nextSection, 1)}
                data-testid="button-nav-next"
                className="hidden md:flex fixed right-3 top-1/2 -translate-y-1/2 z-50 items-center justify-center"
                style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: 'rgba(8,15,10,0.7)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(168,201,138,0.14)',
                  cursor: 'pointer',
                  color: 'rgba(241,236,221,0.45)',
                  transition: 'color 0.2s, border-color 0.2s, background 0.2s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.color = 'rgba(241,236,221,0.9)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(168,201,138,0.35)';
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(8,15,10,0.88)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.color = 'rgba(241,236,221,0.45)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(168,201,138,0.14)';
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(8,15,10,0.7)';
                }}
              >
                <ChevronRight size={18} />
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

      {/* ─── Sign In overlay ─── */}
      <AnimatePresence>
        {showSignIn && (
          <SignIn
            onSuccess={handleSignInSuccess}
            onClose={() => setShowSignIn(false)}
          />
        )}
      </AnimatePresence>

      {/* ─── Admin Dashboard overlay ─── */}
      <AnimatePresence>
        {showAdmin && (
          <AdminDashboard onClose={() => setShowAdmin(false)} />
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
