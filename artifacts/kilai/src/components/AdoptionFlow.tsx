import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, Check, ChevronRight, BookOpen, Layers } from 'lucide-react';
import { VARIETY_DATA } from '@/data/trays';
import { useCreateAdoption } from '@workspace/api-client-react';

// ── Pricing ──────────────────────────────────────────────────────────────────
const ADDON_TRAY_PRICE   = 349;
const ADDON_GUIDE_PRICE  = 199;

const CATEGORY_LABEL: Record<string, string> = {
  tall:    'A · 6-Inch Grow',
  short:   'B · 2–3 Inch Grow',
  premium: 'C · Premium',
};
const CATEGORY_COLOR: Record<string, string> = {
  tall:    'rgba(168,201,138,0.65)',
  short:   'rgba(168,201,138,0.5)',
  premium: 'rgba(255,210,120,0.75)',
};

interface AdoptionFlowProps {
  preselectedVariety?: string;
  onClose: () => void;
}

type Step = 'variety' | 'addons' | 'confirm';

export function AdoptionFlow({ preselectedVariety, onClose }: AdoptionFlowProps) {
  const prefersReduced = useReducedMotion();

  const [step, setStep]               = useState<Step>('variety');
  const [selectedVariety, setVariety] = useState<string>(preselectedVariety ?? '');
  const [wantTray, setWantTray]       = useState(false);
  const [wantGuide, setWantGuide]     = useState(false);
  const [customerName, setCustomerName]   = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [done, setDone]               = useState(false);
  const [assignedTrayId, setAssignedTrayId] = useState<number | null>(null);
  const [adoptionError, setAdoptionError]   = useState<string | null>(null);

  const variety = VARIETY_DATA.find(v => v.name === selectedVariety);
  const total = (variety?.price ?? 0) + (wantTray ? ADDON_TRAY_PRICE : 0) + (wantGuide ? ADDON_GUIDE_PRICE : 0);

  const stepIndex = step === 'variety' ? 0 : step === 'addons' ? 1 : 2;

  const { mutateAsync: adopt, isPending: isAdopting } = useCreateAdoption();

  const slideVariants = prefersReduced
    ? { enter: { opacity: 0 }, center: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        enter:  { x: 40, opacity: 0 },
        center: { x: 0,  opacity: 1 },
        exit:   { x: -40, opacity: 0 },
      };

  async function handleConfirm() {
    if (!variety || !customerName.trim() || !customerPhone.trim()) return;
    setAdoptionError(null);
    try {
      const result = await adopt({
        data: {
          varietyName: variety.name,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          wantTrayAddon: wantTray,
          wantGuideAddon: wantGuide,
        },
      });
      setAssignedTrayId(result.trayId);
      setDone(true);
    } catch {
      setAdoptionError('Something went wrong. Please try again or call us.');
    }
  }

  // ── Done screen ─────────────────────────────────────────────────────────────
  if (done) {
    return (
      <Backdrop onClose={onClose}>
        <Sheet>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="flex flex-col items-center justify-center gap-6 py-10 px-6 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
              style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: 'rgba(168,201,138,0.12)',
                border: '1.5px solid rgba(168,201,138,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Check size={28} color="var(--kilai-sprout)" strokeWidth={1.5} />
            </motion.div>

            <div className="flex flex-col gap-3">
              <p style={{ fontFamily: "'Marcellus', Georgia, serif", fontSize: '1.3rem', color: 'var(--kilai-cream)', lineHeight: 1.45 }}>
                Your {selectedVariety} tray<br />is being born.
              </p>
              {assignedTrayId !== null && (
                <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.6rem', color: 'rgba(168,201,138,0.5)', letterSpacing: '0.1em' }}>
                  TRAY #{assignedTrayId}
                </p>
              )}
              <p style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 300, fontSize: '0.85rem', color: 'rgba(241,236,221,0.5)', lineHeight: 1.7 }}>
                We'll WhatsApp you within 24 hours to confirm your tray's grow date and delivery window.
              </p>
            </div>

            <div style={{
              background: 'rgba(168,201,138,0.07)', border: '1px solid rgba(168,201,138,0.15)',
              borderRadius: '6px', padding: '14px 20px', width: '100%', textAlign: 'left',
            }}>
              <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.6rem', color: 'rgba(241,236,221,0.3)', letterSpacing: '0.1em', marginBottom: '8px' }}>ORDER SUMMARY</p>
              <p style={{ fontFamily: "'Marcellus', Georgia, serif", fontSize: '0.95rem', color: 'var(--kilai-cream)', marginBottom: '4px' }}>{selectedVariety} Microgreens</p>
              {wantTray  && <p style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 300, fontSize: '0.78rem', color: 'rgba(241,236,221,0.5)' }}>+ Growing Tray   ₹{ADDON_TRAY_PRICE}</p>}
              {wantGuide && <p style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 300, fontSize: '0.78rem', color: 'rgba(241,236,221,0.5)' }}>+ Grow Kit Guide  ₹{ADDON_GUIDE_PRICE}</p>}
              <div style={{ height: '1px', background: 'rgba(168,201,138,0.12)', margin: '10px 0' }} />
              <p style={{ fontFamily: "'Marcellus', Georgia, serif", fontSize: '1rem', color: 'var(--kilai-cream)' }}>₹{total.toLocaleString('en-IN')}</p>
            </div>

            <button
              onClick={onClose}
              style={{
                fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 300,
                fontSize: '0.82rem', color: 'rgba(241,236,221,0.45)',
                background: 'transparent', border: 'none', cursor: 'pointer', letterSpacing: '0.04em',
              }}
            >
              Back to the garden
            </button>
          </motion.div>
        </Sheet>
      </Backdrop>
    );
  }

  return (
    <Backdrop onClose={onClose}>
      <Sheet>
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div className="flex gap-2 items-center">
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: i === stepIndex ? '20px' : '6px',
                height: '6px',
                borderRadius: '3px',
                background: i === stepIndex ? 'var(--kilai-sprout)' : 'rgba(168,201,138,0.2)',
                transition: 'all 0.35s ease',
              }} />
            ))}
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', color: 'rgba(241,236,221,0.35)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Step content ── */}
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          <AnimatePresence mode="wait">
            {step === 'variety' && (
              <motion.div
                key="variety"
                variants={slideVariants} initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                style={{ height: '100%', overflowY: 'auto', scrollbarWidth: 'none' }}
              >
                <VarietyPicker
                  selected={selectedVariety}
                  onSelect={setVariety}
                  onNext={() => setStep('addons')}
                />
              </motion.div>
            )}

            {step === 'addons' && (
              <motion.div
                key="addons"
                variants={slideVariants} initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                style={{ height: '100%', overflowY: 'auto', scrollbarWidth: 'none' }}
              >
                <AddonsStep
                  variety={variety}
                  wantTray={wantTray} setWantTray={setWantTray}
                  wantGuide={wantGuide} setWantGuide={setWantGuide}
                  onBack={() => setStep('variety')}
                  onNext={() => setStep('confirm')}
                />
              </motion.div>
            )}

            {step === 'confirm' && (
              <motion.div
                key="confirm"
                variants={slideVariants} initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                style={{ height: '100%', overflowY: 'auto', scrollbarWidth: 'none' }}
              >
                <ConfirmStep
                  variety={variety}
                  wantTray={wantTray}
                  wantGuide={wantGuide}
                  total={total}
                  customerName={customerName}
                  setCustomerName={setCustomerName}
                  customerPhone={customerPhone}
                  setCustomerPhone={setCustomerPhone}
                  isPending={isAdopting}
                  error={adoptionError}
                  onBack={() => setStep('addons')}
                  onConfirm={handleConfirm}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Sheet>
    </Backdrop>
  );
}

// ── Backdrop + Sheet wrappers ─────────────────────────────────────────────────

function Backdrop({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(5,14,9,0.72)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'flex-end',
      }}
    >
      <div onClick={e => e.stopPropagation()} style={{ width: '100%' }}>
        {children}
      </div>
    </motion.div>
  );
}

function Sheet({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 340, damping: 38 }}
      style={{
        background: '#0a1d14',
        border: '1px solid rgba(168,201,138,0.12)',
        borderBottom: 'none',
        borderRadius: '16px 16px 0 0',
        height: '88dvh',        /* fixed height so flex children resolve correctly */
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {children}
    </motion.div>
  );
}

// ── Step 1: Variety Picker ────────────────────────────────────────────────────

function VarietyPicker({
  selected, onSelect, onNext,
}: { selected: string; onSelect: (v: string) => void; onNext: () => void }) {
  const categories = ['tall', 'short', 'premium'] as const;

  return (
    <div className="flex flex-col px-5 pb-6 gap-5">
      <div className="flex flex-col gap-1">
        <p style={{ fontFamily: "'Marcellus', Georgia, serif", fontSize: '1.15rem', color: 'var(--kilai-cream)', lineHeight: 1.4 }}>
          What should we grow for you?
        </p>
        <p style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 300, fontSize: '0.78rem', color: 'rgba(241,236,221,0.4)' }}>
          Pick one variety to adopt.
        </p>
      </div>

      {categories.map(cat => {
        const items = VARIETY_DATA.filter(v => v.category === cat);
        return (
          <div key={cat} className="flex flex-col gap-2">
            <p style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.58rem',
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: CATEGORY_COLOR[cat],
            }}>
              {CATEGORY_LABEL[cat]}
            </p>
            <div className="flex flex-col gap-2">
              {items.map(v => {
                const isSelected = selected === v.name;
                return (
                  <motion.button
                    key={v.name}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => onSelect(v.name)}
                    style={{
                      background: isSelected ? 'rgba(168,201,138,0.1)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${isSelected ? 'rgba(168,201,138,0.4)' : 'rgba(168,201,138,0.1)'}`,
                      borderRadius: '8px',
                      padding: '10px 12px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      transition: 'all 0.2s',
                    }}
                  >
                    {/* Selection dot */}
                    <div style={{
                      width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
                      border: `1.5px solid ${isSelected ? 'var(--kilai-sprout)' : 'rgba(168,201,138,0.25)'}`,
                      background: isSelected ? 'var(--kilai-sprout)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}>
                      {isSelected && <Check size={10} color="#0a1d14" strokeWidth={2.5} />}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
                        <p style={{ fontFamily: "'Marcellus', Georgia, serif", fontSize: '0.9rem', color: 'var(--kilai-cream)' }}>
                          {v.name}
                        </p>
                        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.62rem', color: isSelected ? 'var(--kilai-sprout)' : 'rgba(168,201,138,0.5)', flexShrink: 0 }}>
                          ₹{v.price.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                        {v.nutrients.map(n => (
                          <span key={n} style={{
                            fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.47rem',
                            color: 'rgba(168,201,138,0.6)', background: 'rgba(168,201,138,0.07)',
                            border: '1px solid rgba(168,201,138,0.14)', borderRadius: '2px',
                            padding: '2px 5px', lineHeight: 1.4, whiteSpace: 'nowrap',
                          }}>
                            {n}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Next CTA */}
      <motion.button
        onClick={onNext}
        disabled={!selected}
        animate={{ opacity: selected ? 1 : 0.35 }}
        whileTap={selected ? { scale: 0.97 } : {}}
        style={{
          width: '100%', padding: '14px',
          background: selected ? 'rgba(168,201,138,0.13)' : 'rgba(168,201,138,0.04)',
          border: `1px solid ${selected ? 'rgba(168,201,138,0.35)' : 'rgba(168,201,138,0.1)'}`,
          borderRadius: '10px', cursor: selected ? 'pointer' : 'default',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          transition: 'all 0.25s',
        }}
      >
        <span style={{ fontFamily: "'Marcellus', Georgia, serif", fontSize: '0.95rem', color: 'var(--kilai-cream)' }}>
          Continue
        </span>
        <ChevronRight size={15} color="rgba(241,236,221,0.5)" />
      </motion.button>
    </div>
  );
}

// ── Step 2: Add-ons ───────────────────────────────────────────────────────────

interface VarietyInfo { name: string; price: number; nutrients: string[]; nutrientNote: string; character: string }

function AddonsStep({
  variety, wantTray, setWantTray, wantGuide, setWantGuide, onBack, onNext,
}: {
  variety: VarietyInfo | undefined;
  wantTray: boolean; setWantTray: (v: boolean) => void;
  wantGuide: boolean; setWantGuide: (v: boolean) => void;
  onBack: () => void; onNext: () => void;
}) {
  return (
    <div className="flex flex-col px-5 pb-6 gap-6">
      {/* Selected variety recap */}
      {variety && (
        <div style={{
          background: 'rgba(168,201,138,0.07)', border: '1px solid rgba(168,201,138,0.15)',
          borderRadius: '8px', padding: '12px 14px',
        }}>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.55rem', color: 'rgba(241,236,221,0.3)', letterSpacing: '0.1em', marginBottom: '4px' }}>YOUR CHOICE</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontFamily: "'Marcellus', Georgia, serif", fontSize: '1rem', color: 'var(--kilai-cream)' }}>{variety.name}</p>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.68rem', color: 'var(--kilai-sprout)' }}>₹{variety.price.toLocaleString('en-IN')}</p>
          </div>
          <p style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 300, fontSize: '0.75rem', color: 'rgba(241,236,221,0.38)', marginTop: '2px', fontStyle: 'italic' }}>{variety.character}</p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <p style={{ fontFamily: "'Marcellus', Georgia, serif", fontSize: '1.15rem', color: 'var(--kilai-cream)', lineHeight: 1.4 }}>
          Make it yours.
        </p>
        <p style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 300, fontSize: '0.78rem', color: 'rgba(241,236,221,0.4)' }}>
          Optional add-ons — no pressure.
        </p>
      </div>

      {/* Addon: Tray */}
      <AddonToggle
        icon={<Layers size={20} strokeWidth={1.4} color="var(--kilai-sprout)" />}
        title="Include a Growing Tray"
        description="A re-usable coco-peat tray so you can keep growing at home after delivery. Ready to plant in 10 minutes."
        price={ADDON_TRAY_PRICE}
        active={wantTray}
        onToggle={() => setWantTray(!wantTray)}
      />

      {/* Addon: Guide */}
      <AddonToggle
        icon={<BookOpen size={20} strokeWidth={1.4} color="var(--kilai-sprout)" />}
        title="Grow Kit Guide"
        description="A printed booklet: watering schedule, light guide, harvest tips and recipes for each of the 18 varieties we grow."
        price={ADDON_GUIDE_PRICE}
        active={wantGuide}
        onToggle={() => setWantGuide(!wantGuide)}
      />

      {/* Navigation */}
      <div className="flex gap-3 mt-2">
        <button
          onClick={onBack}
          style={{
            flex: '0 0 auto', padding: '13px 18px',
            background: 'transparent', border: '1px solid rgba(168,201,138,0.15)',
            borderRadius: '10px', cursor: 'pointer',
            fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.65rem',
            color: 'rgba(241,236,221,0.38)', letterSpacing: '0.05em',
          }}
        >
          ← Back
        </button>
        <motion.button
          onClick={onNext}
          whileTap={{ scale: 0.97 }}
          style={{
            flex: 1, padding: '13px',
            background: 'rgba(168,201,138,0.13)', border: '1px solid rgba(168,201,138,0.32)',
            borderRadius: '10px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}
        >
          <span style={{ fontFamily: "'Marcellus', Georgia, serif", fontSize: '0.95rem', color: 'var(--kilai-cream)' }}>Review order</span>
          <ChevronRight size={15} color="rgba(241,236,221,0.5)" />
        </motion.button>
      </div>
    </div>
  );
}

function AddonToggle({ icon, title, description, price, active, onToggle }: {
  icon: React.ReactNode; title: string; description: string;
  price: number; active: boolean; onToggle: () => void;
}) {
  return (
    <motion.button
      onClick={onToggle}
      whileTap={{ scale: 0.99 }}
      style={{
        background: active ? 'rgba(168,201,138,0.1)' : 'rgba(255,255,255,0.025)',
        border: `1px solid ${active ? 'rgba(168,201,138,0.38)' : 'rgba(168,201,138,0.1)'}`,
        borderRadius: '10px', padding: '14px', cursor: 'pointer',
        textAlign: 'left', display: 'flex', gap: '12px', alignItems: 'flex-start',
        transition: 'all 0.22s',
      }}
    >
      {/* Icon */}
      <div style={{
        width: '40px', height: '40px', borderRadius: '8px', flexShrink: 0,
        background: active ? 'rgba(168,201,138,0.15)' : 'rgba(168,201,138,0.07)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.22s',
      }}>
        {icon}
      </div>

      {/* Text */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
          <p style={{ fontFamily: "'Marcellus', Georgia, serif", fontSize: '0.9rem', color: 'var(--kilai-cream)', lineHeight: 1.3 }}>{title}</p>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.65rem', color: active ? 'var(--kilai-sprout)' : 'rgba(168,201,138,0.5)', flexShrink: 0 }}>+₹{price}</p>
        </div>
        <p style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 300, fontSize: '0.76rem', color: 'rgba(241,236,221,0.42)', lineHeight: 1.65, marginTop: '4px' }}>{description}</p>
      </div>

      {/* Toggle indicator */}
      <div style={{
        width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
        border: `1.5px solid ${active ? 'var(--kilai-sprout)' : 'rgba(168,201,138,0.25)'}`,
        background: active ? 'var(--kilai-sprout)' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.22s',
      }}>
        {active && <Check size={12} color="#0a1d14" strokeWidth={2.5} />}
      </div>
    </motion.button>
  );
}

// ── Step 3: Confirm ───────────────────────────────────────────────────────────

function ConfirmStep({ variety, wantTray, wantGuide, total, customerName, setCustomerName, customerPhone, setCustomerPhone, isPending, error, onBack, onConfirm }: {
  variety: VarietyInfo | undefined;
  wantTray: boolean; wantGuide: boolean;
  total: number;
  customerName: string; setCustomerName: (v: string) => void;
  customerPhone: string; setCustomerPhone: (v: string) => void;
  isPending: boolean; error: string | null;
  onBack: () => void; onConfirm: () => void;
}) {
  const canSubmit = customerName.trim().length > 0 && customerPhone.trim().length > 0 && !isPending;

  return (
    <div className="flex flex-col px-5 pb-6 gap-6">
      <div className="flex flex-col gap-1">
        <p style={{ fontFamily: "'Marcellus', Georgia, serif", fontSize: '1.15rem', color: 'var(--kilai-cream)', lineHeight: 1.4 }}>
          Your tray is ready to be born.
        </p>
        <p style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 300, fontSize: '0.78rem', color: 'rgba(241,236,221,0.4)' }}>
          Review before we begin growing.
        </p>
      </div>

      {/* Order card */}
      <div style={{
        background: 'rgba(168,201,138,0.06)', border: '1px solid rgba(168,201,138,0.15)',
        borderRadius: '10px', overflow: 'hidden',
      }}>
        {/* Variety row */}
        <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(168,201,138,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.55rem', color: 'rgba(241,236,221,0.28)', letterSpacing: '0.1em', marginBottom: '4px' }}>MICROGREENS</p>
              <p style={{ fontFamily: "'Marcellus', Georgia, serif", fontSize: '1rem', color: 'var(--kilai-cream)' }}>{variety?.name ?? '—'}</p>
              <p style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 300, fontSize: '0.73rem', color: 'rgba(241,236,221,0.4)', fontStyle: 'italic', marginTop: '2px' }}>{variety?.character}</p>
            </div>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.72rem', color: 'var(--kilai-sprout)' }}>₹{variety?.price.toLocaleString('en-IN')}</p>
          </div>
          {/* Nutrients */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
            {variety?.nutrients.map(n => (
              <span key={n} style={{
                fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.47rem',
                color: 'rgba(168,201,138,0.6)', background: 'rgba(168,201,138,0.07)',
                border: '1px solid rgba(168,201,138,0.14)', borderRadius: '2px',
                padding: '2px 5px', lineHeight: 1.4,
              }}>{n}</span>
            ))}
          </div>
        </div>

        {/* Add-ons */}
        {(wantTray || wantGuide) && (
          <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(168,201,138,0.08)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.55rem', color: 'rgba(241,236,221,0.28)', letterSpacing: '0.1em', marginBottom: '2px' }}>ADD-ONS</p>
            {wantTray && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 300, fontSize: '0.82rem', color: 'rgba(241,236,221,0.65)' }}>Growing Tray</p>
                <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.65rem', color: 'rgba(168,201,138,0.65)' }}>+₹{ADDON_TRAY_PRICE}</p>
              </div>
            )}
            {wantGuide && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 300, fontSize: '0.82rem', color: 'rgba(241,236,221,0.65)' }}>Grow Kit Guide</p>
                <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.65rem', color: 'rgba(168,201,138,0.65)' }}>+₹{ADDON_GUIDE_PRICE}</p>
              </div>
            )}
          </div>
        )}

        {/* Total */}
        <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 300, fontSize: '0.82rem', color: 'rgba(241,236,221,0.45)' }}>Total</p>
          <p style={{ fontFamily: "'Marcellus', Georgia, serif", fontSize: '1.15rem', color: 'var(--kilai-cream)' }}>₹{total.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Customer details */}
      <div className="flex flex-col gap-3">
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.55rem', color: 'rgba(241,236,221,0.28)', letterSpacing: '0.1em' }}>YOUR DETAILS</p>
        <input
          type="text"
          placeholder="Your name"
          value={customerName}
          onChange={e => setCustomerName(e.target.value)}
          style={{
            width: '100%', padding: '12px 14px',
            background: 'rgba(168,201,138,0.05)', border: '1px solid rgba(168,201,138,0.2)',
            borderRadius: '8px', outline: 'none',
            fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 300, fontSize: '0.88rem',
            color: 'var(--kilai-cream)',
          }}
        />
        <input
          type="tel"
          placeholder="WhatsApp number"
          value={customerPhone}
          onChange={e => setCustomerPhone(e.target.value)}
          style={{
            width: '100%', padding: '12px 14px',
            background: 'rgba(168,201,138,0.05)', border: '1px solid rgba(168,201,138,0.2)',
            borderRadius: '8px', outline: 'none',
            fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.88rem',
            color: 'var(--kilai-cream)',
          }}
        />
      </div>

      {/* Delivery note */}
      <p style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 300, fontSize: '0.76rem', color: 'rgba(241,236,221,0.35)', lineHeight: 1.65, textAlign: 'center' }}>
        We'll WhatsApp you within 24 hours to confirm your tray's grow date.<br />Fresh harvest delivered to your door on Day 9.
      </p>

      {/* CTAs */}
      <div className="flex flex-col gap-3">
        <motion.button
          onClick={onConfirm}
          disabled={!canSubmit}
          whileTap={canSubmit ? { scale: 0.97 } : undefined}
          animate={canSubmit ? { boxShadow: ['0 0 0px rgba(168,201,138,0)', '0 0 18px 4px rgba(168,201,138,0.16)', '0 0 0px rgba(168,201,138,0)'] } : undefined}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: '100%', padding: '15px',
            background: canSubmit ? 'rgba(168,201,138,0.16)' : 'rgba(168,201,138,0.06)',
            border: `1px solid ${canSubmit ? 'rgba(168,201,138,0.38)' : 'rgba(168,201,138,0.15)'}`,
            borderRadius: '10px', cursor: canSubmit ? 'pointer' : 'not-allowed',
            fontFamily: "'Marcellus', Georgia, serif", fontSize: '1rem',
            color: canSubmit ? 'var(--kilai-cream)' : 'rgba(241,236,221,0.3)',
            letterSpacing: '0.03em',
            transition: 'all 0.2s',
          }}
        >
          {isPending ? 'Adopting…' : 'Adopt this tray'}
        </motion.button>
        {error && (
          <p style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 300, fontSize: '0.73rem', color: 'rgba(255,160,120,0.8)', textAlign: 'center', lineHeight: 1.5 }}>
            {error}
          </p>
        )}
        <button
          onClick={onBack}
          style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.65rem',
            color: 'rgba(241,236,221,0.3)', letterSpacing: '0.05em', padding: '6px',
          }}
        >
          ← Change add-ons
        </button>
      </div>
    </div>
  );
}
