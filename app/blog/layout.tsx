import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import BlogLayoutShell from '@/app/components/blog/BlogLayoutShell';

export const metadata: Metadata = {
  title: {
    default: 'Blog | SmlouvaHned',
    template: '%s | SmlouvaHned',
  },
  description:
    'Praktické průvodce nájemními a pracovními smlouvami, DPP a dalšími smluvními situacemi v Česku. Najdete v nich příklady, termíny a oficiální zdroje.',
};

export default function BlogLayout({ children }: { children: ReactNode }) {
  return <BlogLayoutShell>{children}</BlogLayoutShell>;
}
