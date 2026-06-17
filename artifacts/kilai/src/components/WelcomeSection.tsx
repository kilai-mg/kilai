import { motion, useReducedMotion } from 'framer-motion';
import { RainToggle } from './RainToggle';

interface WelcomeSectionProps {
  onNext: () => void;
}

export function WelcomeSection({ onNext }: WelcomeSectionProps) {
  const prefersReduced = useReducedMotion();

  const fadeUp = (delay: number) =>
    prefersReduced
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3, delay: 0 } }
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.95, delay, ease: [0.22, 1, 0.36, 1] },
        };

  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden select-none"
      style={{ background: 'var(--kilai-bg)' }}
    >
      {/* Rain toggle */}
      <div className="absolute top-5 right-5 z-20">
        <RainToggle />
      </div>

      {/* Faint dot-rain texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(168,201,138,0.03) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-8 text-center" style={{ maxWidth: '380px', gap: '0' }}>

        {/* ── Brand lockup: mark + wordmark as one tight unit ── */}
        <motion.div
          {...fadeUp(0)}
          className="flex flex-col items-center"
          style={{ marginBottom: '28px' }}
        >
          {/* Logo mark — crop the transparent bottom padding via overflow:hidden wrapper */}
          <div style={{ overflow: 'hidden', lineHeight: 0 }}>
            <img
              src="/kilai-mark.png"
              alt="Kilai mark"
              style={{
                width: 'clamp(120px, 28vw, 160px)',
                height: 'auto',
                display: 'block',
                marginBottom: '-17%',   /* crop transparent bottom of the PNG */
                filter: 'drop-shadow(0 2px 18px rgba(168,201,138,0.13))',
              }}
            />
          </div>

          {/* Wordmark — crop the transparent top padding via overflow:hidden wrapper */}
          <div style={{ overflow: 'hidden', lineHeight: 0 }}>
            <img
              src="/kilai-wordmark.png"
              alt="kilai"
              style={{
                width: 'clamp(240px, 62vw, 340px)',
                height: 'auto',
                display: 'block',
                marginTop: '-35%',    /* crop transparent top of the PNG */
                marginBottom: '-32%', /* crop transparent bottom of the PNG */
              }}
            />
          </div>
        </motion.div>

        {/* Brand statement */}
        <motion.div {...fadeUp(0.3)} style={{ marginBottom: '20px', marginTop: '8px' }}>
          <p
            style={{
              fontFamily: "'Hanken Grotesk', sans-serif",
              fontWeight: 300,
              fontSize: 'clamp(1.05rem, 3vw, 1.22rem)',
              color: 'rgba(241,236,221,0.82)',
              lineHeight: 1.8,
              letterSpacing: '0.015em',
            }}
          >
            Food is the first medicine.
            <br />
            We grow it like a prayer.
          </p>
        </motion.div>

        {/* Subtitle */}
        <motion.div {...fadeUp(0.45)} style={{ marginBottom: '36px' }}>
          <p
            style={{
              fontFamily: "'Hanken Grotesk', sans-serif",
              fontWeight: 300,
              fontSize: '0.82rem',
              color: 'rgba(241,236,221,0.38)',
              lineHeight: 1.7,
              letterSpacing: '0.01em',
            }}
          >
            Somewhere in Bengaluru, a tray is growing for you right now.
          </p>
        </motion.div>

        {/* CTA — pill button with soft glow pulse */}
        <motion.div {...fadeUp(0.58)}>
          <motion.button
            onClick={onNext}
            data-testid="button-meet-tray"
            animate={{ boxShadow: ['0 0 0px 0px rgba(168,201,138,0)', '0 0 14px 3px rgba(168,201,138,0.18)', '0 0 0px 0px rgba(168,201,138,0)'] }}
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
      </div>
    </div>
  );
}
