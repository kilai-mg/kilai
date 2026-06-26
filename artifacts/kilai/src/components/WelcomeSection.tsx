import { useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from 'framer-motion';

// ─── Scenes ───────────────────────────────────────────────────────────────────

const SCENES = [
  { label: 'Day 1',     body: 'Seed placed by hand.\nOne tray at a time.' },
  { label: 'Day 2–3',   body: 'Roots reach deep\nbefore the leaves appear.' },
  { label: 'Day 4–5',   body: 'A living carpet of green.\nDense. Alive.' },
  { label: 'Harvest',   body: 'Cut at dawn, at peak nutrition.\nDelivered to your door.' },
] as const;

// Each scene's [fadeIn, hold-start, hold-end, fadeOut] scroll positions
const SCENE_RANGES: number[][] = [
  [0.18, 0.24, 0.33, 0.39],
  [0.37, 0.43, 0.53, 0.59],
  [0.57, 0.63, 0.73, 0.79],
  [0.77, 0.83, 0.92, 0.97],
];

// 5 dots: intro + 4 scenes
const DOT_BREAKS = [0, 0.18, 0.37, 0.57, 0.77] as const;

// ─── Component ────────────────────────────────────────────────────────────────

interface WelcomeSectionProps {
  onNext: () => void;
}

export function WelcomeSection({ onNext }: WelcomeSectionProps) {
  const prefersReduced = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState(0);
  // Unmount brand tagline completely once user scrolls past it — no opacity bleed
  const [showBrand, setShowBrand] = useState(true);

  const { scrollYProgress } = useScroll({ container: scrollRef });

  const skipOpacity = useTransform(scrollYProgress, [0.18, 0.26], [0, 0.38], { clamp: true });

  // Scene opacities — one per scene (hooks rules)
  const sOp0 = useTransform(scrollYProgress, SCENE_RANGES[0], [0, 1, 1, 0]);
  const sOp1 = useTransform(scrollYProgress, SCENE_RANGES[1], [0, 1, 1, 0]);
  const sOp2 = useTransform(scrollYProgress, SCENE_RANGES[2], [0, 1, 1, 0]);
  const sOp3 = useTransform(scrollYProgress, SCENE_RANGES[3], [0, 1, 1, 0]);
  const sceneOpacities = [sOp0, sOp1, sOp2, sOp3];

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    // Unmount brand tagline after 18% scroll — guaranteed zero overlap
    setShowBrand(p < 0.18);
    const dot = DOT_BREAKS.reduce((acc, threshold, i) => (p >= threshold ? i : acc), 0);
    setActiveDot(dot);
  });

  // ── Reduced-motion fallback ──
  if (prefersReduced) {
    return (
      <div
        className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden"
        style={{ background: 'var(--kilai-bg)' }}
      >
        <div className="relative z-10 flex flex-col items-center px-8 text-center" style={{ maxWidth: '380px' }}>
          <div className="flex flex-col items-center" style={{ marginBottom: '28px' }}>
            <div style={{ overflow: 'hidden', lineHeight: 0, width: 'fit-content' }}>
              <img src="/kilai-mark.png" alt="Kilai mark" style={{ width: 'clamp(100px,24vw,130px)', height: 'auto', display: 'block', marginBottom: '-17%' }} />
            </div>
            <div style={{ overflow: 'hidden', lineHeight: 0, width: 'fit-content' }}>
              <img src="/kilai-wordmark.png" alt="kilai" style={{ width: 'clamp(200px,52vw,280px)', height: 'auto', display: 'block', marginTop: '-35%', marginBottom: '-32%' }} />
            </div>
          </div>
          <p style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontWeight: 300, fontSize: 'clamp(1.05rem,3vw,1.22rem)', color: 'rgba(241,236,221,0.82)', lineHeight: 1.8, marginBottom: '36px' }}>
            Food is the first medicine.<br />We grow it like a prayer.
          </p>
          <motion.button
            onClick={onNext}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontWeight: 400, fontStyle: 'italic', fontSize: '1rem', color: 'var(--kilai-cream)', background: 'rgba(255,255,255,0.055)', border: '1px solid rgba(241,236,221,0.22)', borderRadius: '999px', cursor: 'pointer', padding: '11px 28px', display: 'flex', alignItems: 'center', gap: '8px', backdropFilter: 'blur(6px)' }}
          >
            Pick your tray <span>→</span>
          </motion.button>
        </div>
      </div>
    );
  }

  // ── Cinematic scroll experience ──
  return (
    <div
      className="relative w-full h-full overflow-hidden select-none"
      style={{ background: 'var(--kilai-bg)' }}
    >
      {/* Dot texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(168,201,138,0.03) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />


      {/* Skip button */}
      <motion.button
        onClick={onNext}
        style={{
          position: 'absolute', top: 20, left: 20, zIndex: 30,
          opacity: skipOpacity,
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '0.62rem',
          color: 'rgba(241,236,221,0.9)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          letterSpacing: '0.12em',
          padding: '4px 0',
        }}
      >
        skip →
      </motion.button>

      {/* ── Scroll container ── */}
      <div
        ref={scrollRef}
        style={{
          width: '100%',
          height: '100%',
          overflowY: 'auto',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
        } as React.CSSProperties}
      >
        {/* 340vh — 4 scenes with no dead space at end */}
        <div style={{ height: '340vh' }}>

          {/* ── Sticky viewport ── */}
          <div
            style={{
              position: 'sticky',
              top: 0,
              width: '100%',
              height: 'calc(100dvh - 60px)',
              overflow: 'hidden',
            }}
          >

            {/* ── Logo + wordmark — always visible, never fades ── */}
            <div
              style={{
                position: 'absolute',
                top: 'clamp(14px, 3.5%, 28px)',
                left: 0, right: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                pointerEvents: 'none',
                zIndex: 10,
              }}
            >
              <div style={{ overflow: 'hidden', lineHeight: 0, width: 'fit-content' }}>
                <img
                  src="/kilai-mark.png"
                  alt="Kilai mark"
                  style={{
                    width: 'clamp(100px, 24vw, 130px)',
                    height: 'auto',
                    display: 'block',
                    marginBottom: '-17%',
                  }}
                />
              </div>
              <div style={{ overflow: 'hidden', lineHeight: 0, width: 'fit-content' }}>
                <img
                  src="/kilai-wordmark.png"
                  alt="kilai"
                  style={{
                    width: 'clamp(200px, 52vw, 280px)',
                    height: 'auto',
                    display: 'block',
                    marginTop: '-35%',
                    marginBottom: '-32%',
                  }}
                />
              </div>
            </div>

            {/* ── Brand tagline — unmounted (not hidden) once user scrolls ── */}
            {showBrand && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                }}
              >
                <div
                  className="flex flex-col items-center px-8 text-center"
                  style={{ maxWidth: '380px', marginTop: 'clamp(90px, 22%, 130px)' }}
                >
                  <p style={{
                    fontFamily: "'Hanken Grotesk', sans-serif",
                    fontWeight: 300,
                    fontSize: 'clamp(1.05rem, 3vw, 1.22rem)',
                    color: 'rgba(241,236,221,0.82)',
                    lineHeight: 1.8,
                    letterSpacing: '0.015em',
                    marginBottom: '24px',
                  }}>
                    Food is the first medicine.
                    <br />
                    We grow it like a prayer.
                  </p>
                  <p style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '0.68rem',
                    color: 'rgba(168,201,138,0.55)',
                    letterSpacing: '0.14em',
                  }}>
                    scroll to watch it grow ↓
                  </p>
                </div>
              </div>
            )}

            {/* ── Scene texts ── */}
            {SCENES.map((scene, i) => (
              <motion.div
                key={i}
                style={{
                  opacity: sceneOpacities[i],
                  position: 'absolute',
                  top: '54%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  textAlign: 'center',
                  width: '100%',
                  maxWidth: '320px',
                  padding: '0 28px',
                  pointerEvents: 'none',
                }}
              >
                <p style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '0.6rem',
                  color: 'var(--kilai-sprout)',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                  opacity: 0.85,
                }}>
                  {scene.label}
                </p>
                <p style={{
                  fontFamily: "'Marcellus', Georgia, serif",
                  fontSize: 'clamp(1.05rem, 3vw, 1.28rem)',
                  color: 'rgba(241,236,221,0.88)',
                  lineHeight: 1.65,
                  whiteSpace: 'pre-line',
                }}>
                  {scene.body}
                </p>
              </motion.div>
            ))}

            {/* ── CTA — always visible, sits just above progress dots ── */}
            <div
              style={{
                position: 'absolute',
                bottom: '46px',
                left: 0, right: 0,
                display: 'flex',
                justifyContent: 'center',
                zIndex: 20,
                pointerEvents: 'auto',
              }}
            >
              <motion.button
                onClick={onNext}
                animate={{
                  boxShadow: [
                    '0 0 0px 0px rgba(168,201,138,0)',
                    '0 0 14px 3px rgba(168,201,138,0.18)',
                    '0 0 0px 0px rgba(168,201,138,0)',
                  ],
                }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  fontWeight: 400,
                  fontStyle: 'italic',
                  fontSize: '1rem',
                  color: 'var(--kilai-cream)',
                  letterSpacing: '0.04em',
                  background: 'rgba(255,255,255,0.055)',
                  border: '1px solid rgba(241,236,221,0.22)',
                  borderRadius: '999px',
                  cursor: 'pointer',
                  padding: '11px 28px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)',
                }}
              >
                Pick your tray
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                >
                  →
                </motion.span>
              </motion.button>
            </div>

            {/* ── Progress dots ── */}
            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '7px',
                alignItems: 'center',
              }}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: i === activeDot ? '16px' : '5px',
                    height: '5px',
                    borderRadius: '3px',
                    background: i === activeDot ? 'var(--kilai-sprout)' : 'rgba(168,201,138,0.18)',
                    border: i === activeDot ? 'none' : '1px solid rgba(168,201,138,0.2)',
                    transition: 'all 0.4s cubic-bezier(0.22,1,0.36,1)',
                  }}
                />
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
