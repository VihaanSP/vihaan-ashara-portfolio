import { useRef } from 'react';
import { useGSAP, gsap } from '../lib/gsap';

const PANELS = [
  {
    numeral: '01',
    title: 'DISCOVER',
    description: 'We dive deep into the brand DNA to extract the raw vision.',
    visual: 'bg-cream/10' // Placeholder for visual
  },
  {
    numeral: '02',
    title: 'EDIT',
    description: 'The lattice. We splice, re-time, and color grade until it bleeds.',
    visual: 'bg-accent/20' // Placeholder for visual
  },
  {
    numeral: '03',
    title: 'DELIVER',
    description: 'The final export. Maximum fidelity, zero compromises.',
    visual: 'bg-cream/10' // Placeholder for visual
  }
];

export const Process = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current || !trackRef.current) return;

    // Calculate how far we need to translate the track
    // The total width is essentially (panels count) * 100vw
    // To reach the last panel, we move - (count - 1) * 100vw
    const totalMove = -(trackRef.current.scrollWidth - window.innerWidth);

    const trackTween = gsap.to(trackRef.current, {
      x: totalMove,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: () => `+=${(trackRef.current?.scrollWidth || 0) - window.innerWidth}`,
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          gsap.set('.process-progress', { scaleX: self.progress });
        },
      }
    });

    // Sub-animations for each panel, driven by the horizontal container tween
    const panels = gsap.utils.toArray('.process-panel') as HTMLElement[];
    panels.forEach((panel) => {
      const visual = panel.querySelector('.process-visual');
      const textWrap = panel.querySelector('.process-text');

      gsap.from([visual, textWrap], {
        y: 40,
        opacity: 0,
        ease: 'power2.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: panel,
          containerAnimation: trackTween,
          start: 'left 75%',
          end: 'left 25%',
          scrub: true,
        }
      });
    });

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="h-screen w-full overflow-hidden bg-ink text-cream relative">
      <div className="absolute top-8 left-8 text-xs font-mono uppercase tracking-widest text-accent z-10">
        Process
      </div>
      
      <div
        ref={trackRef}
        id="process-track"
        className="flex h-full w-[300vw] will-change-transform"
      >
        {PANELS.map((panel, idx) => (
          <div 
            key={idx} 
            className="process-panel w-[100vw] h-full flex flex-col justify-center px-8 sm:px-24"
          >
            <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24 w-full max-w-7xl mx-auto">
              
              {/* Text Side */}
              <div className="process-text flex-1 flex flex-col">
                <span className="text-[15vw] leading-[0.8] font-display text-cream/5 opacity-50 block -mb-8 pointer-events-none">
                  {panel.numeral}
                </span>
                <h2 className="text-6xl md:text-8xl font-display uppercase tracking-tight relative z-10">
                  {panel.title}
                </h2>
                <p className="mt-8 font-mono text-sm md:text-base text-cream/70 max-w-md">
                  {panel.description}
                </p>
              </div>

              {/* Visual Side */}
              <div className="process-visual w-full md:w-[40vw] max-w-md aspect-square md:aspect-[4/3] rounded-xl overflow-hidden border border-cream/10 relative">
                <div className={`absolute inset-0 ${panel.visual} mix-blend-screen`}></div>
                <div className="absolute inset-0 flex items-center justify-center font-mono text-xs opacity-50">
                  [VISUAL PLACEHOLDER]
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
      
      {/* Progress hint */}
      <div className="absolute bottom-8 right-8 text-xs font-mono tracking-widest flex items-center gap-4">
        <span>SCROLL</span>
        <div className="w-16 h-[1px] bg-cream/20 relative">
          <div className="absolute top-0 left-0 h-full bg-accent w-full origin-left scale-x-0 process-progress" />
        </div>
      </div>
    </section>
  );
};
