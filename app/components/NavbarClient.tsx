'use client';

import { useEffect } from 'react';

/**
 * Adds background + shadow to the flat navbar on scroll.
 */
export default function NavbarClient() {
  useEffect(() => {
    const navbar = document.getElementById('main-navbar');
    if (!navbar) return;

    let ticking = false;

    function handleScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrolled = window.scrollY > 40;
        if (scrolled) {
          navbar!.classList.add('navbar-flat-scrolled');
        } else {
          navbar!.classList.remove('navbar-flat-scrolled');
        }
        ticking = false;
      });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return null;
}
