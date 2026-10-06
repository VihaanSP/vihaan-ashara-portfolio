import { useState, useEffect } from 'react';
import { useGSAP, gsap } from '../lib/gsap';
import { useStore } from '../lib/store';
import { lenis } from '../lib/lenis';
import { RevealText } from '../components/ui/Reveal';

export const Showreel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const reducedMotion = useStore((s) => s.reducedMotion);

  // Lock background scroll and allow Escape to close while the lightbox is open
  useEffect(() => {
    if (!isOpen) return;
    lenis.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      lenis.start();
    };
  }, [isOpen]);

  // TODO: Swap out this placeholder URL with the real reel later
  const videoPlaceholderUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1";

  useGSAP(() => {
    if (reducedMotion) return;
    
    // Add any specific scroll animations for the showreel container if needed
    gsap.fromTo('.showreel-frame', 
      { scale: 0.95, autoAlpha: 0 },
      {
        scale: 1,
        autoAlpha: 1,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.showreel-section',
          start: 'top 80%',
        }
      }
    );
  }, [reducedMotion]);

  return (
    <>
      <section className="showreel-section w-full bg-ink text-cream py-24 px-8 sm:px-12">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          
          <div className="flex justify-between items-end">
            <h2 className="text-4xl sm:text-7xl font-display uppercase leading-[0.85]">
              <RevealText delay={0.1}>The</RevealText>
              <RevealText delay={0.2}>Reel</RevealText>
            </h2>
            <div className="font-mono text-xs opacity-70 uppercase tracking-widest hidden sm:block">
              Selected fragments 2024-2026
            </div>
          </div>

          {/* 16:9 Frame */}
          <div 
            className="showreel-frame relative w-full aspect-video bg-cream/5 border border-cream/10 rounded-xl overflow-hidden cursor-pointer group"
            onClick={() => setIsOpen(true)}
          >
            {/* Thumbnail Placeholder */}
            <div className="absolute inset-0 bg-ink/50 group-hover:bg-ink/30 transition-colors duration-500 z-10" />
            <img 
              src="https://picsum.photos/seed/reel/1920/1080" 
              alt="Showreel thumbnail" 
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000 ease-out"
            />

            {/* Play Button Overlay */}
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full border border-cream/30 bg-ink/50 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 group-hover:bg-accent group-hover:border-accent transition-all duration-500 ease-out">
                <svg className="w-8 h-8 text-cream group-hover:text-ink transition-colors duration-500 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Caption line */}
          <div className="flex justify-between font-mono text-xs uppercase tracking-widest opacity-50">
            <span>Showreel_2026 — placeholder cut, swap with final reel</span>
            <span>16:9</span>
          </div>

        </div>
      </section>

      {/* Lightbox Player */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 backdrop-blur-md">
          <button 
            className="absolute top-8 right-8 text-cream opacity-70 hover:opacity-100 hover:text-accent transition-colors font-mono text-xs uppercase tracking-widest"
            onClick={() => setIsOpen(false)}
          >
            [ Close ]
          </button>
          
          <div className="w-full max-w-6xl aspect-video p-4 sm:p-8">
            <iframe
              className="w-full h-full rounded-lg shadow-2xl border border-cream/10"
              src={videoPlaceholderUrl}
              title="Showreel"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
};
