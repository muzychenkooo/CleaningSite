import { Container } from '@/components/layout/container';
import { ReviewsCarousel } from '@/components/reviews/ReviewsCarousel';

export function ReviewsSection() {
  return (
    <section id="otzyvy" className="w-full py-16 sm:py-24 bg-slate-50 scroll-mt-20">
      <Container>
        <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Клиенты скажут вам больше
        </h2>
        <div className="mt-8">
          <ReviewsCarousel />
        </div>
      </Container>
    </section>
  );
}
