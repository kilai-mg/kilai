import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRequestOtp, useVerifyOtp } from '@workspace/api-client-react';
import type { AuthUser } from '@workspace/api-client-react';

interface SignInProps {
  onSuccess: (user: AuthUser) => void;
  onClose: () => void;
}

type Step = 'phone' | 'otp';

export function SignIn({ onSuccess, onClose }: SignInProps) {
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { mutateAsync: requestOtp, isPending: isRequestingOtp } = useRequestOtp();
  const { mutateAsync: verifyOtp, isPending: isVerifyingOtp } = useVerifyOtp();

  async function handleRequestOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const cleaned = phone.trim().replace(/\s+/g, '');
    if (cleaned.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    try {
      const res = await requestOtp({ data: { phone: cleaned } });
      if (res.devOtp) setDevOtp(res.devOtp);
      setStep('otp');
    } catch {
      setError('Could not send OTP. Please try again.');
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (otp.length !== 6) {
      setError('Enter the 6-digit OTP');
      return;
    }
    try {
      const user = await verifyOtp({ data: { phone: phone.trim(), code: otp } });
      onSuccess(user);
    } catch {
      setError('Invalid or expired OTP. Try again.');
    }
  }

  const slideVariants = {
    enter: { x: 40, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -40, opacity: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(8,15,10,0.88)', backdropFilter: 'blur(8px)' }}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        className="w-full sm:max-w-sm"
        style={{
          background: '#0f1d15',
          border: '1px solid rgba(168,201,138,0.12)',
          borderRadius: '20px 20px 0 0',
          padding: '36px 28px 40px',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.58rem', color: 'var(--kilai-sprout)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '4px' }}>
              {step === 'phone' ? 'Sign in' : 'Verify'}
            </p>
            <p style={{ fontFamily: "'Marcellus', serif", fontSize: '1.25rem', color: 'var(--kilai-cream)' }}>
              {step === 'phone' ? 'Enter your number' : 'Enter the code'}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(241,236,221,0.3)', fontSize: '1.4rem', lineHeight: 1, padding: '4px' }}
          >
            ×
          </button>
        </div>

        <AnimatePresence mode="wait">
          {step === 'phone' ? (
            <motion.form
              key="phone-step"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onSubmit={handleRequestOtp}
            >
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.6rem', color: 'rgba(168,201,138,0.65)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '10px' }}>
                  Mobile number
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.88rem', color: 'rgba(241,236,221,0.5)', padding: '12px 0' }}>+91</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="98765 43210"
                    maxLength={10}
                    autoFocus
                    style={{
                      flex: 1,
                      background: 'rgba(168,201,138,0.06)',
                      border: '1px solid rgba(168,201,138,0.18)',
                      borderRadius: '10px',
                      padding: '12px 14px',
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: '1rem',
                      color: 'var(--kilai-cream)',
                      letterSpacing: '0.08em',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {error && (
                <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.62rem', color: '#e08080', marginBottom: '14px' }}>{error}</p>
              )}

              <button
                type="submit"
                disabled={isRequestingOtp || phone.length < 10}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: phone.length >= 10 ? 'var(--kilai-sprout)' : 'rgba(168,201,138,0.15)',
                  color: phone.length >= 10 ? '#0a1d14' : 'rgba(168,201,138,0.4)',
                  border: 'none',
                  borderRadius: '12px',
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  cursor: phone.length >= 10 ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s',
                  letterSpacing: '0.02em',
                }}
              >
                {isRequestingOtp ? 'Sending…' : 'Send OTP →'}
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="otp-step"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onSubmit={handleVerifyOtp}
            >
              <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.62rem', color: 'rgba(168,201,138,0.55)', marginBottom: '20px' }}>
                Sent to +91 {phone}
              </p>

              {devOtp && (
                <div style={{ background: 'rgba(168,201,138,0.08)', border: '1px solid rgba(168,201,138,0.18)', borderRadius: '10px', padding: '10px 14px', marginBottom: '20px' }}>
                  <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.58rem', color: 'rgba(168,201,138,0.55)', marginBottom: '4px' }}>DEV MODE — your OTP:</p>
                  <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '1.4rem', color: 'var(--kilai-sprout)', letterSpacing: '0.3em', fontWeight: 300 }}>{devOtp}</p>
                </div>
              )}

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.6rem', color: 'rgba(168,201,138,0.65)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '10px' }}>
                  6-digit code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="_ _ _ _ _ _"
                  maxLength={6}
                  autoFocus
                  style={{
                    width: '100%',
                    background: 'rgba(168,201,138,0.06)',
                    border: '1px solid rgba(168,201,138,0.18)',
                    borderRadius: '10px',
                    padding: '14px',
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '1.6rem',
                    color: 'var(--kilai-cream)',
                    letterSpacing: '0.5em',
                    outline: 'none',
                    textAlign: 'center',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {error && (
                <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.62rem', color: '#e08080', marginBottom: '14px' }}>{error}</p>
              )}

              <button
                type="submit"
                disabled={isVerifyingOtp || otp.length !== 6}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: otp.length === 6 ? 'var(--kilai-sprout)' : 'rgba(168,201,138,0.15)',
                  color: otp.length === 6 ? '#0a1d14' : 'rgba(168,201,138,0.4)',
                  border: 'none',
                  borderRadius: '12px',
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  cursor: otp.length === 6 ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s',
                  letterSpacing: '0.02em',
                }}
              >
                {isVerifyingOtp ? 'Verifying…' : 'Verify & Sign in →'}
              </button>

              <button
                type="button"
                onClick={() => { setStep('phone'); setOtp(''); setError(null); }}
                style={{ width: '100%', marginTop: '12px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.62rem', color: 'rgba(241,236,221,0.3)', letterSpacing: '0.1em' }}
              >
                ← Change number
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
