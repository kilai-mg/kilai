import { motion, useReducedMotion } from 'framer-motion';
import { Camera, Sunrise, Package } from 'lucide-react';

const beats = [
  {
    icon: Camera,
    heading: 'Every morning, a photo of your tray.',
    sub: 'A quiet message, just for you.',
  },
  {
    icon: Sunrise,
    heading: 'On Day 9, we harvest it at dawn — by hand, never warehoused.',
    sub: 'The same hands that planted it, bring it home to you.',
  },
  {
    icon: Package,
    heading: 'It arrives still living, in a Kilai box.',
    sub: 'With a note on how to keep it growing.',
  },
];

export function WhatHappensNext() {
  const prefersReduced = useReducedMotion();

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center px-6"
      style={{ background: 'var(--kilai-bg)' }}
    >
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          fontFamily: "'Marcellus', Georgia, serif",
          fontSize: 'clamp(0.7rem, 1.8vw, 0.85rem)',
          color: 'rgba(241,236,221,0.35)',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          marginBottom: '2.5rem',
        }}
      >
        What happens after you adopt your tray
      </motion.p>

      <div className="flex flex-col md:flex-row gap-10 md:gap-16 max-w-2xl w-full">
        {beats.map((beat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: prefersReduced ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: prefersReduced ? 0 : i * 0.25 + 0.2 }}
            className="flex flex-col items-center text-center gap-4 flex-1"
          >
            <div
              className="flex items-center justify-center"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'rgba(168,201,138,0.08)',
                border: '1px solid rgba(168,201,138,0.18)',
              }}
            >
              <beat.icon size={18} style={{ color: 'var(--kilai-sprout)' }} />
            </div>

            <p
              style={{
                fontFamily: "'Marcellus', Georgia, serif",
                fontSize: 'clamp(0.9rem, 2.2vw, 1.05rem)',
                color: 'var(--kilai-cream)',
                lineHeight: 1.6,
              }}
            >
              {beat.heading}
            </p>

            <p
              style={{
                fontFamily: "'Hanken Grotesk', sans-serif",
                fontWeight: 300,
                fontSize: '0.8rem',
                color: 'rgba(241,236,221,0.4)',
                lineHeight: 1.6,
              }}
            >
              {beat.sub}
            </p>

            {/* Connector line (desktop) */}
            {i < beats.length - 1 && (
              <div
                className="hidden md:block absolute"
                style={{
                  width: '1px',
                  height: '40px',
                  background: 'rgba(168,201,138,0.12)',
                }}
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
