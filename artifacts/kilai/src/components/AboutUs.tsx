import { motion, useReducedMotion } from 'framer-motion';

export function AboutUs() {
  const prefersReduced = useReducedMotion();

  const fadeUp = (delay: number) =>
    prefersReduced
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3, delay: 0 } }
      : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] } };

  return (
    <div
      className="w-full h-full overflow-y-auto"
      style={{ background: 'var(--kilai-bg)', scrollbarWidth: 'none' }}
    >
      <div className="max-w-xl mx-auto px-6 py-16 flex flex-col gap-12">

        {/* Header */}
        <motion.div {...fadeUp(0)} className="flex flex-col gap-3">
          <p style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '0.6rem',
            letterSpacing: '0.22em',
            color: 'rgba(241,236,221,0.28)',
            textTransform: 'uppercase',
          }}>
            Our story
          </p>
          <p style={{
            fontFamily: "'Marcellus', Georgia, serif",
            fontSize: 'clamp(1.4rem, 4vw, 2rem)',
            color: 'var(--kilai-cream)',
            lineHeight: 1.4,
          }}>
            Two mothers.<br />
            One quiet conviction.
          </p>
        </motion.div>

        {/* Grow house visual */}
        <motion.div {...fadeUp(0.12)}>
          <div
            className="w-full rounded-sm overflow-hidden relative"
            style={{
              height: '240px',
              background: 'linear-gradient(160deg, #0e2a18 0%, #14442C 50%, #1a3a20 100%)',
            }}
          >
            <div className="absolute inset-0 flex items-end justify-center pb-6 gap-3">
              {Array.from({ length: 18 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: '2px',
                    height: `${40 + Math.sin(i * 0.8) * 28 + (i % 3) * 12}px`,
                    background: i % 5 === 0 ? 'var(--kilai-bright)' : 'var(--kilai-sprout)',
                    opacity: 0.35 + (i % 4) * 0.12,
                    borderRadius: '2px',
                    transform: `rotate(${(i % 3 - 1) * 5}deg)`,
                  }}
                />
              ))}
            </div>
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(10,29,20,0.7) 0%, transparent 50%)' }}
            />
            <p style={{
              position: 'absolute',
              bottom: '16px',
              left: '20px',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '0.6rem',
              color: 'rgba(241,236,221,0.3)',
              letterSpacing: '0.1em',
            }}>
              The grow house, Bengaluru
            </p>
          </div>
        </motion.div>

        {/* Origin story */}
        <motion.div {...fadeUp(0.22)} className="flex flex-col gap-5">
          <p style={{
            fontFamily: "'Hanken Grotesk', sans-serif",
            fontWeight: 300,
            fontSize: '0.97rem',
            color: 'rgba(241,236,221,0.72)',
            lineHeight: 1.9,
          }}>
            It started in a kitchen, not a boardroom. Two mothers — watching their children push away vegetables,
            watching the colour drain from food that travelled too far, too fast — began asking a question
            their grandmothers never had to:{' '}
            <em style={{ color: 'var(--kilai-cream)' }}>why has the food forgotten what it is?</em>
          </p>
          <p style={{
            fontFamily: "'Hanken Grotesk', sans-serif",
            fontWeight: 300,
            fontSize: '0.97rem',
            color: 'rgba(241,236,221,0.72)',
            lineHeight: 1.9,
          }}>
            They thought back to how their ancestors ate — millets soaked overnight, greens pulled fresh from the yard,
            food grown close to the body and offered like a ritual. Not a transaction. A relationship.
          </p>
        </motion.div>

        {/* Divider */}
        <motion.div {...fadeUp(0.3)}>
          <div style={{ width: '48px', height: '1px', background: 'rgba(168,201,138,0.2)' }} />
        </motion.div>

        {/* The turn */}
        <motion.div {...fadeUp(0.35)} className="flex flex-col gap-5">
          <p style={{
            fontFamily: "'Hanken Grotesk', sans-serif",
            fontWeight: 300,
            fontSize: '0.97rem',
            color: 'rgba(241,236,221,0.72)',
            lineHeight: 1.9,
          }}>
            So they cleared a room. Built shelves from wood. Failed at radish twice before understanding
            what the seed needed. Failed at sunflower once before understanding what the soil needed.
            And slowly — tray by tray — something grew that their children actually reached for.
          </p>
          <p style={{
            fontFamily: "'Hanken Grotesk', sans-serif",
            fontWeight: 300,
            fontSize: '0.97rem',
            color: 'rgba(241,236,221,0.72)',
            lineHeight: 1.9,
          }}>
            That room became Kilai. Not a farm, not a startup — a grow house run by two mothers
            who believe the most radical thing you can do for your family is grow their food
            with your own hands.
          </p>
        </motion.div>

        {/* Pull quote */}
        <motion.div {...fadeUp(0.42)} className="flex flex-col gap-3 pl-4" style={{ borderLeft: '2px solid rgba(168,201,138,0.22)' }}>
          <p style={{
            fontFamily: "'Marcellus', Georgia, serif",
            fontSize: '1.05rem',
            color: 'var(--kilai-cream)',
            lineHeight: 1.65,
          }}>
            "Food is the first medicine. Our ancestors knew it. We just needed our children
            to remind us."
          </p>
          <p style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '0.62rem',
            color: 'rgba(241,236,221,0.28)',
            letterSpacing: '0.1em',
          }}>
            — The founders, Bengaluru
          </p>
        </motion.div>

        {/* What drives them */}
        <motion.div {...fadeUp(0.48)}>
          <p style={{
            fontFamily: "'Hanken Grotesk', sans-serif",
            fontWeight: 300,
            fontSize: '0.97rem',
            color: 'rgba(241,236,221,0.72)',
            lineHeight: 1.9,
          }}>
            Every tray that leaves our grow house carries the same intention — that the family
            receiving it knows exactly who grew it, how it was grown, and why it matters.
            No labels. No miles. No mystery. Just a living tray, grown like a prayer,
            delivered to your door.
          </p>
        </motion.div>

        {/* Bottom spacer */}
        <div style={{ height: '24px' }} />
      </div>
    </div>
  );
}
