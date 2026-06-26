import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { Tray } from '@workspace/api-client-react';

const FRAME_COUNT = 24;
const CANVAS_W = 400;
const CANVAS_H = 280;

const varietyColors: Record<string, { sprout: string; soil: string; tray: string }> = {
  Radish: { sprout: '#7aaa5a', soil: '#2a1808', tray: '#142810' },
  Mustard: { sprout: '#b0aa40', soil: '#2a1e08', tray: '#1e2808' },
  Sunflower: { sprout: '#c8a030', soil: '#2a1808', tray: '#221a08' },
  Pea: { sprout: '#5aaa7a', soil: '#0a2018', tray: '#0e2818' },
  Beet: { sprout: '#aa4a6a', soil: '#200a12', tray: '#1a0810' },
  Fenugreek: { sprout: '#80aa50', soil: '#1a2008', tray: '#121e08' },
  Amaranth: { sprout: '#8870c0', soil: '#1a1028', tray: '#14101e' },
  Broccoli: { sprout: '#50aa70', soil: '#0a2010', tray: '#0e2215' },
};

function generateFrame(
  canvas: HTMLCanvasElement,
  angle: number,
  variety: string,
  seed: number
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const { sprout, soil, tray } = varietyColors[variety] ?? varietyColors['Pea'];

  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

  const cx = CANVAS_W / 2;
  const cy = CANVAS_H / 2 + 20;
  const perspX = Math.abs(Math.cos(angle)) * 0.35 + 0.65;
  const rx = 160 * perspX;
  const ry = 36;

  // Tray shadow
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.6)';
  ctx.shadowBlur = 30;
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath();
  ctx.ellipse(cx, cy + ry + 20, rx * 0.9, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Tray body sides
  ctx.fillStyle = tray;
  ctx.beginPath();
  ctx.moveTo(cx - rx, cy - 10);
  ctx.lineTo(cx - rx, cy + 40);
  ctx.ellipse(cx, cy + 40, rx, ry * 0.7, 0, Math.PI, Math.PI * 2);
  ctx.lineTo(cx + rx, cy - 10);
  ctx.closePath();
  ctx.fill();

  // Tray rim top
  ctx.fillStyle = adjustColor(tray, 15);
  ctx.beginPath();
  ctx.ellipse(cx, cy - 10, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();

  // Soil surface
  ctx.fillStyle = soil;
  ctx.beginPath();
  ctx.ellipse(cx, cy - 10, rx - 10, ry - 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Microgreens
  const rng = mulberry32(seed + Math.floor(angle * 100));
  const stemCount = 55;
  for (let i = 0; i < stemCount; i++) {
    const r = rng();
    const theta2 = rng() * Math.PI * 2;
    const rad = rng() * (rx - 18);
    const sx = cx + Math.cos(theta2) * rad * perspX;
    const sy = (cy - 10) + Math.sin(theta2) * (ry - 8) * 0.7;
    const h = 18 + rng() * 28;
    const lean = (rng() - 0.5) * 12;

    ctx.save();
    ctx.strokeStyle = sprout;
    ctx.globalAlpha = 0.6 + rng() * 0.4;
    ctx.lineWidth = 1 + rng() * 0.8;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.quadraticCurveTo(sx + lean * 0.5, sy - h * 0.5, sx + lean, sy - h);
    ctx.stroke();

    // Tiny leaf tip
    if (r > 0.5) {
      ctx.beginPath();
      ctx.ellipse(sx + lean, sy - h, 3, 1.5, Math.atan2(-h, lean), 0, Math.PI * 2);
      ctx.fillStyle = sprout;
      ctx.fill();
    }
    ctx.restore();
  }
}

function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0xff) + amount);
  const b = Math.min(255, (num & 0xff) + amount);
  return `rgb(${r},${g},${b})`;
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

interface TrayViewerProps {
  tray: Tray;
  onBack: () => void;
}

export function TrayViewer({ tray, onBack }: TrayViewerProps) {
  const prefersReduced = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [frameIdx, setFrameIdx] = useState(0);
  const [adopted, setAdopted] = useState(false);
  const baseFrameRef = useRef(0);
  const dragStartRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const autoSpinRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentFrameRef = useRef(0);

  const drawFrame = useCallback((idx: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !framesRef.current[idx]) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.putImageData(framesRef.current[idx], 0, 0);
    currentFrameRef.current = idx;
  }, []);

  // Generate all frames
  useEffect(() => {
    setLoading(true);
    setFrameIdx(0);
    baseFrameRef.current = 0;
    framesRef.current = [];

    const offscreen = document.createElement('canvas');
    offscreen.width = CANVAS_W;
    offscreen.height = CANVAS_H;
    const ctx = offscreen.getContext('2d');
    if (!ctx) return;

    const frames: ImageData[] = [];
    for (let i = 0; i < FRAME_COUNT; i++) {
      const angle = (i / FRAME_COUNT) * Math.PI * 2;
      generateFrame(offscreen, angle, tray.variety, tray.id + i * 7);
      frames.push(ctx.getImageData(0, 0, CANVAS_W, CANVAS_H));
    }
    framesRef.current = frames;
    setLoading(false);
    setFrameIdx(0);
  }, [tray.id, tray.variety]);

  // Draw when frameIdx changes
  useEffect(() => {
    if (!loading) drawFrame(frameIdx);
  }, [frameIdx, loading, drawFrame]);

  // Auto-spin
  const startAutoSpin = useCallback(() => {
    if (autoSpinRef.current) clearInterval(autoSpinRef.current);
    autoSpinRef.current = setInterval(() => {
      if (!isDraggingRef.current) {
        const next = (currentFrameRef.current + 1) % FRAME_COUNT;
        setFrameIdx(next);
      }
    }, 80);
  }, []);

  const stopAutoSpin = useCallback(() => {
    if (autoSpinRef.current) {
      clearInterval(autoSpinRef.current);
      autoSpinRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!loading && !prefersReduced) startAutoSpin();
    return () => stopAutoSpin();
  }, [loading, prefersReduced, startAutoSpin, stopAutoSpin]);

  // Drag handlers
  const onDragStart = (clientX: number) => {
    isDraggingRef.current = true;
    dragStartRef.current = clientX;
    baseFrameRef.current = currentFrameRef.current;
    stopAutoSpin();
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
  };

  const onDragMove = (clientX: number) => {
    if (!isDraggingRef.current || dragStartRef.current === null) return;
    const delta = clientX - dragStartRef.current;
    const idx = ((baseFrameRef.current + Math.floor(delta / 10)) % FRAME_COUNT + FRAME_COUNT * 100) % FRAME_COUNT;
    setFrameIdx(idx);
  };

  const onDragEnd = () => {
    isDraggingRef.current = false;
    baseFrameRef.current = currentFrameRef.current;
    if (!prefersReduced) {
      resumeTimerRef.current = setTimeout(startAutoSpin, 2000);
    }
  };

  // Day progress dots
  const dayDots = Array.from({ length: tray.totalDays }, (_, i) => i < tray.day);

  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden"
      style={{ background: 'var(--kilai-bg)' }}
    >
      {/* Back button */}
      <div className="flex-shrink-0 pt-5 px-5">
        <button
          onClick={onBack}
          data-testid="button-back-trays"
          className="flex items-center gap-1 transition-opacity hover:opacity-60"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '0.7rem',
            color: 'rgba(241,236,221,0.5)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            letterSpacing: '0.06em',
          }}
        >
          <ChevronLeft size={14} />
          All trays
        </button>
      </div>

      {/* 360 Viewer */}
      <div className="flex-shrink-0 flex justify-center items-center pt-2 pb-4 px-4">
        <div
          className="relative"
          style={{ width: `${CANVAS_W}px`, maxWidth: '100%', userSelect: 'none' }}
        >
          <AnimatePresence>
            {loading && (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  background: 'rgba(10,29,20,0.9)',
                  zIndex: 10,
                  borderRadius: '4px',
                  minHeight: `${CANVAS_H}px`,
                }}
              >
                <p style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '0.75rem',
                  color: 'var(--kilai-sprout)',
                  opacity: 0.7,
                  letterSpacing: '0.1em',
                  animation: 'pulse 2s ease-in-out infinite',
                }}>
                  waking your tray…
                </p>
                <style>{`
                  @keyframes pulse {
                    0%, 100% { opacity: 0.4; }
                    50% { opacity: 0.9; }
                  }
                `}</style>
              </motion.div>
            )}
          </AnimatePresence>
          <canvas
            ref={canvasRef}
            width={CANVAS_W}
            height={CANVAS_H}
            data-testid="canvas-tray-viewer"
            style={{
              width: '100%',
              height: 'auto',
              cursor: loading ? 'default' : 'grab',
              touchAction: 'none',
              display: 'block',
              // TODO: Replace canvas with real photo sequence frames per variety
            }}
            onMouseDown={e => onDragStart(e.clientX)}
            onMouseMove={e => { if (isDraggingRef.current) onDragMove(e.clientX); }}
            onMouseUp={onDragEnd}
            onMouseLeave={onDragEnd}
            onTouchStart={e => onDragStart(e.touches[0].clientX)}
            onTouchMove={e => onDragMove(e.touches[0].clientX)}
            onTouchEnd={onDragEnd}
          />
          {!loading && (
            <p style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '0.6rem',
              color: 'rgba(241,236,221,0.3)',
              textAlign: 'center',
              letterSpacing: '0.1em',
              marginTop: '6px',
            }}>
              drag to spin
            </p>
          )}
        </div>
      </div>

      {/* Tray info — scrollable */}
      <div className="flex-1 overflow-y-auto px-6 pb-24 text-center" style={{ scrollbarWidth: 'none' }}>
        <motion.div
          initial={{ opacity: 0, y: prefersReduced ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-4 max-w-sm mx-auto"
        >
          {/* Variety */}
          <p style={{
            fontFamily: "'Marcellus', Georgia, serif",
            fontSize: 'clamp(1.4rem, 4vw, 1.9rem)',
            color: 'var(--kilai-cream)',
          }}>
            {tray.variety}
          </p>

          {/* Character */}
          <p style={{
            fontFamily: "'Hanken Grotesk', sans-serif",
            fontWeight: 300,
            fontStyle: 'italic',
            fontSize: '0.9rem',
            color: 'rgba(241,236,221,0.55)',
          }}>
            {tray.character}
          </p>

          {/* Day progress */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-1.5 items-center">
              {dayDots.map((filled, i) => (
                <div
                  key={i}
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: filled ? 'var(--kilai-sprout)' : 'rgba(168,201,138,0.15)',
                    border: filled ? 'none' : '1px solid rgba(168,201,138,0.25)',
                    transition: 'background 0.3s',
                  }}
                />
              ))}
            </div>
            <p style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '0.65rem',
              color: 'var(--kilai-sprout)',
              opacity: 0.75,
              letterSpacing: '0.1em',
            }}>
              Day {tray.day} of {tray.totalDays}
            </p>
          </div>

          {/* Price */}
          <p style={{
            fontFamily: "'Marcellus', Georgia, serif",
            fontSize: '1.3rem',
            color: 'var(--kilai-sprout)',
          }}>
            ₹{tray.price.toLocaleString('en-IN')}
          </p>

          {/* Invite */}
          <p style={{
            fontFamily: "'Hanken Grotesk', sans-serif",
            fontWeight: 300,
            fontSize: '0.85rem',
            color: 'rgba(241,236,221,0.5)',
            lineHeight: 1.7,
          }}>
            Pick this tray and watch it grow, every day,
            <br />
            until it comes home to you.
          </p>

          {/* Adopt button */}
          <AnimatePresence mode="wait">
            {adopted ? (
              <motion.div
                key="confirmed"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full rounded-sm p-5 text-center"
                style={{ background: 'rgba(20,68,44,0.4)', border: '1px solid rgba(168,201,138,0.2)' }}
              >
                <p style={{
                  fontFamily: "'Marcellus', Georgia, serif",
                  fontSize: '1.05rem',
                  color: 'var(--kilai-cream)',
                  lineHeight: 1.6,
                }}>
                  Tray #{tray.id} is yours now.
                </p>
                <p style={{
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  fontWeight: 300,
                  fontSize: '0.8rem',
                  color: 'rgba(241,236,221,0.5)',
                  marginTop: '8px',
                  lineHeight: 1.6,
                }}>
                  We'll send you a photo every morning
                  <br />
                  until harvest.
                </p>
                {/* TODO: phone OTP + WhatsApp daily photo notifications */}
              </motion.div>
            ) : (
              <motion.button
                key="adopt-btn"
                onClick={() => {
                  setAdopted(true);
                  // TODO: connect Razorpay + UPI payment
                }}
                data-testid={`button-adopt-confirm-${tray.id}`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-3.5 rounded-sm transition-all"
                style={{
                  fontFamily: "'Marcellus', Georgia, serif",
                  fontSize: '0.95rem',
                  color: 'var(--kilai-cream)',
                  background: 'rgba(20,68,44,0.6)',
                  border: '1px solid rgba(168,201,138,0.3)',
                  cursor: 'pointer',
                  letterSpacing: '0.06em',
                }}
              >
                Pick this tray — ₹{tray.price.toLocaleString('en-IN')}
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
