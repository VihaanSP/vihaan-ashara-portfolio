import { useEffect } from 'react';
import { useStore } from '../lib/store';

export const useDeviceTier = () => {
  const setTier = useStore((s) => s.setTier);
  const setReducedMotion = useStore((s) => s.setReducedMotion);
  const tier = useStore((s) => s.tier);

  useEffect(() => {
    const checkTier = () => {
      let isPoster = false;
      
      // 1. Viewport under 768px
      if (window.innerWidth < 768) {
        isPoster = true;
      }
      
      // 2. Prefers reduced motion
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        isPoster = true;
      }
      
      // 3. Save-data enabled
      if ('connection' in navigator && (navigator as any).connection?.saveData) {
        isPoster = true;
      }
      
      // 4. Low memory or CPU
      if (
        ('deviceMemory' in navigator && (navigator as any).deviceMemory <= 4) ||
        (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4)
      ) {
        isPoster = true;
      }

      // 5. No WebGL2 (simplified check for WebGL support)
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2');
        if (!gl) {
          isPoster = true;
        }
      } catch (e) {
        isPoster = true;
      }

      setTier(isPoster ? 'poster' : 'full');
      setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    };

    checkTier();
    
    // Re-check on resize (optional, mostly for viewport testing)
    window.addEventListener('resize', checkTier);
    return () => window.removeEventListener('resize', checkTier);
  }, [setTier, setReducedMotion]);

  return tier;
};
