import { useEffect } from 'react';
import { lenis } from '../../lib/lenis';

export const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
};
