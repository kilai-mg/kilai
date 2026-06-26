import { motion, useReducedMotion } from 'framer-motion';

const growSteps = [
  { day: 'Day 1', label: 'The seed rests', desc: 'Tiny and dry, it holds everything it will ever become. We soak it in water overnight.', height: 8 },
  { day: 'Day 2', label: 'The shell cracks', desc: "Overnight, a tiny root reaches down into the soil. It's looking for water.", height: 16 },
  { day: 'Day 3-4', label: 'The shoot rises', desc: 'A pale green stem pushes upward, searching for light. It can grow 1 cm in a single day.', height: 28 },
  { day: 'Day 5-7', label: 'Leaves unfurl', desc: 'The first two leaves open like tiny hands. This is when the colour deepens and the flavour arrives.', height: 44 },
  { day: 'Day 9', label: 'Ready for you', desc: 'Full of flavour and still growing. We harvest it by hand at dawn and it travels to your home the same day.', height: 60 },
];

const faqs = [
  {
    q: 'Why does it grow so fast?',
    a: "Microgreens use all the energy stored in the seed to sprout quickly. They don't need much — just water, a little warmth, and light. It's like the seed is in a hurry to become something.",
  },
  {
    q: 'Can I eat it straight from the tray?',
    a: "Yes. Snip a small bunch with clean scissors, rinse it gently, and eat. No cooking needed — it's meant to be eaten fresh, just like that.",
  },
  {
    q: 'Will it keep growing after I cut it?',
    a: "A little bit, yes. New shoots will appear from the same spot over the next few days. It's like a slow, quiet gift that keeps giving.",
  },
];

interface KidsSectionProps {
  onOpenAdoption: (variety: string) => void;
}

export function KidsSection({ onOpenAdoption }: KidsSectionProps) {
  const prefersReduced = useReducedMotion();

  const fadeUp = (delay: number) =>
    prefersReduced
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3 } }
      : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } };

  return (
    <div
      className="w-full h-full overflow-y-auto"
      style={{ background: 'var(--kilai-bg)', scrollbarWidth: 'none' }}
    >
      <div className="max-w-xl mx-auto px-6 py-16 flex flex-col gap-14">

        {/* Header */}
        <motion.div {...fadeUp(0)} className="flex flex-col gap-3">
          <p style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '0.6rem',
            letterSpacing: '0.22em',
            color: 'rgba(241,236,221,0.28)',
            textTransform: 'uppercase',
          }}>
            For young growers
          </p>
          <p style={{
            fontFamily: "'Marcellus', Georgia, serif",
            fontSize: 'clamp(1.4rem, 4vw, 2rem)',
            color: 'var(--kilai-cream)',
            lineHeight: 1.4,
          }}>
            Grow your first tray.
          </p>
          <p style={{
            fontFamily: "'Hanken Grotesk', sans-serif",
            fontWeight: 300,
            fontSize: '0.9rem',
            color: 'rgba(241,236,221,0.55)',
            lineHeight: 1.75,
          }}>
            A seed knows what to do. You just have to give it water, light, and a little patience.
            In nine days, something that fits in your palm becomes something you can eat.
          </p>
        </motion.div>

        {/* 9-day illustrated journey */}
        <motion.div {...fadeUp(0.15)} className="flex flex-col gap-4">
          <p style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '0.62rem',
            letterSpacing: '0.14em',
            color: 'rgba(241,236,221,0.3)',
            textTransform: 'uppercase',
          }}>
            The 9-day journey
          </p>

          <div
            className="rounded-sm p-6 flex flex-col gap-0"
            style={{ background: 'rgba(20,68,44,0.2)', border: '1px solid rgba(168,201,138,0.1)' }}
          >
            {growSteps.map((step, i) => (
              <div key={i} className="flex gap-4 items-start" style={{ paddingBottom: i < growSteps.length - 1 ? '20px' : '0' }}>
                {/* Visual column */}
                <div className="flex flex-col items-center flex-shrink-0" style={{ width: '40px' }}>
                  {/* Sprout illustration */}
                  <div
                    className="relative flex items-end justify-center"
                    style={{ height: '64px', width: '24px' }}
                  >
                    {/* Stem */}
                    <div style={{
                      width: '2px',
                      height: `${step.height}px`,
                      background: 'var(--kilai-sprout)',
                      opacity: 0.7,
                      borderRadius: '2px',
                      position: 'absolute',
                      bottom: 0,
                    }} />
                    {/* Leaves at top if tall enough */}
                    {step.height > 20 && (
                      <>
                        <div style={{
                          width: `${step.height * 0.4}px`,
                          height: '2px',
                          background: 'var(--kilai-sprout)',
                          opacity: 0.55,
                          borderRadius: '2px',
                          position: 'absolute',
                          bottom: step.height - 6,
                          left: '12px',
                          transform: 'rotate(-35deg)',
                          transformOrigin: 'left center',
                        }} />
                        <div style={{
                          width: `${step.height * 0.35}px`,
                          height: '2px',
                          background: 'var(--kilai-sprout)',
                          opacity: 0.55,
                          borderRadius: '2px',
                          position: 'absolute',
                          bottom: step.height - 10,
                          right: '12px',
                          transform: 'rotate(35deg)',
                          transformOrigin: 'right center',
                        }} />
                      </>
                    )}
                  </div>
                  {/* Connector */}
                  {i < growSteps.length - 1 && (
                    <div style={{ width: '1px', height: '20px', background: 'rgba(168,201,138,0.15)', marginTop: '4px' }} />
                  )}
                </div>

                {/* Text */}
                <div className="flex flex-col gap-1 pt-1">
                  <div className="flex items-center gap-2">
                    <span style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: '0.6rem',
                      color: 'var(--kilai-sprout)',
                      opacity: 0.7,
                      letterSpacing: '0.1em',
                    }}>
                      {step.day}
                    </span>
                    <span style={{
                      fontFamily: "'Marcellus', Georgia, serif",
                      fontSize: '0.88rem',
                      color: 'var(--kilai-cream)',
                    }}>
                      {step.label}
                    </span>
                  </div>
                  <p style={{
                    fontFamily: "'Hanken Grotesk', sans-serif",
                    fontWeight: 300,
                    fontSize: '0.78rem',
                    color: 'rgba(241,236,221,0.45)',
                    lineHeight: 1.6,
                  }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Mini-adopt card */}
        <motion.div {...fadeUp(0.3)} className="flex flex-col gap-4">
          <p style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '0.62rem',
            letterSpacing: '0.14em',
            color: 'rgba(241,236,221,0.3)',
            textTransform: 'uppercase',
          }}>
            Your first tray
          </p>

          <div
            className="rounded-sm overflow-hidden"
            style={{ border: '1px solid rgba(168,201,138,0.18)', background: 'rgba(20,68,44,0.25)' }}
          >
            {/* Tray visual */}
            <div
              className="relative flex items-end justify-around pb-3 px-4"
              style={{
                height: '120px',
                background: 'linear-gradient(135deg, #1a4a3a 0%, #2a5a3a 100%)',
              }}
            >
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} style={{
                  width: '2px',
                  height: `${22 + Math.sin(i * 1.1) * 10 + (i % 3) * 6}px`,
                  background: 'var(--kilai-bright)',
                  opacity: 0.5,
                  borderRadius: '2px',
                  transform: `rotate(${(i % 3 - 1) * 6}deg)`,
                }} />
              ))}
            </div>

            <div className="p-5 flex flex-col gap-3">
              <p style={{
                fontFamily: "'Marcellus', Georgia, serif",
                fontSize: '1.1rem',
                color: 'var(--kilai-cream)',
              }}>
                Pea — for first-time growers
              </p>
              <p style={{
                fontFamily: "'Hanken Grotesk', sans-serif",
                fontWeight: 300,
                fontStyle: 'italic',
                fontSize: '0.8rem',
                color: 'rgba(241,236,221,0.45)',
              }}>
                Sweet, tender, and easy to grow. The kindest tray for a beginner.
              </p>
              <div className="flex items-center justify-between">
                <p style={{
                  fontFamily: "'Marcellus', Georgia, serif",
                  fontSize: '1rem',
                  color: 'var(--kilai-sprout)',
                }}>
                  ₹600
                </p>
                <button
                  data-testid="button-kids-adopt"
                  style={{
                    fontFamily: "'Marcellus', Georgia, serif",
                    fontSize: '0.8rem',
                    color: 'var(--kilai-cream)',
                    background: 'transparent',
                    border: '1px solid rgba(168,201,138,0.25)',
                    borderRadius: '2px',
                    padding: '6px 16px',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(168,201,138,0.5)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(168,201,138,0.25)')}
                  onClick={() => onOpenAdoption('Peas')}
                >
                  Pick this tray
                </button>
              </div>
              {/* TODO: age-specific kit once sourcing is ready */}
            </div>
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div {...fadeUp(0.4)} className="flex flex-col gap-5">
          <p style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '0.62rem',
            letterSpacing: '0.14em',
            color: 'rgba(241,236,221,0.3)',
            textTransform: 'uppercase',
          }}>
            Questions young growers ask
          </p>
          {faqs.map((faq, i) => (
            <div key={i} className="flex flex-col gap-2">
              <p style={{
                fontFamily: "'Marcellus', Georgia, serif",
                fontSize: '0.92rem',
                color: 'var(--kilai-cream)',
                lineHeight: 1.5,
              }}>
                {faq.q}
              </p>
              <p style={{
                fontFamily: "'Hanken Grotesk', sans-serif",
                fontWeight: 300,
                fontSize: '0.82rem',
                color: 'rgba(241,236,221,0.5)',
                lineHeight: 1.7,
              }}>
                {faq.a}
              </p>
              {i < faqs.length - 1 && (
                <div style={{ height: '1px', background: 'rgba(168,201,138,0.07)', marginTop: '8px' }} />
              )}
            </div>
          ))}
        </motion.div>

        <div style={{ height: '24px' }} />
      </div>
    </div>
  );
}
