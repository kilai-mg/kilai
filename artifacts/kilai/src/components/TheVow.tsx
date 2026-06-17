import { motion, useReducedMotion } from 'framer-motion';

const steps = [
  {
    status: 'done',
    label: 'Pesticide-free growing',
    note: 'Every tray, from day one.',
    indicator: '✓',
  },
  {
    status: 'now',
    label: 'Direct organic-farmer ties',
    note: 'We know their names. They know ours.',
    indicator: '→',
  },
  {
    status: 'vow',
    label: '100% organic-soil seed',
    note: 'Not yet. But it\'s why we exist.',
    indicator: '○',
  },
];

export function TheVow() {
  const prefersReduced = useReducedMotion();

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center px-6 overflow-y-auto"
      style={{ background: '#080F0B', scrollbarWidth: 'none' }}
    >
      <div className="flex flex-col items-center gap-8 max-w-xl w-full py-16">

        {/* Title */}
        <motion.p
          initial={{ opacity: 0, y: prefersReduced ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          style={{
            fontFamily: "'Marcellus', Georgia, serif",
            fontSize: 'clamp(1.1rem, 3.5vw, 1.6rem)',
            color: 'var(--kilai-cream)',
            textAlign: 'center',
            lineHeight: 1.5,
          }}
        >
          An unfinished promise,
          <br />
          printed on purpose.
        </motion.p>

        {/* Body */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.25 }}
          style={{
            fontFamily: "'Hanken Grotesk', sans-serif",
            fontWeight: 300,
            fontSize: '0.88rem',
            color: 'rgba(241,236,221,0.45)',
            lineHeight: 1.85,
            textAlign: 'center',
            maxWidth: '480px',
          }}
        >
          Every Kilai seed is moving toward being sourced from certified organic soil,
          grown by farmers we know by name near Coimbatore — part of the Save Soil network.
        </motion.p>

        {/* Roadmap */}
        <div className="flex flex-col md:flex-row items-stretch gap-0 w-full">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: prefersReduced ? 0 : i * 0.2 + 0.4 }}
              className="flex-1 flex flex-col items-center text-center gap-3 px-4 py-6 relative"
              style={{
                borderLeft: i > 0 ? '1px solid rgba(168,201,138,0.08)' : 'none',
              }}
            >
              {/* Indicator */}
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '0.9rem',
                  ...(step.status === 'done' && {
                    background: 'rgba(178,107,61,0.15)',
                    border: '1px solid rgba(178,107,61,0.4)',
                    color: 'var(--kilai-copper)',
                  }),
                  ...(step.status === 'now' && {
                    background: 'rgba(168,201,138,0.12)',
                    border: '1px solid rgba(168,201,138,0.35)',
                    color: 'var(--kilai-sprout)',
                    boxShadow: '0 0 12px rgba(168,201,138,0.15)',
                  }),
                  ...(step.status === 'vow' && {
                    background: 'transparent',
                    border: '1px solid rgba(241,236,221,0.15)',
                    color: 'rgba(241,236,221,0.3)',
                  }),
                }}
              >
                {step.status === 'now' ? (
                  <span style={{ position: 'relative' }}>
                    →
                    <span
                      style={{
                        position: 'absolute',
                        inset: '-8px',
                        borderRadius: '50%',
                        background: 'rgba(168,201,138,0.08)',
                        animation: prefersReduced ? 'none' : 'vow-pulse 2.5s ease-in-out infinite',
                      }}
                    />
                    <style>{`
                      @keyframes vow-pulse {
                        0%, 100% { opacity: 0.4; transform: scale(1); }
                        50% { opacity: 0; transform: scale(1.6); }
                      }
                    `}</style>
                  </span>
                ) : step.indicator}
              </div>

              {/* Label */}
              <p
                style={{
                  fontFamily: "'Marcellus', Georgia, serif",
                  fontSize: '0.88rem',
                  lineHeight: 1.5,
                  ...(step.status === 'done' && { color: 'rgba(241,236,221,0.7)' }),
                  ...(step.status === 'now' && { color: 'var(--kilai-sprout)' }),
                  ...(step.status === 'vow' && { color: 'rgba(241,236,221,0.3)' }),
                }}
              >
                {step.label}
              </p>

              {/* Note */}
              <p
                style={{
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  fontWeight: 300,
                  fontSize: '0.72rem',
                  fontStyle: 'italic',
                  color: 'rgba(241,236,221,0.28)',
                  lineHeight: 1.5,
                }}
              >
                {step.note}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Closing line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          style={{
            fontFamily: "'Hanken Grotesk', sans-serif",
            fontWeight: 300,
            fontStyle: 'italic',
            fontSize: '0.8rem',
            color: 'rgba(241,236,221,0.3)',
            textAlign: 'center',
            borderTop: '1px solid rgba(241,236,221,0.07)',
            paddingTop: '1.5rem',
            maxWidth: '360px',
          }}
        >
          We printed this because we mean it. Hold us to it.
        </motion.p>
      </div>
    </div>
  );
}
