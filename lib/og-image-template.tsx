import { ImageResponse } from 'next/og';
import { getBlogArticleBySlug } from './blog-articles';

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = 'image/png';

export function renderArticleOgImageBySlug(slug: string) {
  const article = getBlogArticleBySlug(slug);
  if (!article) {
    return renderBlogOgImage({ title: 'SmlouvaHned · Blog' });
  }
  return renderBlogOgImage({
    title: article.title,
    category: article.category,
  });
}

type Props = {
  title: string;
  kicker?: string;
  category?: string;
};

/**
 * Sdílený OG image generátor pro blog články.
 * Cíl: vyšší CTR na sociálních sítích — každý článek má vlastní preview s nadpisem.
 */
export function renderBlogOgImage({ title, kicker = 'SmlouvaHned · Blog', category }: Props) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '70px 80px',
          background:
            'linear-gradient(135deg, #040c1a 0%, #07111e 60%, #15110d 100%)',
          color: '#f2e7c8',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 12,
              border: '2px solid #c9a852',
              background: '#040c1a',
              color: '#c9a852',
              fontSize: 22,
              fontWeight: 800,
            }}
          >
            SH
          </div>
          <div
            style={{
              fontSize: 22,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: '#c9a852',
              fontWeight: 700,
            }}
          >
            {kicker}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {category ? (
            <div
              style={{
                display: 'inline-flex',
                alignSelf: 'flex-start',
                padding: '8px 18px',
                borderRadius: 999,
                border: '1px solid rgba(201, 168, 82, 0.35)',
                background: 'rgba(201, 168, 82, 0.12)',
                color: '#d6ac60',
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: 'uppercase',
              }}
            >
              {category}
            </div>
          ) : null}
          <div
            style={{
              fontSize: title.length > 70 ? 56 : 64,
              fontWeight: 900,
              letterSpacing: -2,
              lineHeight: 1.05,
              color: '#ffffff',
              maxWidth: 1040,
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#bba98c',
            fontSize: 22,
          }}
        >
          <div>smlouvahned.cz/blog</div>
          <div style={{ color: '#d6ac60', fontWeight: 700 }}>Právní průvodce 2026</div>
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
