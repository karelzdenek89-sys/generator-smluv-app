'use client';

export default function ForeignBannerDismissButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        document.cookie = `foreign-banner-dismissed=1; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
        const el = document.querySelector('.foreign-banner');
        if (el) (el as HTMLElement).style.display = 'none';
      }}
      className="rounded-md border border-amber-400/40 bg-amber-400/10 px-2.5 py-1 text-xs font-medium text-amber-100 transition-colors hover:bg-amber-400/20"
    >
      {label}
    </button>
  );
}
