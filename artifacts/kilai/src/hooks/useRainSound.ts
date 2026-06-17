import { useState, useEffect, useRef } from 'react';

export function useRainSound() {
  const [isPlaying, setIsPlaying] = useState(() => {
    return localStorage.getItem('kilai-rain') === 'true';
  });
  const ctxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  function createRainSound(ctx: AudioContext) {
    const bufferSize = ctx.sampleRate * 2; // 2 seconds of noise
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;
    filter.Q.value = 0.5;

    const gain = ctx.createGain();
    gain.gain.value = 0.15;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    return source;
  }

  function toggle() {
    if (isPlaying) {
      sourceRef.current?.stop();
      sourceRef.current = null;
      setIsPlaying(false);
      localStorage.setItem('kilai-rain', 'false');
    } else {
      const ctx = ctxRef.current ?? new (window.AudioContext || (window as any).webkitAudioContext)();
      ctxRef.current = ctx;
      if (ctx.state === 'suspended') ctx.resume();
      const source = createRainSound(ctx);
      source.start();
      sourceRef.current = source;
      setIsPlaying(true);
      localStorage.setItem('kilai-rain', 'true');
    }
  }

  useEffect(() => {
    return () => { sourceRef.current?.stop(); };
  }, []);

  return { isPlaying, toggle };
}
