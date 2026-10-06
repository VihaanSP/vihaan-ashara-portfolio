import { useEffect, useRef, useState } from 'react';
import { useGSAP, gsap, ScrollTrigger } from '../../lib/gsap';
import { useStore } from '../../lib/store';
import { useDeviceTier } from '../../hooks/useDeviceTier';
import '../../styles/preloader.css';

export const Preloader = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const bootTextRef = useRef<HTMLDivElement>(null);
  const setReady = useStore((s) => s.setReady);
  const tier = useDeviceTier(); // will set tier in store
  const [key, setKey] = useState(0); // for re-rendering

  const lines = [
    'BIOS Date 10/05/26 21:05:13 Ver 08.00.15',
    'CPU: Dual-Core Processor, Speed: 3.2 GHz',
    'Memory Test: 16384K OK',
    'Detecting primary master... 3D Assets',
    'Detecting primary slave... Textures',
    'EIGENCUTS_OS v2.6 — initializing render engine',
    'Booting system...',
  ];

  // Re-render listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'r') {
        setReady(false);
        setKey(prev => prev + 1); // Remount preloader
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setReady]);

  useGSAP(() => {
    if (tier === 'poster') {
      // Reduced motion / Poster tier -> skip animation
      setReady(true);
      if (wrapRef.current) wrapRef.current.style.display = 'none';
      return;
    }

    // Reset styles for replay
    gsap.set(wrapRef.current, { display: 'flex', clipPath: 'inset(0 0 0 0)' });
    gsap.set('.pre-label', { yPercent: 0 });
    
    const tl = gsap.timeline();
    
    // Simulate boot lines appearing
    if (bootTextRef.current) {
      const lineElements = Array.from(bootTextRef.current.children) as HTMLElement[];
      tl.to(lineElements, {
        opacity: 1,
        stagger: 0.15,
        duration: 0.1
      });
    }

    const shown = { v: 0 };
    tl.to(shown, {
      v: 100,
      duration: 1.5,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.textContent = String(Math.round(shown.v)).padStart(3, '0');
        }
        if (progressFillRef.current) {
          progressFillRef.current.style.width = `${Math.round(shown.v)}%`;
        }
      }
    }, 0);

    // Wait for fonts to load before wiping
    tl.call(() => {
      tl.pause();
      document.fonts.ready.then(() => {
        tl.play();
      });
    });

    tl.to('.pre-label', { yPercent: -100, duration: 0.5, ease: 'power3.in' }, '+=0.2')
      .to(wrapRef.current, { clipPath: 'inset(100% 0 0 0)', duration: 0.9, ease: 'expo.inOut' }, '<0.1')
      .set(wrapRef.current, { display: 'none' })
      .call(() => {
        setReady(true);
        ScrollTrigger.refresh(); // Refresh pins
      });
      
  }, { scope: wrapRef, dependencies: [tier, key] });

  return (
    <div
      key={key}
      ref={wrapRef}
      className="preloader-crt fixed inset-0 z-[100] flex flex-col justify-between p-8 sm:p-12"
      style={{ display: tier === 'poster' ? 'none' : 'flex' }}
    >
      <div className="preloader-screen absolute inset-0 w-full h-full p-8 sm:p-12 flex flex-col justify-between pointer-events-none">
        <div ref={bootTextRef} className="flex-1 font-mono text-sm uppercase leading-relaxed text-[#c8d4e6]">
          {lines.map((line, i) => (
            <div key={i} className="mb-1 opacity-0">{line}</div>
          ))}
          <div className="mt-4 animate-pulse opacity-0">_</div>
        </div>

        <div className="flex flex-col gap-4 pre-label">
          <div className="flex justify-between items-end">
            <h1 className="text-4xl sm:text-6xl tracking-tight text-white mix-blend-screen">
              RENDERING VIHAAN
            </h1>
            <div className="text-xl sm:text-2xl text-white">
              <span ref={counterRef}>000</span>%
            </div>
          </div>

          <div className="w-full h-4 border-2 border-white rounded-full p-[2px]">
            <div ref={progressFillRef} className="h-full bg-[#66FCF1] rounded-full w-0" />
          </div>
        </div>

        <div className="absolute top-8 right-12 font-mono text-xs text-[#66FCF1]/70">
          PRESS R TO RE-RENDER
        </div>
      </div>
    </div>
  );
};
