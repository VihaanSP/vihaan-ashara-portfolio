import { useRef } from 'react';
import type { ReactNode } from 'react';
import { useGSAP, gsap } from '../../lib/gsap';

interface RevealTextProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const RevealText = ({ children, className = '', delay = 0 }: RevealTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    // Masked line-by-line reveal
    const lines = containerRef.current.querySelectorAll('.reveal-line-inner');
    
    gsap.fromTo(lines, 
      { yPercent: 110 },
      {
        yPercent: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'expo.out',
        delay,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      }
    );
  }, { scope: containerRef });

  // For this to work best without a text splitting library, we expect children to be pre-split into lines if needed
  // or we can just apply it to the whole block assuming single line.
  // Actually, we'll assume the user passes a string or we wrap words.
  // A simple hack without SplitText: just wrap the whole thing if it's one line.
  
  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <div className="reveal-line-inner inline-block will-change-transform">
        {children}
      </div>
    </div>
  );
};

interface RevealBlockProps {
  children: ReactNode;
  className?: string;
  index?: number; // for staggered rising if multiple blocks
}

export const RevealBlock = ({ children, className = '', index = 0 }: RevealBlockProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(ref.current,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'expo.out',
        delay: index * 0.1,
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      }
    );
  }, { scope: ref });

  return (
    <div ref={ref} className={`will-change-transform opacity-0 ${className}`}>
      {children}
    </div>
  );
};
