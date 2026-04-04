'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

const navLinks = [
  { href: '#jak-to-funguje', label: 'Jak to funguje' },
  { href: '#dokumenty', label: 'Typy dokumentů' },
  { href: '#cenik', label: 'Ceník' },
  { href: '/blog', label: 'Právní průvodce' },
  { href: '/o-projektu', label: 'O projektu' },
];

/**
 * Adds background + shadow to the flat navbar on scroll.
 * Also provides mobile hamburger menu.
 */
export default function NavbarClient() {
  const [menuOpen, setMenuOpen] = useState(false);

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

  // Close menu on resize to desktop
  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      {/* Hamburger button — visible only on mobile/tablet */}
      <button
        id="mobile-menu-btn"
        aria-label={menuOpen ? 'Zavřít menu' : 'Otevřít menu'}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(prev => !prev)}
        className="mobile-menu-btn-ref lg:hidden"
      >
        <span className={`mobile-menu-bar-ref ${menuOpen ? 'mobile-bar-top-open' : ''}`} />
        <span className={`mobile-menu-bar-ref ${menuOpen ? 'mobile-bar-mid-open' : ''}`} />
        <span className={`mobile-menu-bar-ref ${menuOpen ? 'mobile-bar-bot-open' : ''}`} />
      </button>

      {/* Mobile overlay menu */}
      {menuOpen && (
        <div
          className="mobile-overlay-ref"
          role="dialog"
          aria-modal="true"
          aria-label="Navigační menu"
        >
          <nav className="mobile-nav-ref">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="mobile-nav-link-ref"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="#dokumenty"
              onClick={closeMenu}
              className="mobile-nav-cta-ref"
            >
              Vybrat typ smlouvy →
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
