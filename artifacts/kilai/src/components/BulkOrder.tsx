import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useCreateBulkInquiry } from '@workspace/api-client-react';

const contexts = [
  { label: 'Cafes & restaurants', icon: '○' },
  { label: 'Yoga & wellness studios', icon: '○' },
  { label: 'Corporate offices', icon: '○' },
  { label: 'Events & celebrations', icon: '○' },
];

export function BulkOrder() {
  const prefersReduced = useReducedMotion();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', quantity: '', occasion: '' });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { mutateAsync: submit, isPending } = useCreateBulkInquiry();

  const fadeUp = (delay: number) =>
    prefersReduced
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3 } }
      : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } };

  const inputStyle = {
    width: '100%',
    background: 'rgba(20,68,44,0.25)',
    border: '1px solid rgba(168,201,138,0.15)',
    borderRadius: '2px',
    padding: '12px 14px',
    fontFamily: "'Hanken Grotesk', sans-serif",
    fontWeight: 300,
    fontSize: '0.9rem',
    color: 'var(--kilai-cream)',
    outline: 'none',
    transition: 'border-color 0.2s',
  } as React.CSSProperties;

  const labelStyle = {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: '0.62rem',
    letterSpacing: '0.12em',
    color: 'rgba(241,236,221,0.35)',
    textTransform: 'uppercase' as const,
    display: 'block',
    marginBottom: '6px',
  };

  return (
    <div
      className="w-full h-full overflow-y-auto"
      style={{ background: 'var(--kilai-bg)', scrollbarWidth: 'none' }}
    >
      <div className="max-w-lg mx-auto px-6 py-16 flex flex-col gap-10">

        {/* Header */}
        <motion.div {...fadeUp(0)} className="flex flex-col gap-3">
          <p style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '0.6rem',
            letterSpacing: '0.22em',
            color: 'rgba(241,236,221,0.28)',
            textTransform: 'uppercase',
          }}>
            Bulk & gifting
          </p>
          <p style={{
            fontFamily: "'Marcellus', Georgia, serif",
            fontSize: 'clamp(1.3rem, 4vw, 1.9rem)',
            color: 'var(--kilai-cream)',
            lineHeight: 1.4,
          }}>
            Trays for your table —
            <br />and theirs.
          </p>
          <p style={{
            fontFamily: "'Hanken Grotesk', sans-serif",
            fontWeight: 300,
            fontSize: '0.88rem',
            color: 'rgba(241,236,221,0.5)',
            lineHeight: 1.7,
          }}>
            If you'd like to bring Kilai to a table larger than one, we would love to talk.
            No catalogues, no pricing tiers — just a conversation about what you need.
          </p>
        </motion.div>

        {/* Context tags */}
        <motion.div {...fadeUp(0.15)} className="flex flex-wrap gap-2">
          {contexts.map((c) => (
            <span
              key={c.label}
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '0.65rem',
                color: 'rgba(168,201,138,0.6)',
                border: '1px solid rgba(168,201,138,0.18)',
                borderRadius: '2px',
                padding: '4px 10px',
                letterSpacing: '0.06em',
              }}
            >
              {c.label}
            </span>
          ))}
        </motion.div>

        {/* Form or Confirmation */}
        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="thanks"
              initial={{ opacity: 0, y: prefersReduced ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-4 p-8 rounded-sm text-center"
              style={{ background: 'rgba(20,68,44,0.3)', border: '1px solid rgba(168,201,138,0.18)' }}
            >
              <p style={{
                fontFamily: "'Marcellus', Georgia, serif",
                fontSize: '1.1rem',
                color: 'var(--kilai-cream)',
                lineHeight: 1.6,
              }}>
                Your note reached us.
              </p>
              <p style={{
                fontFamily: "'Hanken Grotesk', sans-serif",
                fontWeight: 300,
                fontSize: '0.85rem',
                color: 'rgba(241,236,221,0.5)',
                lineHeight: 1.7,
              }}>
                We'll reach out personally — give us a day or two.
                Good things shouldn't be rushed.
              </p>
            </motion.div>
          ) : (
            <motion.div key="form" {...fadeUp(0.25)} className="flex flex-col gap-6">
              <div>
                <label style={labelStyle}>Your name</label>
                <input
                  type="text"
                  placeholder="How shall we address you?"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  data-testid="input-bulk-name"
                  style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(168,201,138,0.4)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(168,201,138,0.15)')}
                />
              </div>
              <div>
                <label style={labelStyle}>Your WhatsApp number</label>
                <input
                  type="tel"
                  placeholder="We'll reply on WhatsApp"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(168,201,138,0.4)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(168,201,138,0.15)')}
                />
              </div>
              <div>
                <label style={labelStyle}>How many trays?</label>
                <input
                  type="text"
                  placeholder="Roughly — we'll figure out the rest together"
                  value={form.quantity}
                  onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                  data-testid="input-bulk-quantity"
                  style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(168,201,138,0.4)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(168,201,138,0.15)')}
                />
              </div>
              <div>
                <label style={labelStyle}>What's the occasion?</label>
                <textarea
                  placeholder="A wedding, a café counter, a weekly office ritual — tell us"
                  value={form.occasion}
                  onChange={e => setForm(f => ({ ...f, occasion: e.target.value }))}
                  data-testid="input-bulk-occasion"
                  rows={3}
                  style={{ ...inputStyle, resize: 'none' }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(168,201,138,0.4)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(168,201,138,0.15)')}
                />
              </div>

              <button
                onClick={async () => {
                  if (!form.name.trim() || isPending) return;
                  setSubmitError(null);
                  try {
                    await submit({ data: { name: form.name, phone: form.phone, quantity: form.quantity, occasion: form.occasion } });
                    setSent(true);
                  } catch {
                    setSubmitError('Something went wrong. Please try again.');
                  }
                }}
                disabled={isPending || !form.name.trim()}
                data-testid="button-bulk-submit"
                style={{
                  fontFamily: "'Marcellus', Georgia, serif",
                  fontSize: '0.9rem',
                  color: isPending || !form.name.trim() ? 'rgba(241,236,221,0.3)' : 'var(--kilai-cream)',
                  background: 'rgba(20,68,44,0.5)',
                  border: '1px solid rgba(168,201,138,0.25)',
                  borderRadius: '2px',
                  padding: '13px 24px',
                  cursor: isPending || !form.name.trim() ? 'not-allowed' : 'pointer',
                  letterSpacing: '0.06em',
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(168,201,138,0.5)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(168,201,138,0.25)')}
              >
                {isPending ? 'Sending…' : 'Send us a note'}
              </button>
              {submitError && (
                <p style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 300, fontSize: '0.75rem', color: 'rgba(255,160,120,0.8)', textAlign: 'center' }}>
                  {submitError}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ height: '24px' }} />
      </div>
    </div>
  );
}
