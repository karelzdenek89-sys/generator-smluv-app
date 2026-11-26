import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import BlogLayoutShell from '@/app/components/blog/BlogLayoutShell';

export const metadata: Metadata = {
  title: {
    default: 'Blog | SmlouvaHned',
    template: '%s | SmlouvaHned',
  },
  description:
    'Praktické průvodce ke smluvním dokumentům a běžným právním situacím v Česku.',
};

export default function BlogLayout({ children }: { children: ReactNode }) {
  return <BlogLayoutShell>{children}</BlogLayoutShell>;
}
