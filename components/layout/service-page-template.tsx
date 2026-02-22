import { Breadcrumbs, type BreadcrumbItem } from '@/components/layout/breadcrumbs';
import type { ServiceContent } from '@/data/service-content';
import {
  ServiceHero,
  ServiceChecklist,
  ServiceForWhom,
  ServiceProcess,
  ServicePriceBlock,
  ServiceGuarantees,
  ServiceEquipment,
  ServiceFaq,
  ServiceCtaStrip,
  ServiceCrossLinks,
  ServiceAnchorSections,
} from '@/components/service';
import { ServiceJsonLd, FaqJsonLd } from '@/app/json-ld';

const baseUrl = 'https://bigyborka.ru';

/** Full detailed service page: pass content + breadcrumbs. */
type FullProps = {
  content: ServiceContent;
  breadcrumbs: BreadcrumbItem[];
  /** For JSON-LD and SEO (e.g. /private/apartment/) */
  canonicalPath?: string;
  children?: React.ReactNode;
};

/** Legacy short form (backward compatible). */
type LegacyProps = {
  breadcrumbs: BreadcrumbItem[];
  title: string;
  intro: string;
  priceFrom?: string;
  included?: string[];
  children?: React.ReactNode;
  anchorSections?: { id: string; label: string; content?: React.ReactNode }[];
};

type Props = FullProps | LegacyProps;

function isFullProps(p: Props): p is FullProps {
  return 'content' in p && p.content !== undefined;
}

export function ServicePageTemplate(props: Props) {
  if (isFullProps(props)) {
    const { content, breadcrumbs, canonicalPath, children } = props;
    const canonicalUrl = canonicalPath ? `${baseUrl}${canonicalPath.startsWith('/') ? '' : '/'}${canonicalPath}` : undefined;
    return (
      <div className="py-0">
        {canonicalUrl && (
          <>
            <ServiceJsonLd name={content.title} description={content.intro} url={canonicalUrl} />
            {content.faq?.length > 0 && <FaqJsonLd items={content.faq} />}
          </>
        )}
        <ServiceHero breadcrumbs={breadcrumbs} title={content.title} intro={content.intro} />
        <ServiceChecklist items={content.included} />
        <ServiceForWhom scenarios={content.forWhom} />
        <ServiceProcess steps={content.process} />
        <ServicePriceBlock
          priceFrom={content.priceFrom}
          priceNote={content.priceNote}
          priceFaq={content.priceFaq}
        />
        <ServiceGuarantees items={content.guarantees} />
        <ServiceEquipment items={content.equipment} />
        {content.anchorSections && content.anchorSections.length > 0 && (
          <ServiceAnchorSections sections={content.anchorSections} />
        )}
        <ServiceFaq items={content.faq} />
        <ServiceCrossLinks links={content.relatedLinks} />
        {children}
        <ServiceCtaStrip />
      </div>
    );
  }

  /* Legacy: short form without full content blocks */
  const { breadcrumbs, title, intro, priceFrom, included, children, anchorSections } = props;
  return (
    <div className="py-12 sm:py-20">
      <ServiceHero breadcrumbs={breadcrumbs} title={title} intro={intro} />
      {included && included.length > 0 && (
        <ServiceChecklist items={included} />
      )}
      {priceFrom && (
        <ServicePriceBlock priceFrom={priceFrom} />
      )}
      {anchorSections && anchorSections.length > 0 && (
        <ServiceAnchorSections
          sections={anchorSections.map((a) => ({ id: a.id, label: a.label, content: undefined }))}
        />
      )}
      {children}
      <ServiceCtaStrip />
    </div>
  );
}
