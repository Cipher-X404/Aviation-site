import React, { useEffect, useRef, useState } from 'react';

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export const RevealOnScroll: React.FC<RevealOnScrollProps> = ({
  children,
  className = '',
  delayMs = 0,
  direction = 'up',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const getTransformStyle = () => {
    if (isVisible) return 'translate-y-0 translate-x-0 opacity-100 scale-100';
    switch (direction) {
      case 'up':
        return 'translate-y-10 opacity-0 scale-[0.98]';
      case 'down':
        return '-translate-y-10 opacity-0 scale-[0.98]';
      case 'left':
        return 'translate-x-10 opacity-0';
      case 'right':
        return '-translate-x-10 opacity-0';
      case 'none':
        return 'opacity-0 scale-[0.98]';
      default:
        return 'translate-y-10 opacity-0';
    }
  };

  return (
    <div
      ref={ref}
      style={{
        transitionDuration: '750ms',
        transitionDelay: `${delayMs}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className={`transition-all ${getTransformStyle()} ${className}`}
    >
      {children}
    </div>
  );
};
