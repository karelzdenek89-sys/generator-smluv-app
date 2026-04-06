'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';

const navLinks = [
  { href: '#jak-to-funguje', label: 'Jak to funguje' },
  { href: '#dokumenty', label: 'Typy dokumentů' },
  { href: '#cenik', label: 'Ceník' },
  { href: '/blog', label: 'Právní průvodce' },
  { href: '/o-projektu', label: 'O projektu' },
];

export default function NavbarClient() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const navbar = document.getElementById('main-navbar');
    if (!navbar) return;
    const navbarElement = navbar;

    let ticking = false;

    function handleScroll() {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        navbarElement.classList.toggle('navbar-flat-scrolled', window.scrollY > 40);
        ticking = false;
      });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) {
        setMenuOpen(false);
      }
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
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

      {menuOpen ? (
        <div className="mobile-overlay-ref" role="dialog" aria-modal="true" aria-label="Navigační menu">
          <nav className="mobile-nav-ref">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} onClick={closeMenu} className="mobile-nav-link-ref">
                {link.label}
              </Link>
            ))}

            <Link href="#dokumenty" onClick={closeMenu} className="mobile-nav-cta-ref">
              Vybrat dokument <span aria-hidden>&rarr;</span>
            </Link>
          </nav>
        </div>
      ) : null}
    </>
  );
}

