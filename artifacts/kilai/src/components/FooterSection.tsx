import { motion, useReducedMotion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

const WHATSAPP_NUMBER = '8754336384'; // replace with Kilai's actual WhatsApp number (91 + 10-digit mobile)

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

        {/* WhatsApp CTA — prominent */}
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="link-whatsapp"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            background: 'rgba(37,211,102,0.12)',
            border: '1px solid rgba(37,211,102,0.35)',
            borderRadius: '8px',
            textDecoration: 'none',
            transition: 'background 0.2s, border-color 0.2s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(37,211,102,0.2)';
            (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(37,211,102,0.6)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(37,211,102,0.12)';
            (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(37,211,102,0.35)';
          }}
        >
          <MessageCircle size={16} color="rgba(37,211,102,0.9)" strokeWidth={1.5} />
          <span style={{
            fontFamily: "'Hanken Grotesk', sans-serif",
            fontWeight: 400,
            fontSize: '0.85rem',
            color: 'rgba(37,211,102,0.9)',
            letterSpacing: '0.02em',
          }}>
            Chat with us on WhatsApp
          </span>
        </a>

        {/* Secondary nav links */}
        <div
          className="flex items-center gap-3"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '0.6rem',
            letterSpacing: '0.08em',
            color: 'rgba(241,236,221,0.25)',
          }}
        >
          <button
            onClick={() => onNavigate(1)}
            data-testid="link-my-tray"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontFamily: 'inherit', fontSize: 'inherit', letterSpacing: 'inherit', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(168,201,138,0.6)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(241,236,221,0.25)')}
          >
            Adopt a tray
          </button>
          <span style={{ opacity: 0.4 }}>·</span>
          <button
            onClick={() => onNavigate(4)}
            data-testid="link-the-vow"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontFamily: 'inherit', fontSize: 'inherit', letterSpacing: 'inherit', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(168,201,138,0.6)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(241,236,221,0.25)')}
          >
            The vow
          </button>
        </div>
      </motion.div>
    </div>
  );
}
