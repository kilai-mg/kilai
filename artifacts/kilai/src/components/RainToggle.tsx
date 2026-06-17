import { CloudRain } from 'lucide-react';
import { useRainSound } from '@/hooks/useRainSound';

export function RainToggle() {
  const { isPlaying, toggle } = useRainSound();

  return (
    <button
      onClick={toggle}
      data-testid="button-rain-toggle"
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-500"
      style={{
        borderColor: isPlaying ? 'var(--kilai-sprout)' : 'rgba(241,236,221,0.2)',
        color: isPlaying ? 'var(--kilai-sprout)' : 'rgba(241,236,221,0.5)',
        background: isPlaying ? 'rgba(168,201,138,0.08)' : 'transparent',
      }}
      title={isPlaying ? 'Stop rain' : 'Play rain ambience'}
    >
      <span
        style={{
          display: 'inline-flex',
          animation: isPlaying ? 'rain-pulse 2s ease-in-out infinite' : 'none',
        }}
      >
        <CloudRain size={14} />
      </span>
      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.08em' }}>
        Rain
      </span>
      <style>{`
        @keyframes rain-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </button>
  );
}
