import { useRef } from 'react';
import { useGSAP, gsap } from '../../lib/gsap';
import { lenis } from '../../lib/lenis';

interface MarqueeProps {
  items: string[];
  velocityMultiplier?: number;
}

export const Marquee = ({ items, velocityMultiplier = 0.05 }: MarqueeProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useGSAP(() => {
    if (!wrapperRef.current) return;
    
    // We clone the items multiple times to ensure a seamless loop
    // But since it's React, we'll just render them twice in the JSX.
    const totalWidth = wrapperRef.current.scrollWidth / 2;

    gsap.set(wrapperRef.current, { x: 0 });

    tweenRef.current = gsap.to(wrapperRef.current, {
      x: -totalWidth,
      duration: 10,
      ease: 'none',
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth) // Ensures seamless wrap
      }
    });

    // We can't access the global lenis instance easily unless we put it in context or store.
    // Wait, in `lenis.ts` we exported a store or the lenis instance? No, we didn't.
    // Let's just use ScrollTrigger velocity.
    const updateTimeScale = () => {
      if (!tweenRef.current) return;
      
      const velocity = Math.abs(lenis.velocity || 0);
      const targetTimeScale = 1 + velocity * velocityMultiplier;
      
      const currentScale = tweenRef.current.timeScale();
      tweenRef.current.timeScale(currentScale + (targetTimeScale - currentScale) * 0.1);
    };

    gsap.ticker.add(updateTimeScale);
    return () => gsap.ticker.remove(updateTimeScale);
  }, { scope: containerRef });

  const handleMouseEnter = () => {
    if (tweenRef.current) gsap.to(tweenRef.current, { timeScale: 0, duration: 0.5 });
  };

  const handleMouseLeave = () => {
    if (tweenRef.current) gsap.to(tweenRef.current, { timeScale: 1, duration: 0.5 });
  };

  return (
    <div 
      ref={containerRef}
      className="w-full overflow-hidden bg-ink py-4 border-y border-cream/10"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        ref={wrapperRef}
        className="flex whitespace-nowrap w-fit will-change-transform items-center"
      >
        {/* Render twice for seamless loop */}
        {[0, 1].map((part) => (
          <div key={part} className="flex items-center">
            {items.map((item, i) => (
              <div key={i} className="flex items-center text-cream">
                <span className="text-4xl md:text-6xl font-display uppercase mx-8">
                  {item}
                </span>
                <span className="text-accent text-3xl font-serif italic">*</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
