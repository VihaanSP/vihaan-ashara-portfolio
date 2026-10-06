import { useState, useEffect } from 'react';
import { useGSAP, gsap } from '../lib/gsap';
import { useStore } from '../lib/store';

import { MagneticButton } from '../components/ui/MagneticButton';

export const Footer = () => {
  const [time, setTime] = useState('');
  const reducedMotion = useStore((s) => s.reducedMotion);

  // Live time ticker for Asia/Kolkata
  useEffect(() => {
    const updateTime = () => {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      setTime(formatter.format(new Date()));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useGSAP(() => {
    if (reducedMotion) return;

    gsap.fromTo('.footer-reveal',
      { yPercent: 100, autoAlpha: 0 },
      {
        yPercent: 0,
        autoAlpha: 1,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.footer-section',
          start: 'top 75%',
        }
      }
    );
  }, [reducedMotion]);

  return (
    <footer className="footer-section w-full bg-ink text-cream py-24 px-8 sm:px-12 border-t border-cream/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col gap-24 relative z-10">
        
        {/* Giant CTA */}
        <div className="flex flex-col items-center justify-center text-center gap-12 pt-12">
          <h2 className="text-6xl sm:text-[10vw] font-display uppercase leading-[0.85] overflow-hidden">
            <div className="footer-reveal">Let's cut</div>
            <div className="footer-reveal flex items-center justify-center gap-4">
              <span>to the</span>
              <span className="font-serif italic font-normal lowercase text-[1.1em] text-accent">chase.</span>
            </div>
          </h2>
          
          <div className="footer-reveal">
            <MagneticButton 
              className="px-12 py-6 bg-cream text-ink font-display text-2xl uppercase tracking-widest hover:bg-accent hover:text-ink transition-colors rounded-full"
              onClick={() => window.location.href = 'mailto:vihaanashara@gmail.com'}
            >
              Start a project
            </MagneticButton>
          </div>
        </div>

        {/* Links & Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-4 pt-12 border-t border-cream/10 font-mono text-xs uppercase tracking-widest">
          
          <div className="flex flex-col gap-4 footer-reveal">
            <span className="opacity-50">Socials</span>
            <a 
              href="https://instagram.com/eigen_cuts" 
              target="_blank" 
              rel="noreferrer"
              className="hover:text-accent transition-colors w-max"
            >
              Instagram ↗
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noreferrer"
              className="hover:text-accent transition-colors w-max"
            >
              Twitter ↗
            </a>
          </div>

          <div className="flex flex-col gap-4 sm:items-center footer-reveal">
            <span className="opacity-50">Local Time (IST)</span>
            <div className="text-accent">{time}</div>
          </div>

          <div className="flex flex-col gap-4 sm:items-end footer-reveal">
            <span className="opacity-50">Contact</span>
            <a 
              href="mailto:vihaanashara@gmail.com" 
              className="hover:text-accent transition-colors w-max"
            >
              vihaanashara@gmail.com
            </a>
          </div>

        </div>

      </div>

      {/* Decorative background element */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-full max-w-[150vw] aspect-square rounded-full border border-cream/5 z-0 pointer-events-none" />
    </footer>
  );
};
