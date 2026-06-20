import { useRef, useEffect, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from 'framer-motion';
import { RainToggle } from './RainToggle';

// ─── Canvas setup ──────────────────────────────────────────────────────────────

const CW = 420;
const CH = 258;

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Precomputed stem layout — fixed seed so frames are deterministic
const _rng = mulberry32(8301);
const STEMS = Array.from({ length: 55 }, () => ({
  theta: _rng() * Math.PI * 2,
  rFrac: _rng() * 0.85 + 0.08,
  lean: (_rng() - 0.5) * 16,
  hv: 0.45 + _rng() * 1.1,
  leaf: _rng() > 0.36,
}));

function drawGrowth(canvas: HTMLCanvasElement, progress: number) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const cx = CW / 2;
  const cy = CH / 2 + 20;
  const rx = 178;
  const ry = 35;

  ctx.clearRect(0, 0, CW, CH);

  // Tray shadow
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.55)';
  ctx.shadowBlur = 32;
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  ctx.beginPath();
  ctx.ellipse(cx, cy + ry + 18, rx * 0.86, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Tray body
  ctx.fillStyle = '#0f1c0d';
  ctx.beginPath();
  ctx.moveTo(cx - rx, cy - 8);
  ctx.lineTo(cx - rx, cy + 44);
  ctx.ellipse(cx, cy + 44, rx, ry * 0.68, 0, Math.PI, Math.PI * 2);
  ctx.lineTo(cx + rx, cy - 8);
  ctx.closePath();
  ctx.fill();

  // Rim
  ctx.fillStyle = '#162011';
  ctx.beginPath();
  ctx.ellipse(cx, cy - 8, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();

  // Soil — darkens slightly with moisture as plants grow
  const soilLift = Math.max(0, 1 - progress * 1.3);
  const sr = Math.round(34 + soilLift * 12);
  const sg = Math.round(21 + soilLift * 6);
  const sb = Math.round(7 + soilLift * 3);
  ctx.fillStyle = `rgb(${sr},${sg},${sb})`;
  ctx.beginPath();
  ctx.ellipse(cx, cy - 8, rx - 12, ry - 6, 0, 0, Math.PI * 2);
  ctx.fill();

  if (progress < 0.025) return;

  // Stems
  const count = Math.round(Math.min(55, progress * 62));
  const maxH = 10 + progress * 42;

  // Color: pale yellow-green at germination → rich sprout green at harvest
  const R = Math.round(212 - progress * 85);
  const G = Math.round(228 - progress * 36);
  const B = Math.round(152 - progress * 68);
  const stemCol = `rgb(${R},${G},${B})`;
  const baseAlpha = 0.32 + progress * 0.62;

  for (let i = 0; i < count; i++) {
    const { theta, rFrac, lean, hv, leaf } = STEMS[i];

    const sx = cx + Math.cos(theta) * rFrac * (rx - 14);
    const sy = cy - 8 + Math.sin(theta) * (ry - 7) * 0.7;
    const h = maxH * hv;

    ctx.save();
    ctx.strokeStyle = stemCol;
    ctx.globalAlpha = baseAlpha * (0.68 + hv * 0.32);
    ctx.lineWidth = 0.75 + progress * 0.7;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.quadraticCurveTo(sx + lean * 0.38, sy - h * 0.52, sx + lean, sy - h);
    ctx.stroke();

    if (leaf && progress > 0.44 && h > 16) {
      const ls = 2.0 + progress * 2.2;
      ctx.beginPath();
      ctx.ellipse(sx + lean, sy - h, ls, ls * 0.5, Math.atan2(-h, lean), 0, Math.PI * 2);
      ctx.fillStyle = `rgb(${R - 8},${G + 10},${B - 6})`;
      ctx.globalAlpha = 0.72 + progress * 0.22;
      ctx.fill();
    }
    ctx.restore();
  }
}

// ─── Cinematic scenes ─────────────────────────────────────────────────────────

const SCENES = [
  { label: 'Day 0',   body: 'We place the seed.\nBy hand, one tray at a time.' },
  { label: 'Day 1–2', body: 'Before light, it reaches for water.\nSomething stirs beneath.' },
  { label: 'Day 3–4', body: 'The first breath.\nThe seed becomes a plant.' },
  { label: 'Day 5–6', body: 'A thousand tiny hands\nreaching for the same sun.' },
  { label: 'Day 7–8', body: 'A forest in miniature.\nDense. Alive.' },
  { label: 'Day 9',   body: 'At dawn, we harvest.\nBy hand. Never warehoused. Just yours.' },
] as const;

// Each scene's [fadeIn, show, fadeOut, gone] scroll positions
const SCENE_RANGES: number[][] = [
  [0.13, 0.18, 0.24, 0.29],
  [0.27, 0.32, 0.38, 0.43],
  [0.41, 0.46, 0.52, 0.57],
  [0.54, 0.59, 0.65, 0.70],
  [0.67, 0.72, 0.78, 0.83],
  [0.80, 0.85, 0.90, 0.94],
];

// Total dots: brand(0) + 6 scenes + cta(7) = 8
const DOT_BREAKS = [0, 0.13, 0.27, 0.41, 0.54, 0.67, 0.80, 0.93] as const;

// ─── Component ────────────────────────────────────────────────────────────────

interface WelcomeSectionProps {
  onNext: () => void;
}

export function WelcomeSection({ onNext }: WelcomeSectionProps) {
  const prefersReduced = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeDot, setActiveDot] = useState(0);

  const { scrollYProgress } = useScroll({ container: scrollRef });

  // Visibility windows
  const brandOpacity   = useTransform(scrollYProgress, [0, 0.04, 0.13, 0.20], [0, 1, 1, 0]);
  const canvasOpacity  = useTransform(scrollYProgress, [0.11, 0.20], [0, 1], { clamp: true });
  const hintOpacity    = useTransform(scrollYProgress, [0.01, 0.05, 0.13, 0.20], [0, 1, 1, 0]);
  const ctaOpacity     = useTransform(scrollYProgress, [0.90, 0.95], [0, 1], { clamp: true });
  const skipOpacity    = useTransform(scrollYProgress, [0.13, 0.20], [0, 0.38], { clamp: true });

  // Scene text opacities — one useTransform per scene (hooks rules: no loops)
  const sOp0 = useTransform(scrollYProgress, SCENE_RANGES[0], [0, 1, 1, 0]);
  const sOp1 = useTransform(scrollYProgress, SCENE_RANGES[1], [0, 1, 1, 0]);
  const sOp2 = useTransform(scrollYProgress, SCENE_RANGES[2], [0, 1, 1, 0]);
  const sOp3 = useTransform(scrollYProgress, SCENE_RANGES[3], [0, 1, 1, 0]);
  const sOp4 = useTransform(scrollYProgress, SCENE_RANGES[4], [0, 1, 1, 0]);
  const sOp5 = useTransform(scrollYProgress, SCENE_RANGES[5], [0, 1, 1, 0]);
  const sceneOpacities = [sOp0, sOp1, sOp2, sOp3, sOp4, sOp5];

  // Drive canvas + progress dots from scroll
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (canvasRef.current) {
      // Map scroll 13%→90% to canvas growth 0→1
      const cp = Math.max(0, Math.min(1, (p - 0.13) / 0.77));
      drawGrowth(canvasRef.current, cp);
    }
    const dot = DOT_BREAKS.reduce((acc, threshold, i) => (p >= threshold ? i : acc), 0);
    setActiveDot(dot);
  });

  useEffect(() => {
    if (canvasRef.current) drawGrowth(canvasRef.current, 0);
  }, []);

  // ── Reduced-motion fallback: original static layout ──
  if (prefersReduced) {
    const fadeUp = (delay: number) => ({
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.3, delay: 0 },
    });
    return (
      <div
        className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden select-none"
        style={{ background: 'var(--kilai-bg)' }}
      >
        <div className="absolute top-5 right-5 z-20"><RainToggle /></div>
        <div className="relative z-10 flex flex-col items-center px-8 text-center" style={{ maxWidth: '380px' }}>
          <motion.div {...fadeUp(0)} className="flex flex-col items-center" style={{ marginBottom: '28px' }}>
            <div style={{ overflow: 'hidden', lineHeight: 0 }}>
              <img src="/kilai-mark.png" alt="Kilai mark" style={{ width: 'clamp(120px,28vw,160px)', height: 'auto', display: 'block', marginBottom: '-17%', filter: 'drop-shadow(0 2px 18px rgba(168,201,138,0.13))' }} />
            </div>
            <div style={{ overflow: 'hidden', lineHeight: 0 }}>
              <img src="/kilai-wordmark.png" alt="kilai" style={{ width: 'clamp(240px,62vw,340px)', height: 'auto', display: 'block', marginTop: '-35%', marginBottom: '-32%' }} />
            </div>
          </motion.div>
          <motion.p {...fadeUp(0)} style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontWeight: 300, fontSize: 'clamp(1.05rem,3vw,1.22rem)', color: 'rgba(241,236,221,0.82)', lineHeight: 1.8, marginBottom: '36px' }}>
            Food is the first medicine.<br />We grow it like a prayer.
          </motion.p>
          <motion.button onClick={onNext} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontWeight: 400, fontStyle: 'italic', fontSize: '1rem', color: 'var(--kilai-cream)', background: 'rgba(255,255,255,0.055)', border: '1px solid rgba(241,236,221,0.22)', borderRadius: '999px', cursor: 'pointer', padding: '11px 28px', display: 'flex', alignItems: 'center', gap: '8px', backdropFilter: 'blur(6px)' }}>
            Meet your tray <span>→</span>
          </motion.button>
        </div>
      </div>
    );
  }

  // ── Cinematic experience ──
  return (
    <div
      className="relative w-full h-full overflow-hidden select-none"
      style={{ background: 'var(--kilai-bg)' }}
    >
      {/* Dot-rain texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(168,201,138,0.03) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Always-present controls */}
      <div className="absolute top-5 right-5 z-30">
        <RainToggle />
      </div>
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
        {/* Tall scroll canvas — 750vh gives ~20 s at comfortable scroll pace */}
        <div style={{ height: '750vh' }}>

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

            {/* ══ BRAND SCENE (scroll 0–20%) ══ */}
            <motion.div
              style={{
                opacity: brandOpacity,
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}
            >
              <div className="flex flex-col items-center px-8 text-center" style={{ maxWidth: '380px' }}>
                {/* Logo lockup */}
                <div className="flex flex-col items-center" style={{ marginBottom: '28px' }}>
                  <div style={{ overflow: 'hidden', lineHeight: 0 }}>
                    <img
                      src="/kilai-mark.png"
                      alt="Kilai mark"
                      style={{
                        width: 'clamp(120px,28vw,160px)',
                        height: 'auto',
                        display: 'block',
                        marginBottom: '-17%',
                        filter: 'drop-shadow(0 2px 18px rgba(168,201,138,0.13))',
                      }}
                    />
                  </div>
                  <div style={{ overflow: 'hidden', lineHeight: 0 }}>
                    <img
                      src="/kilai-wordmark.png"
                      alt="kilai"
                      style={{
                        width: 'clamp(240px,62vw,340px)',
                        height: 'auto',
                        display: 'block',
                        marginTop: '-35%',
                        marginBottom: '-32%',
                      }}
                    />
                  </div>
                </div>
                {/* Tagline */}
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
                {/* Scroll prompt */}
                <p style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '0.68rem',
                  color: 'rgba(168,201,138,0.55)',
                  letterSpacing: '0.14em',
                }}>
                  scroll to watch it grow ↓
                </p>
              </div>
            </motion.div>

            {/* ══ GROWTH CANVAS (appears at 11–20%) ══ */}
            <motion.div
              style={{
                opacity: canvasOpacity,
                position: 'absolute',
                top: 'clamp(48px, 8%, 80px)',
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'center',
                padding: '0 16px',
                pointerEvents: 'none',
              }}
            >
              <canvas
                ref={canvasRef}
                width={CW}
                height={CH}
                style={{ width: '100%', maxWidth: '420px', height: 'auto', display: 'block' }}
              />
            </motion.div>

            {/* ══ SCENE TEXT OVERLAYS (6 scenes) ══ */}
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

            {/* ══ CTA SCENE (scroll 90–100%) ══ */}
            <motion.div
              style={{
                opacity: ctaOpacity,
                position: 'absolute',
                top: '52%',
                left: '50%',
                transform: 'translateX(-50%)',
                textAlign: 'center',
                width: '100%',
                maxWidth: '340px',
                padding: '0 28px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '22px',
              }}
            >
              <p style={{
                fontFamily: "'Hanken Grotesk', sans-serif",
                fontWeight: 300,
                fontSize: '0.88rem',
                color: 'rgba(241,236,221,0.5)',
                lineHeight: 1.85,
                letterSpacing: '0.01em',
              }}>
                Somewhere in Bengaluru, right now,
                <br />
                a tray is growing for someone.
              </p>
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
                Meet your tray
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                >
                  →
                </motion.span>
              </motion.button>
            </motion.div>

            {/* ══ SCROLL HINT (fade out after scene 0) ══ */}
            <motion.div
              style={{
                opacity: hintOpacity,
                position: 'absolute',
                bottom: '56px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                pointerEvents: 'none',
              }}
            >
              <motion.span
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  color: 'rgba(168,201,138,0.38)',
                  fontSize: '0.78rem',
                  lineHeight: 1,
                }}
              >
                ↓
              </motion.span>
            </motion.div>

            {/* ══ PROGRESS DOTS (8 steps: brand + 6 scenes + cta) ══ */}
            <div
              style={{
                position: 'absolute',
                bottom: '22px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '7px',
                alignItems: 'center',
              }}
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: i === activeDot ? '16px' : '5px',
                    height: '5px',
                    borderRadius: '3px',
                    background:
                      i === activeDot
                        ? 'var(--kilai-sprout)'
                        : 'rgba(168,201,138,0.18)',
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
