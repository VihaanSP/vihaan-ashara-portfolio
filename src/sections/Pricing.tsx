import { useGSAP, gsap } from '../lib/gsap';
import { useStore } from '../lib/store';
import { RevealText } from '../components/ui/Reveal';
import { MagneticButton } from '../components/ui/MagneticButton';

const PRICING_TIERS = [
  {
    name: 'Starter',
    price: '$500',
    description: 'Essential edits for social media. Short-form, high impact.',
    features: ['Up to 3 revisions', 'Color grading', 'Basic sound design', '1 week turnaround'],
    isPopular: false,
  },
  {
    name: 'Creator',
    price: '$1,200',
    description: 'Full-scale YouTube or Brand videos. Narrative focus.',
    features: ['Unlimited revisions', 'Advanced VFX', 'Custom soundscape', '2 week turnaround'],
    isPopular: true,
  },
  {
    name: 'Brand',
    price: '$3,500+',
    description: 'Comprehensive campaign package. TVC & Web ready.',
    features: ['Dedicated strategy', 'Motion graphics', 'Original score', 'Priority delivery'],
    isPopular: false,
  },
];

export const Pricing = () => {
  const reducedMotion = useStore((s) => s.reducedMotion);

  useGSAP(() => {
    if (reducedMotion) return;

    gsap.fromTo('.pricing-card',
      { y: 50, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.pricing-section',
          start: 'top 80%',
        }
      }
    );
  }, [reducedMotion]);

  return (
    <section className="pricing-section w-full bg-cream text-ink py-24 px-8 sm:px-12 border-t border-ink/10">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        
        <div className="flex justify-between items-end border-b border-ink/10 pb-8">
          <h2 className="text-4xl sm:text-7xl font-display uppercase leading-[0.85]">
            <RevealText delay={0.1}>The</RevealText>
            <RevealText delay={0.2}>Damage</RevealText>
          </h2>
          <div className="font-mono text-xs opacity-70 uppercase tracking-widest hidden sm:block">
            Investment options
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {PRICING_TIERS.map((tier) => (
            <div 
              key={tier.name}
              className={`pricing-card relative flex flex-col p-8 rounded-2xl border transition-all duration-300 ${
                tier.isPopular 
                  ? 'bg-ink text-cream border-ink scale-100 md:scale-105 shadow-2xl z-10 py-12' 
                  : 'bg-cream text-ink border-ink/20 hover:border-ink/40'
              }`}
            >
              {tier.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-ink font-mono text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              
              <h3 className="font-serif text-3xl italic mb-2">{tier.name}</h3>
              <div className="font-display text-4xl mb-6">{tier.price}</div>
              <p className={`font-mono text-xs mb-8 pb-8 border-b ${tier.isPopular ? 'border-cream/20 opacity-90' : 'border-ink/10 opacity-70'}`}>
                {tier.description}
              </p>
              
              <ul className="flex flex-col gap-4 mb-10 flex-1">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 font-mono text-sm">
                    <span className="text-accent">▹</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="w-full">
                <MagneticButton className={`w-full py-4 rounded-lg font-mono text-xs uppercase tracking-widest transition-colors ${
                  tier.isPopular 
                    ? 'bg-cream text-ink hover:bg-accent' 
                    : 'bg-ink text-cream hover:bg-ink/80'
                }`}
                onClick={() => window.location.href = 'mailto:vihaanashara@gmail.com'}>
                  Book {tier.name}
                </MagneticButton>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
