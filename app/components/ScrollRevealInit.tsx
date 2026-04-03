'use client';

import { useEffect } from 'react';

/**
 * Wires up the IntersectionObserver for scroll-reveal animations.
 * Elements with className="reveal" will get "visible" added when they enter the viewport.
 * Place this once in the page — it handles all .reveal elements on the page.
 */
export default function ScrollRevealInit() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Unobserve after reveal so it doesn't re-animate
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
}
