import TrackedLink from '@/app/components/analytics/TrackedLink';

interface ArticleInlineCtaProps {
  title: string;
  body: string;
  buttonLabel: string;
  href: string;
  variant?: 'primary' | 'subtle';
}

export default function ArticleInlineCta({
  title,
  body,
  buttonLabel,
  href,
  variant = 'primary',
}: ArticleInlineCtaProps) {
  const primary = variant === 'primary';

  return (
    <div className="blog-callout my-10 rounded-[1.5rem] p-6">
      <div className="site-kicker">{primary ? 'Související dokument' : 'Další krok'}</div>
      <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-[#f2e7c8]">
        {title}
      </h3>
      <p className="mt-4 text-base leading-8 text-[#d2c8b9]">{body}</p>
      <div className="mt-6">
        <TrackedLink
          href={href}
          eventName="blog_cta_click"
          eventParams={{
            source: 'blog_article',
            surface: 'blog_article',
            cta_type: primary ? 'inline_primary' : 'inline_secondary',
          }}
          className={primary ? 'site-button-primary' : 'site-button-secondary'}
        >
          {buttonLabel}
        </TrackedLink>
      </div>
    </div>
  );
}
