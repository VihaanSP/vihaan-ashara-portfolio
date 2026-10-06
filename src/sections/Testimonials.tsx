import { useGSAP, gsap } from '../lib/gsap';
import { useStore } from '../lib/store';
import { RevealText } from '../components/ui/Reveal';

// TODO: Swap these with real client quotes later
const PLACEHOLDER_TESTIMONIALS = [
  {
    id: 1,
    quote: "Vihaan didn't just edit our video, he completely redefined our visual language. The pacing is absolutely relentless.",
    author: "Creative Director",
    company: "Studio Alpha",
  },
  {
    id: 2,
    quote: "We handed over raw footage that made no sense. What we got back was a masterpiece of tension and release.",
    author: "Head of Marketing",
    company: "Neon Brands",
  },
  {
    id: 3,
    quote: "The only editor I trust to handle our flagship campaigns. Period. The turnaround speed is unmatched.",
    author: "Founder",
    company: "Echo Agency",
  }
];

export const Testimonials = () => {
  const reducedMotion = useStore((s) => s.reducedMotion);

  useGSAP(() => {
    if (reducedMotion) return;

    gsap.fromTo('.testimonial-card',
      { y: 30, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.testimonials-section',
          start: 'top 80%',
        }
      }
    );
  }, [reducedMotion]);

  return (
    <section className="testimonials-section w-full bg-ink text-cream py-24 px-8 sm:px-12 border-t border-cream/10">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        
        <div className="flex justify-between items-end border-b border-cream/10 pb-8">
          <h2 className="text-4xl sm:text-7xl font-display uppercase leading-[0.85]">
            <RevealText delay={0.1}>Word on</RevealText>
            <RevealText delay={0.2}>the street</RevealText>
          </h2>
          <div className="font-mono text-xs opacity-70 uppercase tracking-widest hidden sm:block">
            Client feedback
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLACEHOLDER_TESTIMONIALS.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="testimonial-card flex flex-col justify-between p-8 bg-cream/5 border border-cream/10 rounded-xl"
            >
              <div>
                <div className="text-accent text-4xl font-serif mb-4">"</div>
                <p className="font-serif italic text-xl sm:text-2xl leading-relaxed mb-8">
                  {testimonial.quote}
                </p>
              </div>
              
              <div className="flex flex-col gap-1 pt-6 border-t border-cream/10">
                <span className="font-display uppercase text-lg">{testimonial.author}</span>
                <span className="font-mono text-xs text-accent uppercase tracking-widest">{testimonial.company}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
