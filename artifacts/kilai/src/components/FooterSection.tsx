import { motion, useReducedMotion } from 'framer-motion';

interface FooterSectionProps {
  onNavigate: (section: number) => void;
}

export function FooterSection({ onNavigate }: FooterSectionProps) {
  const prefersReduced = useReducedMotion();

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center px-6"
      style={{ background: 'var(--kilai-bg)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="flex flex-col items-center gap-5"
      >
        {/* Logo */}
        <img
          src="/kilai-logo.png"
          alt="Kilai"
          style={{ width: '48px', height: '48px', objectFit: 'contain', opacity: 0.85 }}
        />

        {/* Wordmark */}
        <p
          style={{
            fontFamily: "'Marcellus', Georgia, serif",
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            color: 'var(--kilai-cream)',
            letterSpacing: '0.28em',
          }}
        >
          KILAI
        </p>

        {/* Sanskrit */}
        <p
          style={{
            fontFamily: "'Tiro Devanagari Sanskrit', serif",
            fontSize: '0.9rem',
            color: 'rgba(241,236,221,0.35)',
            marginTop: '-8px',
          }}
        >
          अन्नं ब्रह्म
        </p>

        {/* City */}
        <p
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '0.6rem',
            letterSpacing: '0.2em',
            color: 'rgba(241,236,221,0.25)',
            textTransform: 'uppercase',
          }}
        >
          Bengaluru
        </p>

        {/* Divider */}
        <div
          style={{
            width: '60px',
            height: '1px',
            background: 'rgba(168,201,138,0.18)',
          }}
        />

        {/* Thank you */}
        <p
          style={{
            fontFamily: "'Hanken Grotesk', sans-serif",
            fontWeight: 300,
            fontSize: '0.88rem',
            color: 'rgba(241,236,221,0.5)',
            letterSpacing: '0.03em',
          }}
        >
          Thank you for growing with us.
        </p>

        {/* Links */}
        <div
          className="flex items-center gap-3"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '0.65rem',
            letterSpacing: '0.08em',
            color: 'rgba(241,236,221,0.3)',
          }}
        >
          <button
            onClick={() => onNavigate(1)}
            data-testid="link-my-tray"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'inherit',
              fontFamily: 'inherit',
              fontSize: 'inherit',
              letterSpacing: 'inherit',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(168,201,138,0.7)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(241,236,221,0.3)')}
          >
            My tray
          </button>

          <span style={{ opacity: 0.4 }}>·</span>

          <button
            onClick={() => onNavigate(4)}
            data-testid="link-the-vow"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'inherit',
              fontFamily: 'inherit',
              fontSize: 'inherit',
              letterSpacing: 'inherit',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(168,201,138,0.7)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(241,236,221,0.3)')}
          >
            The vow
          </button>

          <span style={{ opacity: 0.4 }}>·</span>

          {/* TODO: add real WhatsApp number */}
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="link-contact"
            style={{
              color: 'inherit',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(168,201,138,0.7)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(241,236,221,0.3)')}
          >
            Contact
          </a>
        </div>
      </motion.div>
    </div>
  );
}
