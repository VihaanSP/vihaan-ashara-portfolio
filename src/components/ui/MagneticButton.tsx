import { useRef, useEffect } from 'react';
import { gsap } from '../../lib/gsap';

export const MagneticButton = ({ children, className = '', ...props }: { children: React.ReactNode, className?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = buttonRef.current;
    if (!el) return;

    // Use GSAP quickTo for performance
    const qx = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const qy = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });

    const handleMouseMove = (e: MouseEvent) => {
      // Only run on devices with hover
      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        const r = el.getBoundingClientRect();
        qx((e.clientX - (r.left + r.width / 2)) * 0.35);
        qy((e.clientY - (r.top + r.height / 2)) * 0.35);
      }
    };

    const handleMouseLeave = () => {
      qx(0);
      qy(0);
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      className={`relative rounded-full px-8 py-4 font-mono text-sm uppercase tracking-widest bg-accent text-ink overflow-hidden group ${className}`}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-white scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-300 ease-in-out z-0" />
    </button>
  );
};
