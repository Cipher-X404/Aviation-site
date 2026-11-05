import React, { useEffect, useRef, useState } from 'react';

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export const RevealOnScroll: React.FC<RevealOnScrollProps> = ({ children, className = '', delayMs = 0, direction = 'up' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(el);
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hidden = direction === 'left' ? 'translate-x-10 opacity-0' : direction === 'right' ? '-translate-x-10 opacity-0' : direction === 'down' ? '-translate-y-8 opacity-0' : direction === 'none' ? 'opacity-0' : 'translate-y-8 opacity-0';
  return <div ref={ref} style={{ transitionDuration: '650ms', transitionDelay: `${delayMs}ms`, transitionTimingFunction: 'cubic-bezier(.22,.61,.36,1)' }} className={`transition-all ${isVisible ? 'translate-y-0 translate-x-0 opacity-100' : hidden} ${className}`}>{children}</div>;
};
