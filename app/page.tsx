import type { Metadata } from 'next';
import App from '../App';

export const metadata: Metadata = {
  title: 'SmlouvaHned | Standardizované smluvní dokumenty online',
  description:
    'Online nástroj pro sestavení standardizovaných smluvních dokumentů pro běžné situace. Přehledný průvodce, bezpečná platba a PDF dokument určený ke kontrole a podpisu.',
  alternates: { canonical: 'https://www.smlouvahned.cz' },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'SmlouvaHned',
  legalName: 'Karel Zdeněk',
  url: 'https://www.smlouvahned.cz',
  logo: 'https://www.smlouvahned.cz/og-image.png',
  areaServed: 'CZ',
  inLanguage: 'cs-CZ',
  identifier: {
    '@type': 'PropertyValue',
    propertyID: 'IČO',
    value: '23660295',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'info@smlouvahned.cz',
    availableLanguage: ['cs'],
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema).replace(/</g, '\\u003c') }}
      />
      <App />
    </>
  );
}
