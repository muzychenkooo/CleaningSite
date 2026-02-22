import { Suspense } from 'react';
import { Hero } from '@/components/home/hero';
import { QuizSection } from '@/components/home/quiz-section';
import { ServicesSection } from '@/components/home/services-section';
import { AboutSection } from '@/components/home/about-section';
import { TrustSection } from '@/components/home/trust-section';
import { PromoSection } from '@/components/home/promo-section';
import { ReviewsSection } from '@/components/home/reviews-section';
import { VideoReviewsSection } from '@/components/home/video-reviews-section';
import { TeamSection } from '@/components/home/team-section';
import { StepsSection } from '@/components/home/steps-section';
import { FAQSection } from '@/components/home/faq-section';
import { GallerySection } from '@/components/home/gallery-section';
import { ContactCtaSection } from '@/components/home/contact-cta-section';

export default function HomePage() {
  return (
    <div className="home-page">
      <Hero />
      <Suspense fallback={<section id="rasschet" className="w-full py-16 sm:py-24 scroll-mt-24 bg-slate-50" />}>
        <QuizSection />
      </Suspense>
      <ServicesSection />
      <AboutSection />
      <TrustSection />
      <PromoSection />
      <ReviewsSection />
      <VideoReviewsSection />
      <TeamSection />
      <StepsSection />
      <FAQSection />
      <GallerySection />
      <ContactCtaSection />
    </div>
  );
}
