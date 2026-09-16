'use client';

import { useEffect, useRef, useState } from 'react';
import { normalizeLocale } from '@/lib/locale';

const DRAFT_TTL_MS = 30 * 60 * 1000;

/** Per-tab, short-lived recovery. Restore known fields only, never consent. */
export function useBuilderDraft<T extends object>(initial: T | (() => T), scope: 'builder' | 'checkout' = 'builder') {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);
  const defaults = useRef(value);
  const storageKey = useRef('');

  useEffect(() => {
    const url = new URL(window.location.href);
    storageKey.current = `sh_${scope}_draft:${url.pathname}:${url.searchParams.get('package') || ''}:${normalizeLocale(url.searchParams.get('lang'))}`;
    try {
      const saved = JSON.parse(sessionStorage.getItem(storageKey.current) || 'null');
      if (saved?.expiresAt > Date.now() && saved.value && typeof saved.value === 'object') {
        const restored = Object.fromEntries(Object.entries(defaults.current).map(([key, fallback]) => {
          const field = saved.value[key];
          const validArray = Array.isArray(fallback) && Array.isArray(field) && field.every((item) => typeof item === 'string');
          return [key, validArray || (typeof field === typeof fallback && (typeof field === 'string' || typeof field === 'boolean' || typeof field === 'number')) ? field : fallback];
        })) as T;
        setValue(restored);
      } else {
        sessionStorage.removeItem(storageKey.current);
      }
    } catch {
      // Disabled storage must never prevent editing or purchasing a document.
    }
    setReady(true);
  }, [scope]);

  useEffect(() => {
    if (!ready) return;
    try {
      const existing = JSON.parse(sessionStorage.getItem(storageKey.current) || 'null');
      if (existing?.expiresAt > Date.now() && JSON.stringify(existing.value) === JSON.stringify(value)) return;
      sessionStorage.setItem(storageKey.current, JSON.stringify({ value, expiresAt: Date.now() + DRAFT_TTL_MS }));
    } catch {
      // Best-effort recovery, not a prerequisite for checkout.
    }
  }, [ready, value]);

  return [value, setValue, ready] as const;
}
