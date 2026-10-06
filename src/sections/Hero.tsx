import { useRef, lazy, Suspense } from 'react';
import { useGSAP, gsap } from '../lib/gsap';
import { useStore } from '../lib/store';
import { MagneticButton } from '../components/ui/MagneticButton';

const HeroCanvas = lazy(() => import('../components/three/HeroCanvas'));

export const Hero = () => {
  const heroRef = useRef<HTMLElement>(null);
  const ready = useStore((s) => s.ready);
  const tier = useStore((s) => s.tier);

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
        className="relative w-full h-screen bg-cream text-ink flex flex-col justify-between p-8 sm:p-12 overflow-hidden"
      >
        {tier === 'full' && (
          <Suspense fallback={null}>
            <HeroCanvas />
          </Suspense>
        )}

        <div className="relative z-10 flex-1 flex flex-col justify-center items-start pt-20 pointer-events-none">
          <h1 className="text-6xl sm:text-[10vw] leading-[0.85] font-display uppercase overflow-hidden">
            <div className="overflow-hidden flex flex-wrap items-baseline gap-[2vw]">
              <span className="hero-word translate-y-0 block">VISUAL</span>
              <span className="hero-serif font-serif italic font-normal text-[1.1em] lowercase translate-x-0 opacity-100">alchemy</span>
            </div>
            <div className="overflow-hidden mt-4">
              <span className="hero-word translate-y-0 block text-ink">FOR THE BOLD.</span>
            </div>
          </h1>
          
          <div className="mt-12 overflow-hidden hero-cta pointer-events-auto">
            <MagneticButton>Book a project</MagneticButton>
          </div>
        </div>

        <div className="relative z-10 flex justify-between items-end font-mono text-xs uppercase tracking-widest border-t border-ink/10 pt-6">
          <div>Vihaan Ashara &copy; 2026</div>
          <div className="text-accent">Available for work</div>
        </div>
      </section>
    </>
  );
};
