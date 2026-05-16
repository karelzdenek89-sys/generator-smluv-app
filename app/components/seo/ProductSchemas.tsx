import {
  breadcrumbSchema,
  jsonLdScript,
  softwareApplicationSchema,
  type SoftwareApplicationSchemaInput,
} from '@/lib/schemas';

type Props = {
  /** Název pro SoftwareApplication schema, např. „Nájemní smlouva — formulář online" */
  appName: string;
  /** URL slug s úvodním lomítkem, např. „/najem" */
  slug: string;
  /** Krátký popis pro schema (volitelné) */
  description?: string;
  /** Label používaný v breadcrumbs (název smlouvy v 1. pádě) */
  breadcrumbLabel: string;
  /** Pricing 99/199 nebo 99/199/299 */
  twoTierOnly?: SoftwareApplicationSchemaInput['twoTierOnly'];
};

export default function ProductSchemas({
  appName,
  slug,
  description,
  breadcrumbLabel,
  twoTierOnly = false,
}: Props) {
  const swApp = softwareApplicationSchema({ name: appName, slug, description, twoTierOnly });
  const breadcrumb = breadcrumbSchema([
    { label: 'SmlouvaHned', href: '/' },
    { label: breadcrumbLabel, href: slug },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(swApp) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumb) }}
      />
    </>
  );
}
