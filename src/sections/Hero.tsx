import { useRef } from 'react';
import { useGSAP, gsap } from '../lib/gsap';
import { useStore } from '../lib/store';
import { MagneticButton } from '../components/ui/MagneticButton';

export const Hero = () => {
  const heroRef = useRef<HTMLElement>(null);
  const ready = useStore((s) => s.ready);

  useGSAP(() => {
    if (!ready) return;

    gsap.timeline({ defaults: { ease: 'expo.out' } })
      .from('.hero-word', { yPercent: 110, stagger: 0.05, duration: 1.1 })
      .from('.hero-serif', { xPercent: -30, autoAlpha: 0, duration: 1 }, '<0.2')
      .from('.hero-cta', { scale: 0.6, autoAlpha: 0, duration: 0.8 }, '<0.3');

  }, [ready]);

  return (
    <>
      <section 
        id="hero-section"
        ref={heroRef} 
        className="relative w-full h-screen bg-ink text-cream flex flex-col justify-between p-8 sm:p-12 overflow-hidden"
      >
        <div className="relative z-10 flex-1 flex flex-col justify-center items-start pt-20 pointer-events-none">
          <h1 className="text-6xl sm:text-[12vw] leading-[0.85] font-display uppercase overflow-hidden">
            <div className="overflow-hidden">
              <span className="hero-word translate-y-0 block">EIGENCUTS</span>
            </div>
          </h1>
          <p className="hero-serif mt-6 font-serif italic text-2xl sm:text-4xl text-cream/80 translate-x-0 opacity-100">
            cuts that stop the scroll.
          </p>
          
          <div className="mt-12 overflow-hidden hero-cta pointer-events-auto">
            <MagneticButton>Book a project</MagneticButton>
          </div>
        </div>

        <div className="relative z-10 flex justify-between items-end font-mono text-xs uppercase tracking-widest border-t border-cream/10 pt-6">
          <div>EIGENCUTS &copy; 2026 — Vihaan Ashara</div>
          <div className="text-accent">Available for work</div>
        </div>
      </section>
    </>
  );
};
