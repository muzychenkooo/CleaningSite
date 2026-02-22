import { calculatePrice } from '../calculator';

describe('calculatePrice', () => {
  it('apartment: area only', () => {
    const r = calculatePrice({ serviceType: 'apartment', areaSqm: 50 });
    expect(r.currency).toBe('RUB');
    expect(r.totalPrice).toBeGreaterThanOrEqual(2500);
    expect(r.breakdown.length).toBeGreaterThanOrEqual(1);
  });

  it('apartment: with windows and balcony', () => {
    const r = calculatePrice({
      serviceType: 'apartment',
      areaSqm: 60,
      windows: 3,
      hasBalcony: true,
    });
    expect(r.totalPrice).toBeGreaterThan(r.basePrice);
    expect(r.breakdown.some((b) => b.label.includes('окон'))).toBe(true);
    expect(r.breakdown.some((b) => b.label.toLowerCase().includes('балкон'))).toBe(true);
  });

  it('office: area and windows', () => {
    const r = calculatePrice({
      serviceType: 'office',
      areaSqm: 100,
      windows: 5,
    });
    expect(r.totalPrice).toBeGreaterThanOrEqual(2500);
  });

  it('after_repair: minimum order applied', () => {
    const r = calculatePrice({ serviceType: 'after_repair', areaSqm: 10 });
    expect(r.totalPrice).toBeGreaterThanOrEqual(2500);
  });

  it('window only', () => {
    const r = calculatePrice({
      serviceType: 'window',
      areaSqm: 0,
      windows: 4,
    });
    expect(r.breakdown.some((b) => b.label.includes('окон'))).toBe(true);
    expect(r.totalPrice).toBeGreaterThanOrEqual(4 * 250);
  });
});
