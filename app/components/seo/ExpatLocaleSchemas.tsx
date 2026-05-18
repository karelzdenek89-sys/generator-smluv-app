import {
  jsonLdScript,
  organizationSchemaLocalized,
  websiteSchemaLocalized,
  type ExpatLocaleSchemaLocale,
} from '@/lib/schemas';

type Props = {
  locale: ExpatLocaleSchemaLocale;
};

export default function ExpatLocaleSchemas({ locale }: Props) {
  const organization = organizationSchemaLocalized(locale);
  const website = websiteSchemaLocalized(locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(website) }}
      />
    </>
  );
}
