'use client';

import { useEffect, useRef } from 'react';

/**
 * Enhances the floating navbar with scroll-driven shadow/blur intensification.
 * Reads the navbar element via a ref and updates its box-shadow on scroll.
 * The navbar remains a server-rendered element; this only adds scroll behavior.
 */
export default function NavbarClient() {
  useEffect(() => {
    const navbar = document.getElementById('floating-navbar');
    if (!navbar) return;

    let ticking = false;

    function handleScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrolled = window.scrollY > 60;
        if (scrolled) {
          navbar!.style.boxShadow =
            '0 2px 0 0 rgba(255,255,255,0.06) inset, 0 8px 24px -4px rgba(0,0,0,0.7), 0 24px 48px -8px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)';
          navbar!.style.background = 'rgba(6,10,20,0.85)';
        } else {
          navbar!.style.boxShadow = '';
          navbar!.style.background = '';
        }
        ticking = false;
      });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return null;
}
