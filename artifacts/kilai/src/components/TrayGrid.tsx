import { motion, useReducedMotion } from 'framer-motion';
import { TRAYS, Tray, varietyGradient } from '@/data/trays';

const categoryLabel: Record<string, string> = {
  tall:    '6″ Grow',
  short:   '2–3″ Grow',
  premium: 'Premium',
};
const categoryColor: Record<string, string> = {
  tall:    'rgba(168,201,138,0.7)',
  short:   'rgba(168,201,138,0.5)',
  premium: 'rgba(255,210,120,0.75)',
};

function TrayCard({ tray, onAdopt, onViewAdopted }: { tray: Tray; onAdopt: (t: Tray) => void; onViewAdopted: (t: Tray) => void }) {
  const gradient = varietyGradient(tray.category);
  const isAdopted = tray.status === 'adopted';

  function handleCardClick() {
    if (isAdopted) onViewAdopted(tray);
    else onAdopt(tray);
  }

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      onClick={handleCardClick}
      data-testid={`card-tray-${tray.id}`}
      className="rounded-sm overflow-hidden flex flex-col"
      style={{
        background: 'rgba(20,68,44,0.22)',
        border: isAdopted
          ? '1px solid rgba(168,201,138,0.18)'
          : '1px solid rgba(168,201,138,0.1)',
        cursor: 'pointer',
      }}
    >
      {/* Tray visual */}
      <div className="relative" style={{ background: gradient, height: '100px' }}>
        {/* Sprout lines */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-around items-end pb-1.5 px-2" style={{ height: '38px' }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: '1.5px',
                height: `${12 + (i % 3) * 7 + Math.sin(i) * 4}px`,
                background: 'rgba(201,226,174,0.38)',
                borderRadius: '1px',
                transform: `rotate(${(i % 5 - 2) * 4}deg)`,
              }}
            />
          ))}
        </div>
        {/* Day badge */}
        <div className="absolute top-2 left-2" style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '0.55rem',
          color: 'rgba(241,236,221,0.55)',
          letterSpacing: '0.06em',
        }}>
          Day {tray.day}/{tray.totalDays}
        </div>
        {/* Category badge */}
        <div className="absolute top-2 right-2" style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '0.48rem',
          color: categoryColor[tray.category],
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          {categoryLabel[tray.category]}
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        {/* Name + price */}
        <div className="flex items-baseline justify-between gap-1">
          <p style={{
            fontFamily: "'Marcellus', Georgia, serif",
            fontSize: '0.9rem',
            color: 'var(--kilai-cream)',
            lineHeight: 1.2,
          }}>
            {tray.variety}
          </p>
          <p style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '0.62rem',
            color: 'var(--kilai-sprout)',
            opacity: 0.85,
            flexShrink: 0,
          }}>
            ₹{tray.price.toLocaleString('en-IN')}
          </p>
        </div>

        {/* Nutrient pills */}
        <div className="flex flex-wrap gap-1">
          {tray.nutrients.map((n) => (
            <span
              key={n}
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '0.48rem',
                letterSpacing: '0.04em',
                color: 'rgba(168,201,138,0.75)',
                background: 'rgba(168,201,138,0.08)',
                border: '1px solid rgba(168,201,138,0.18)',
                borderRadius: '2px',
                padding: '2px 5px',
                lineHeight: 1.4,
                whiteSpace: 'nowrap',
              }}
            >
              {n}
            </span>
          ))}
        </div>

        {/* Nutritionist note — clamped to 3 lines so all cards stay uniform */}
        <p style={{
          fontFamily: "'Hanken Grotesk', sans-serif",
          fontWeight: 300,
          fontSize: '0.68rem',
          color: 'rgba(241,236,221,0.4)',
          lineHeight: 1.55,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          flexGrow: 1,
        }}>
          {tray.nutrientNote}
        </p>

        {/* CTA footer row */}
        <div className="pt-1">
          {isAdopted ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{
                fontFamily: "'Hanken Grotesk', sans-serif",
                fontSize: '0.65rem',
                fontStyle: 'italic',
                color: 'rgba(168,201,138,0.45)',
                lineHeight: 1.4,
              }}>
                Growing for {tray.adoptedBy?.split(',')[0]}
              </p>
              <p style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '0.45rem',
                color: 'rgba(168,201,138,0.3)',
                letterSpacing: '0.06em',
              }}>
                VIEW ›
              </p>
            </div>
          ) : (
            <p style={{
              fontFamily: "'Marcellus', Georgia, serif",
              fontSize: '0.72rem',
              color: 'rgba(241,236,221,0.65)',
              letterSpacing: '0.04em',
            }}>
              Adopt me.
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

interface TrayGridProps {
  onAdoptTray: (tray: Tray) => void;
  onViewAdoptedTray: (tray: Tray) => void;
}

export function TrayGrid({ onAdoptTray, onViewAdoptedTray }: TrayGridProps) {
  const prefersReduced = useReducedMotion();

  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: 'var(--kilai-bg)' }}>
      {/* Header */}
      <div className="flex-shrink-0 pt-10 pb-5 px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: prefersReduced ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{
            fontFamily: "'Marcellus', Georgia, serif",
            fontSize: 'clamp(1rem, 3vw, 1.4rem)',
            color: 'var(--kilai-cream)',
            lineHeight: 1.5,
          }}
        >
          Forty trays. Each one becomes someone's.
          <br />
          <span style={{ color: 'rgba(241,236,221,0.5)' }}>Choose yours.</span>
        </motion.p>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-4 pb-20" style={{ scrollbarWidth: 'none' }}>
        <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))' }}>
          {TRAYS.map((tray, i) => (
            <motion.div
              key={tray.id}
              initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: prefersReduced ? 0 : i * 0.018 }}
            >
              <TrayCard tray={tray} onAdopt={onAdoptTray} onViewAdopted={onViewAdoptedTray} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
