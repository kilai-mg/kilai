interface NavigationDotsProps {
  total: number;
  current: number;
  onChange: (index: number) => void;
}

export function NavigationDots({ total, current, onChange }: NavigationDotsProps) {
  return (
    <>
      {/* Desktop: right side */}
      <div
        className="fixed right-5 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-3 z-50"
        data-testid="nav-dots-desktop"
      >
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            onClick={() => onChange(i)}
            data-testid={`nav-dot-${i}`}
            className="transition-all duration-300 rounded-full"
            style={{
              width: i === current ? '8px' : '6px',
              height: i === current ? '8px' : '6px',
              background: i === current ? 'var(--kilai-sprout)' : 'transparent',
              border: i === current ? '1px solid var(--kilai-sprout)' : '1px solid rgba(241,236,221,0.3)',
              outline: 'none',
            }}
          />
        ))}
      </div>

      {/* Mobile: bottom center */}
      <div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 flex md:hidden gap-2 z-50"
        data-testid="nav-dots-mobile"
      >
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            onClick={() => onChange(i)}
            data-testid={`nav-dot-mobile-${i}`}
            className="transition-all duration-300 rounded-full"
            style={{
              width: i === current ? '20px' : '6px',
              height: '6px',
              background: i === current ? 'var(--kilai-sprout)' : 'rgba(241,236,221,0.3)',
              outline: 'none',
            }}
          />
        ))}
      </div>
    </>
  );
}
