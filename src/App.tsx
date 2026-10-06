import { useStore } from './lib/store';
import { Preloader } from './components/layout/Preloader';
import { Nav } from './components/layout/Nav';
import { SmoothScroll } from './components/layout/SmoothScroll';
import { Hero } from './sections/Hero';
import { Marquee } from './components/ui/Marquee';
import { Process } from './sections/Process';
import { RevealText, RevealBlock } from './components/ui/Reveal';
import { Showreel } from './sections/Showreel';
import { SelectedWork } from './sections/SelectedWork';
import { Pricing } from './sections/Pricing';
import { Testimonials } from './sections/Testimonials';
import { Footer } from './sections/Footer';
import { lazy, Suspense } from 'react';

const DNACanvas = lazy(() => import('./components/three/DNACanvas'));


function App() {
  const tier = useStore((s) => s.tier);
  return (
    <SmoothScroll>
      <Preloader />
      {tier === 'full' && (
        <Suspense fallback={null}>
          <div className="fixed inset-y-0 right-0 w-1/4 pointer-events-none z-0 opacity-10 md:opacity-40">
            <DNACanvas />
          </div>
        </Suspense>
      )}
      <Nav />
      <main>
        <Hero />
        
        <Marquee items={['Reels', 'Ads', 'Music videos', 'Brand films']} />
        
        <section className="w-full bg-ink text-cream py-32 px-8 sm:px-24">
          <div className="max-w-7xl mx-auto flex flex-col gap-16">
            
            <div className="text-4xl sm:text-7xl font-display uppercase leading-[0.85]">
              <RevealText delay={0.1}>Precision</RevealText>
              <RevealText delay={0.2}>Execution,</RevealText>
              <RevealText delay={0.3}>No Excuses.</RevealText>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <RevealBlock key={i} index={i} className="bg-cream/5 border border-cream/10 p-8 rounded-xl flex flex-col gap-4">
                  <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center font-mono text-accent">
                    0{i}
                  </div>
                  <h3 className="font-serif text-2xl italic">Discipline {i}</h3>
                  <p className="font-mono text-xs opacity-70">
                    Applying relentless force to the timeline until the narrative yields.
                  </p>
                </RevealBlock>
              ))}
            </div>

          </div>
        </section>

        <Process />
        <Showreel />
        <SelectedWork />
        <Pricing />
        <Testimonials />
      </main>
      <Footer />
    </SmoothScroll>
  );
}

export default App;
