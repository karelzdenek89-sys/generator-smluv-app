'use client';

import { useEffect } from 'react';

/**
 * Adds a clean depth shadow to the floating navbar on scroll.
 * No background color override — the navbar-pill class handles base styling.
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
          navbar!.style.boxShadow = '0 4px 28px rgba(0,0,0,0.55)';
          navbar!.style.borderColor = 'rgba(255,255,255,0.11)';
        } else {
          navbar!.style.boxShadow = '';
          navbar!.style.borderColor = '';
        }
        ticking = false;
      });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return null;
}
