import { useGSAP, gsap } from '../lib/gsap';
import { useStore } from '../lib/store';
import { RevealText } from '../components/ui/Reveal';

// TODO: Replace these placeholder projects with actual portfolio work later
const PLACEHOLDER_PROJECTS = [
  { id: 1, title: 'Echoes of Silence', category: 'Brand Film', year: '2025', image: 'https://picsum.photos/seed/work1/800/600' },
  { id: 2, title: 'Neon Pulse', category: 'Music Video', year: '2026', image: 'https://picsum.photos/seed/work2/800/600' },
  { id: 3, title: 'Velocity', category: 'Ad Campaign', year: '2024', image: 'https://picsum.photos/seed/work3/800/600' },
  { id: 4, title: 'Urban Drift', category: 'Reel', year: '2025', image: 'https://picsum.photos/seed/work4/800/600' },
  { id: 5, title: 'Synthwave', category: 'Music Video', year: '2026', image: 'https://picsum.photos/seed/work5/800/600' },
  { id: 6, title: 'Apex', category: 'Brand Film', year: '2024', image: 'https://picsum.photos/seed/work6/800/600' },
];

export const SelectedWork = () => {
  const reducedMotion = useStore((s) => s.reducedMotion);

  useGSAP(() => {
    if (reducedMotion) return;

    gsap.fromTo('.work-card',
      { y: 50, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.work-grid',
          start: 'top 85%',
        }
      }
    );
  }, [reducedMotion]);

  return (
    <section className="w-full bg-ink text-cream py-24 px-8 sm:px-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        
        <div className="flex justify-between items-end border-b border-cream/10 pb-8">
          <h2 className="text-4xl sm:text-7xl font-display uppercase leading-[0.85]">
            <RevealText delay={0.1}>Selected</RevealText>
            <RevealText delay={0.2}>Work</RevealText>
          </h2>
          <div className="font-mono text-xs opacity-70 uppercase tracking-widest hidden sm:block">
            [ Placeholder Edits ]
          </div>
        </div>

        <div className="work-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
          {PLACEHOLDER_PROJECTS.map((project) => (
            <div key={project.id} className="work-card group cursor-pointer flex flex-col gap-4">
              
              {/* Thumbnail Container */}
              <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-cream/5">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-80 group-hover:opacity-100"
                />
                
                {/* Hover Preview Overlay */}
                <div className="absolute inset-0 bg-accent/90 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] flex items-center justify-center">
                  <span className="font-display text-ink text-2xl uppercase tracking-wider">Play</span>
                </div>
              </div>

              {/* Metadata */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-serif text-2xl italic">{project.title}</h3>
                  <span className="font-mono text-xs opacity-50">{project.year}</span>
                </div>
                <div className="font-mono text-xs text-accent uppercase tracking-widest">
                  {project.category}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
