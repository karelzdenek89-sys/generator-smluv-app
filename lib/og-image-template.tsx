import { ImageResponse } from 'next/og';
import { getBlogArticleBySlug } from './blog-articles';
import { getExpatBlogArticle } from './i18n/expat-blog-articles';
import { LANDINGS } from './i18n/landings';
import { getExpatSeoLandingBySlug } from './i18n/expat-seo-landings';
import type { AppLocale } from './locale';

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = 'image/png';

const DOT = '\u00b7';
const UA_EXPAT_GUIDE = '\u0413\u0456\u0434 \u0434\u043b\u044f \u0456\u043d\u043e\u0437\u0435\u043c\u0446\u0456\u0432';
const UA_FOR_FOREIGNERS = '\u0414\u043b\u044f \u0456\u043d\u043e\u0437\u0435\u043c\u0446\u0456\u0432 \u0443 \u0427\u0435\u0445\u0456\u0457';
const UA_HUB_TITLE =
  'SmlouvaHned \u0434\u043b\u044f \u0456\u043d\u043e\u0437\u0435\u043c\u0446\u0456\u0432 \u0443 \u0427\u0435\u0445\u0456\u0457';
const UA_SAFETY =
  '\u041d\u0435 \u044e\u0440\u0438\u0434\u0438\u0447\u043d\u0430 \u0447\u0438 \u0456\u043c\u043c\u0456\u0433\u0440\u0430\u0446\u0456\u0439\u043d\u0430 \u043a\u043e\u043d\u0441\u0443\u043b\u044c\u0442\u0430\u0446\u0456\u044f';
const UA_PREVAILS =
  '\u041f\u043e\u044f\u0441\u043d\u044e\u0432\u0430\u043b\u044c\u043d\u0438\u0439 \u043f\u0435\u0440\u0435\u043a\u043b\u0430\u0434 \u00b7 \u0447\u0435\u0441\u044c\u043a\u0435 \u0444\u043e\u0440\u043c\u0443\u043b\u044e\u0432\u0430\u043d\u043d\u044f \u043c\u0430\u0454 \u043f\u0435\u0440\u0435\u0432\u0430\u0433\u0443';
const UA_PDF_ANNEX =
  '\u0427\u0435\u0441\u044c\u043a\u0438\u0439 PDF \u00b7 \u043f\u043e\u044f\u0441\u043d\u044e\u0432\u0430\u043b\u044c\u043d\u0438\u0439 \u0434\u043e\u0434\u0430\u0442\u043e\u043a';
const UA_HUB_FOOTER =
  '\u041e\u0440\u0435\u043d\u0434\u0430 \u00b7 \u0440\u043e\u0431\u043e\u0442\u0430 \u00b7 DPP \u00b7 \u0434\u043e\u0432\u0456\u0440\u0435\u043d\u0456\u0441\u0442\u044c \u00b7 \u0430\u0432\u0442\u043e';

type BlogOgProps = {
  title: string;
  kicker?: string;
  category?: string;
};

type ExpatOgProps = {
  title: string;
  subtitle: string;
  locale: 'en' | 'ua';
  badge: string;
  footer?: string;
};

export function renderArticleOgImageBySlug(slug: string) {
  const article = getBlogArticleBySlug(slug);
  if (!article) {
    return renderBlogOgImage({ title: `SmlouvaHned ${DOT} Blog` });
  }
  return renderBlogOgImage({
    title: article.title,
    category: article.category,
  });
}

export function renderExpatBlogOgImageBySlug(slug: string) {
  const article = getExpatBlogArticle(slug);
  if (!article) {
    return renderBlogOgImage({
      title: `SmlouvaHned ${DOT} Expat guide`,
      kicker: `SmlouvaHned ${DOT} Blog`,
    });
  }
  const kicker =
    article.audience === 'en'
      ? `SmlouvaHned ${DOT} Expat guide`
      : `SmlouvaHned ${DOT} ${UA_EXPAT_GUIDE}`;
  return renderBlogOgImage({
    title: article.title,
    kicker,
    category: article.category,
  });
}

export function renderExpatSeoOgImageBySlug(slug: string, locale: AppLocale) {
  const content = getExpatSeoLandingBySlug(slug, locale);
  if (!content || (locale !== 'en' && locale !== 'ua')) {
    return renderExpatOgImage({
      title: 'Czech contracts for foreigners',
      subtitle: 'English and Ukrainian guided forms for core Czech contracts.',
      locale: 'en',
      badge: 'EXPAT CONTRACTS',
    });
  }

  return renderExpatOgImage({
    title: content.metadata.openGraphTitle.replace(' | SmlouvaHned', ''),
    subtitle: content.metadata.openGraphDescription,
    locale,
    badge: content.breadcrumbLabel,
    footer: locale === 'ua' ? UA_PREVAILS : `Clause-paired CZ+EN PDF ${DOT} Czech wording prevails`,
  });
}

export function renderExpatHubOgImage(locale: AppLocale) {
  const resolved = locale === 'ua' ? 'ua' : 'en';
  const landing = LANDINGS[resolved];

  return renderExpatOgImage({
    title: resolved === 'ua' ? UA_HUB_TITLE : 'SmlouvaHned for expats in Czechia',
    subtitle: landing.ogDescription,
    locale: resolved,
    badge: resolved === 'ua' ? `UA ${DOT} EXPAT HUB` : `EN ${DOT} EXPAT HUB`,
    footer: resolved === 'ua' ? UA_HUB_FOOTER : `Rental ${DOT} work ${DOT} DPP ${DOT} power of attorney ${DOT} car sale`,
  });
}

export function renderBrandOgImage() {
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
          background: 'linear-gradient(135deg, #040c1a 0%, #07111e 60%, #15110d 100%)',
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
            SmlouvaHned
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 980 }}>
          <div
            style={{
              fontSize: 58,
              fontWeight: 900,
              letterSpacing: -2,
              lineHeight: 1.05,
              color: '#ffffff',
            }}
          >
            Generování smluv online 2026
          </div>
          <div style={{ fontSize: 28, lineHeight: 1.35, color: '#d8c9ad' }}>
            Formulář → PDF s citacemi § · Od 99 Kč · Dle legislativy 2026
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
          <div>smlouvahned.cz</div>
          <div style={{ color: '#d6ac60', fontWeight: 700 }}>14 typů dokumentů</div>
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}

export function renderBlogOgImage({
  title,
  kicker = `SmlouvaHned ${DOT} Blog`,
  category,
}: BlogOgProps) {
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
          background: 'linear-gradient(135deg, #040c1a 0%, #07111e 60%, #15110d 100%)',
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
                display: 'flex',
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
          <div style={{ color: '#d6ac60', fontWeight: 700 }}>Pravni pruvodce 2026</div>
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}

function renderExpatOgImage({ title, subtitle, locale, badge, footer }: ExpatOgProps) {
  const isUa = locale === 'ua';
  const safety = isUa ? UA_SAFETY : 'Not legal or immigration advice';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 76px',
          background: 'linear-gradient(135deg, #031525 0%, #07111e 56%, #17140d 100%)',
          color: '#f5ead0',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: -120,
            top: -120,
            width: 430,
            height: 430,
            borderRadius: 999,
            background: 'rgba(201, 168, 82, 0.12)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 60,
            bottom: 70,
            width: 310,
            height: 310,
            borderRadius: 999,
            border: '1px solid rgba(201, 168, 82, 0.22)',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div
              style={{
                width: 58,
                height: 58,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 14,
                border: '2px solid #c9a852',
                background: '#07111e',
                color: '#c9a852',
                fontSize: 22,
                fontWeight: 900,
              }}
            >
              SH
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ color: '#ffffff', fontSize: 24, fontWeight: 800 }}>SmlouvaHned</div>
              <div
                style={{
                  color: '#c9a852',
                  fontSize: 15,
                  fontWeight: 800,
                  letterSpacing: 3,
                  textTransform: 'uppercase',
                }}
              >
                {isUa ? UA_FOR_FOREIGNERS : 'Contracts for foreigners in Czechia'}
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              padding: '10px 18px',
              borderRadius: 999,
              border: '1px solid rgba(201, 168, 82, 0.42)',
              background: 'rgba(201, 168, 82, 0.12)',
              color: '#f0d58d',
              fontSize: 18,
              fontWeight: 900,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
            }}
          >
            {badge}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 980 }}>
          <div
            style={{
              display: 'flex',
              alignSelf: 'flex-start',
              padding: '9px 18px',
              borderRadius: 12,
              border: '1px solid rgba(14, 165, 233, 0.35)',
              background: 'rgba(14, 165, 233, 0.13)',
              color: '#bae6fd',
              fontSize: 20,
              fontWeight: 800,
            }}
          >
            {safety}
          </div>
          <div
            style={{
              fontSize: title.length > 64 ? 54 : 64,
              fontWeight: 950,
              letterSpacing: -1.6,
              lineHeight: 1.04,
              color: '#ffffff',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: subtitle.length > 140 ? 25 : 29,
              lineHeight: 1.35,
              color: '#d8c9ad',
              maxWidth: 980,
            }}
          >
            {subtitle}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#bba98c',
            fontSize: 22,
          }}
        >
          <div>{`smlouvahned.cz/${locale}`}</div>
          <div style={{ color: '#d6ac60', fontWeight: 800 }}>
            {footer ?? (isUa ? UA_PREVAILS : `Clause-paired CZ+EN PDF ${DOT} Czech wording prevails`)}
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
