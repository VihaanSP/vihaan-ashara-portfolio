import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap';

export const lenis = new Lenis({
  lerp: 0.09,
});
(window as any).lenis = lenis;

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
