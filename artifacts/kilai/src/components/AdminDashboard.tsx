import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  useAdminGetStats,
  useAdminListAdoptions,
  useAdminListTrays,
  useAdminListBulkInquiries,
  useAdminUpdateAdoptionStatus,
  useAdminUpdateTrayStatus,
  getAdminGetStatsQueryKey,
  getAdminListAdoptionsQueryKey,
  getAdminListTraysQueryKey,
  getAdminListBulkInquiriesQueryKey,
} from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';

type AdminTab = 'overview' | 'adoptions' | 'trays' | 'bulk';

const STATUS_COLORS: Record<string, string> = {
  pending: 'rgba(255,200,80,0.85)',
  confirmed: 'rgba(168,201,138,0.85)',
  dispatched: 'rgba(120,180,255,0.85)',
  delivered: 'rgba(168,201,138,0.5)',
  cancelled: 'rgba(220,80,80,0.6)',
  available: 'rgba(168,201,138,0.85)',
  adopted: 'rgba(255,200,80,0.85)',
  growing: 'rgba(120,200,120,0.85)',
  harvested: 'rgba(168,201,138,0.5)',
};

const ADOPTION_STATUSES = ['pending', 'confirmed', 'dispatched', 'delivered', 'cancelled'];
const TRAY_STATUSES = ['available', 'adopted', 'growing', 'harvested', 'delivered'];

function StatusBadge({ status }: { status: string }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: '99px',
      background: STATUS_COLORS[status] ?? 'rgba(168,201,138,0.3)',
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: '0.58rem',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: '#0a1d14',
      fontWeight: 600,
    }}>
      {status}
    </span>
  );
}

function StatCard({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <div style={{
      background: 'rgba(168,201,138,0.04)',
      border: '1px solid rgba(168,201,138,0.1)',
      borderRadius: '14px',
      padding: '18px 20px',
    }}>
      <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.58rem', color: 'rgba(168,201,138,0.55)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '8px' }}>{label}</p>
      <p style={{ fontFamily: "'Marcellus', serif", fontSize: '2rem', color: 'var(--kilai-cream)', lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.58rem', color: 'rgba(168,201,138,0.4)', marginTop: '6px' }}>{sub}</p>}
    </div>
  );
}

export function AdminDashboard({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const qc = useQueryClient();

  const { data: stats } = useAdminGetStats({ query: { queryKey: getAdminGetStatsQueryKey() } });
  const { data: adoptions } = useAdminListAdoptions({ query: { queryKey: getAdminListAdoptionsQueryKey() } });
  const { data: trays } = useAdminListTrays({ query: { queryKey: getAdminListTraysQueryKey() } });
  const { data: bulkInquiries } = useAdminListBulkInquiries({ query: { queryKey: getAdminListBulkInquiriesQueryKey() } });

  const { mutateAsync: updateAdoptionStatus } = useAdminUpdateAdoptionStatus();
  const { mutateAsync: updateTrayStatus } = useAdminUpdateTrayStatus();

  async function handleAdoptionStatusChange(id: number, status: string) {
    try {
      await updateAdoptionStatus({ id, data: { status } });
      qc.invalidateQueries({ queryKey: getAdminListAdoptionsQueryKey() });
      qc.invalidateQueries({ queryKey: getAdminGetStatsQueryKey() });
    } catch {}
  }

  async function handleTrayStatusChange(id: number, status: string) {
    try {
      await updateTrayStatus({ id, data: { status } });
      qc.invalidateQueries({ queryKey: getAdminListTraysQueryKey() });
      qc.invalidateQueries({ queryKey: getAdminGetStatsQueryKey() });
    } catch {}
  }

  const TABS: { id: AdminTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'adoptions', label: `Orders (${adoptions?.length ?? 0})` },
    { id: 'trays', label: `Trays (${trays?.length ?? 0})` },
    { id: 'bulk', label: `Bulk (${bulkInquiries?.length ?? 0})` },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-hidden"
      style={{ background: '#070f09' }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 20px 0',
        borderBottom: '1px solid rgba(168,201,138,0.08)',
        paddingBottom: '14px',
      }}>
        <div>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.55rem', color: 'var(--kilai-sprout)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '2px' }}>Kilai Admin</p>
          <p style={{ fontFamily: "'Marcellus', serif", fontSize: '1.1rem', color: 'var(--kilai-cream)' }}>Farm Portfolio</p>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(168,201,138,0.08)',
            border: '1px solid rgba(168,201,138,0.15)',
            borderRadius: '8px',
            color: 'rgba(241,236,221,0.6)',
            cursor: 'pointer',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '0.6rem',
            padding: '6px 12px',
            letterSpacing: '0.1em',
          }}
        >
          ← Exit
        </button>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '0',
        padding: '0 20px',
        borderBottom: '1px solid rgba(168,201,138,0.08)',
        overflowX: 'auto',
      }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid var(--kilai-sprout)' : '2px solid transparent',
              cursor: 'pointer',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '0.62rem',
              color: activeTab === tab.id ? 'var(--kilai-sprout)' : 'rgba(241,236,221,0.4)',
              padding: '12px 16px',
              letterSpacing: '0.1em',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', height: 'calc(100dvh - 110px)' }}>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && stats && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }}>
              <StatCard label="Available trays" value={stats.available} />
              <StatCard label="Adopted" value={stats.adopted} />
              <StatCard label="Growing" value={stats.growing} />
              <StatCard label="Harvested" value={stats.harvested} />
              <StatCard label="Delivered" value={stats.delivered} />
              <StatCard label="Total trays" value={stats.total} />
            </div>
            <div style={{ borderTop: '1px solid rgba(168,201,138,0.08)', paddingTop: '20px' }}>
              <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.58rem', color: 'rgba(168,201,138,0.55)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '14px' }}>Revenue & Orders</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <StatCard label="Total revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} />
                <StatCard label="Pending orders" value={stats.pendingAdoptions} />
                <StatCard label="Confirmed" value={stats.confirmedAdoptions} />
                <StatCard label="All orders" value={(adoptions?.length ?? 0)} />
              </div>
            </div>
          </div>
        )}

        {/* ADOPTIONS TAB */}
        {activeTab === 'adoptions' && (
          <div>
            {!adoptions || adoptions.length === 0 ? (
              <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.68rem', color: 'rgba(168,201,138,0.35)', textAlign: 'center', marginTop: '40px' }}>No adoptions yet</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[...adoptions].reverse().map(adoption => (
                  <div key={adoption.id} style={{
                    background: 'rgba(168,201,138,0.04)',
                    border: '1px solid rgba(168,201,138,0.1)',
                    borderRadius: '14px',
                    padding: '16px',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <p style={{ fontFamily: "'Marcellus', serif", fontSize: '1rem', color: 'var(--kilai-cream)', marginBottom: '2px' }}>{adoption.customerName}</p>
                        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.6rem', color: 'rgba(168,201,138,0.5)' }}>{adoption.customerPhone}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontFamily: "'Marcellus', serif", fontSize: '1rem', color: 'var(--kilai-sprout)', marginBottom: '4px' }}>₹{adoption.totalRupees}</p>
                        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.55rem', color: 'rgba(168,201,138,0.35)' }}>
                          {new Date(adoption.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                      <StatusBadge status={adoption.status} />
                      {adoption.variety && (
                        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.58rem', color: 'rgba(168,201,138,0.5)', padding: '2px 10px', borderRadius: '99px', border: '1px solid rgba(168,201,138,0.15)' }}>
                          {adoption.variety}
                        </span>
                      )}
                      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.58rem', color: 'rgba(168,201,138,0.35)', padding: '2px 10px', borderRadius: '99px', border: '1px solid rgba(168,201,138,0.08)' }}>
                        Tray #{adoption.trayId}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {adoption.wantTrayAddon && (
                        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.55rem', color: 'rgba(168,201,138,0.4)', border: '1px solid rgba(168,201,138,0.1)', borderRadius: '6px', padding: '2px 8px' }}>+ Tray addon</span>
                      )}
                      {adoption.wantGuideAddon && (
                        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.55rem', color: 'rgba(168,201,138,0.4)', border: '1px solid rgba(168,201,138,0.1)', borderRadius: '6px', padding: '2px 8px' }}>+ Guide</span>
                      )}
                    </div>

                    {/* Status changer */}
                    <div style={{ marginTop: '14px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.55rem', color: 'rgba(168,201,138,0.35)', alignSelf: 'center' }}>Update:</span>
                      {ADOPTION_STATUSES.filter(s => s !== adoption.status).map(s => (
                        <button
                          key={s}
                          onClick={() => handleAdoptionStatusChange(adoption.id, s)}
                          style={{
                            background: 'rgba(168,201,138,0.06)',
                            border: '1px solid rgba(168,201,138,0.12)',
                            borderRadius: '6px',
                            color: 'rgba(241,236,221,0.55)',
                            cursor: 'pointer',
                            fontFamily: "'IBM Plex Mono', monospace",
                            fontSize: '0.55rem',
                            padding: '4px 10px',
                            letterSpacing: '0.08em',
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(168,201,138,0.15)'; e.currentTarget.style.color = 'var(--kilai-cream)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(168,201,138,0.06)'; e.currentTarget.style.color = 'rgba(241,236,221,0.55)'; }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TRAYS TAB */}
        {activeTab === 'trays' && (
          <div>
            {!trays || trays.length === 0 ? (
              <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.68rem', color: 'rgba(168,201,138,0.35)', textAlign: 'center', marginTop: '40px' }}>No trays found</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {trays.map(tray => (
                  <div key={tray.id} style={{
                    background: 'rgba(168,201,138,0.04)',
                    border: '1px solid rgba(168,201,138,0.1)',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    flexWrap: 'wrap',
                  }}>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.7rem', color: 'rgba(168,201,138,0.35)', minWidth: '32px' }}>#{tray.id}</span>
                    <div style={{ flex: 1, minWidth: '120px' }}>
                      <p style={{ fontFamily: "'Marcellus', serif", fontSize: '0.95rem', color: 'var(--kilai-cream)', marginBottom: '2px' }}>{tray.variety}</p>
                      <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.58rem', color: 'rgba(168,201,138,0.45)' }}>Day {tray.day}/{tray.totalDays} · ₹{tray.price}</p>
                    </div>
                    <StatusBadge status={tray.status} />
                    {tray.adoptedBy && (
                      <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.58rem', color: 'rgba(168,201,138,0.35)', width: '100%' }}>→ {tray.adoptedBy}</p>
                    )}
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', width: '100%' }}>
                      {TRAY_STATUSES.filter(s => s !== tray.status).map(s => (
                        <button
                          key={s}
                          onClick={() => handleTrayStatusChange(tray.id, s)}
                          style={{
                            background: 'rgba(168,201,138,0.05)',
                            border: '1px solid rgba(168,201,138,0.1)',
                            borderRadius: '5px',
                            color: 'rgba(241,236,221,0.45)',
                            cursor: 'pointer',
                            fontFamily: "'IBM Plex Mono', monospace",
                            fontSize: '0.52rem',
                            padding: '3px 8px',
                            letterSpacing: '0.06em',
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* BULK TAB */}
        {activeTab === 'bulk' && (
          <div>
            {!bulkInquiries || bulkInquiries.length === 0 ? (
              <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.68rem', color: 'rgba(168,201,138,0.35)', textAlign: 'center', marginTop: '40px' }}>No bulk inquiries yet</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[...bulkInquiries].reverse().map(inq => (
                  <div key={inq.id} style={{
                    background: 'rgba(168,201,138,0.04)',
                    border: '1px solid rgba(168,201,138,0.1)',
                    borderRadius: '14px',
                    padding: '16px',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <p style={{ fontFamily: "'Marcellus', serif", fontSize: '1rem', color: 'var(--kilai-cream)' }}>{inq.name}</p>
                      <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.55rem', color: 'rgba(168,201,138,0.35)' }}>
                        {new Date(inq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                    {inq.phone && <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.62rem', color: 'rgba(168,201,138,0.5)', marginBottom: '6px' }}>{inq.phone}</p>}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {inq.quantity && <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.58rem', color: 'rgba(168,201,138,0.4)', border: '1px solid rgba(168,201,138,0.12)', borderRadius: '6px', padding: '2px 8px' }}>Qty: {inq.quantity}</span>}
                      {inq.occasion && <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.58rem', color: 'rgba(168,201,138,0.4)', border: '1px solid rgba(168,201,138,0.12)', borderRadius: '6px', padding: '2px 8px' }}>{inq.occasion}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </motion.div>
  );
}
