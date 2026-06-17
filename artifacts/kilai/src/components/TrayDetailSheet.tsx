import { motion } from 'framer-motion';
import { X, Leaf } from 'lucide-react';
import { Tray, varietyGradient } from '@/data/trays';

const categoryLabel: Record<string, string> = {
  tall:    'A · 6-Inch Grow',
  short:   'B · 2–3 Inch Grow',
  premium: 'C · Premium',
};

interface TrayDetailSheetProps {
  tray: Tray;
  onClose: () => void;
}

export function TrayDetailSheet({ tray, onClose }: TrayDetailSheetProps) {
  const gradient = varietyGradient(tray.category);
  const daysLeft = Math.max(0, tray.totalDays - tray.day);
  const progress = Math.min(1, tray.day / tray.totalDays);
  const isReady = daysLeft === 0;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 60,
          background: 'rgba(4,18,10,0.78)',
          backdropFilter: 'blur(6px)',
        }}
      />

      {/* Sheet */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 340, damping: 38 }}
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 61,
          background: '#0a1d14',
          border: '1px solid rgba(168,201,138,0.12)',
          borderBottom: 'none',
          borderRadius: '16px 16px 0 0',
          height: '82dvh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px 12px',
          borderBottom: '1px solid rgba(168,201,138,0.08)',
          flexShrink: 0,
        }}>
          <p style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '0.5rem',
            color: 'rgba(241,236,221,0.28)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}>
            Tray #{tray.id} · {categoryLabel[tray.category]}
          </p>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(241,236,221,0.3)', padding: '2px', lineHeight: 1 }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '20px 20px 32px' }}>

          {/* Tray visual */}
          <div style={{ background: gradient, borderRadius: '8px', height: '96px', position: 'relative', marginBottom: '20px', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end',
              padding: '0 10px 8px', height: '56px',
            }}>
              {Array.from({ length: 18 }).map((_, i) => (
                <div key={i} style={{
                  width: '1.5px',
                  height: `${14 + (i % 3) * 8 + Math.sin(i) * 5}px`,
                  background: 'rgba(201,226,174,0.35)',
                  borderRadius: '1px',
                  transform: `rotate(${(i % 5 - 2) * 4}deg)`,
                }} />
              ))}
            </div>
            <div style={{
              position: 'absolute', top: 10, left: 12,
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '0.52rem', color: 'rgba(241,236,221,0.5)', letterSpacing: '0.06em',
            }}>
              Day {tray.day} of {tray.totalDays}
            </div>
            {isReady && (
              <div style={{
                position: 'absolute', top: 10, right: 12,
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '0.48rem', color: 'var(--kilai-sprout)',
                letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>
                Ready ✦
              </div>
            )}
          </div>

          {/* Name + character */}
          <p style={{
            fontFamily: "'Marcellus', Georgia, serif",
            fontSize: '1.6rem', color: 'var(--kilai-cream)', lineHeight: 1.15, marginBottom: '5px',
          }}>
            {tray.variety}
          </p>
          <p style={{
            fontFamily: "'Hanken Grotesk', sans-serif",
            fontWeight: 300, fontSize: '0.8rem',
            color: 'rgba(241,236,221,0.4)', fontStyle: 'italic', marginBottom: '24px',
          }}>
            {tray.character}
          </p>

          {/* Growth progress bar */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px' }}>
              <p style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '0.48rem', color: 'rgba(241,236,221,0.25)', letterSpacing: '0.1em',
              }}>
                GROWTH PROGRESS
              </p>
              <p style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '0.48rem',
                color: isReady ? 'var(--kilai-sprout)' : 'rgba(241,236,221,0.38)',
                letterSpacing: '0.08em',
              }}>
                {isReady
                  ? 'READY TO HARVEST'
                  : `${daysLeft} day${daysLeft !== 1 ? 's' : ''} to harvest`}
              </p>
            </div>
            {/* Bar track */}
            <div style={{ height: '3px', background: 'rgba(168,201,138,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 0.9, ease: 'easeOut', delay: 0.25 }}
                style={{
                  height: '100%',
                  background: isReady
                    ? 'var(--kilai-sprout)'
                    : 'linear-gradient(90deg, rgba(168,201,138,0.5), var(--kilai-sprout))',
                  borderRadius: '2px',
                }}
              />
            </div>
            {/* Day markers */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
              {Array.from({ length: tray.totalDays }).map((_, i) => (
                <div key={i} style={{
                  width: '3px', height: '3px', borderRadius: '50%',
                  background: i < tray.day
                    ? 'rgba(168,201,138,0.65)'
                    : 'rgba(168,201,138,0.12)',
                }} />
              ))}
            </div>
          </div>

          {/* Adopter card */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '13px 14px',
            background: 'rgba(168,201,138,0.04)',
            border: '1px solid rgba(168,201,138,0.1)',
            borderRadius: '6px',
            marginBottom: '22px',
          }}>
            <Leaf size={14} style={{ color: 'rgba(168,201,138,0.45)', flexShrink: 0 }} />
            <div>
              <p style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '0.45rem', color: 'rgba(241,236,221,0.22)', letterSpacing: '0.1em', marginBottom: '4px',
              }}>
                GROWING FOR
              </p>
              <p style={{
                fontFamily: "'Marcellus', Georgia, serif",
                fontSize: '0.95rem', color: 'var(--kilai-cream)',
              }}>
                {tray.adoptedBy}
              </p>
            </div>
          </div>

          {/* Nutrients section */}
          <div style={{ marginBottom: '18px' }}>
            <p style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '0.47rem', color: 'rgba(241,236,221,0.22)', letterSpacing: '0.1em', marginBottom: '10px',
            }}>
              KEY NUTRIENTS
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
              {tray.nutrients.map(n => (
                <span key={n} style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '0.57rem',
                  color: 'rgba(168,201,138,0.82)',
                  background: 'rgba(168,201,138,0.07)',
                  border: '1px solid rgba(168,201,138,0.2)',
                  borderRadius: '3px',
                  padding: '5px 9px',
                  lineHeight: 1.4,
                }}>
                  {n}
                </span>
              ))}
            </div>
          </div>

          {/* Nutritionist note */}
          <p style={{
            fontFamily: "'Hanken Grotesk', sans-serif",
            fontWeight: 300, fontSize: '0.77rem',
            color: 'rgba(241,236,221,0.38)',
            lineHeight: 1.7, fontStyle: 'italic',
            borderLeft: '2px solid rgba(168,201,138,0.2)',
            paddingLeft: '12px',
          }}>
            {tray.nutrientNote}
          </p>

        </div>
      </motion.div>
    </>
  );
}
