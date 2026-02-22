import type { PricingParams, PriceResult } from './types';

const PRICE_PER_SQM_APARTMENT = 350;
const PRICE_PER_SQM_HOUSE = 400;
const PRICE_PER_SQM_OFFICE = 300;
const PRICE_PER_SQM_AFTER_REPAIR = 450;
const PRICE_PER_WINDOW = 250;
const BALCONY_SURCHARGE = 500;
const MIN_ORDER = 2500;

export function calculatePrice(params: PricingParams): PriceResult {
  const breakdown: { label: string; amount: number }[] = [];
  let total = 0;

  switch (params.serviceType) {
    case 'apartment':
    case 'house': {
      const rate = params.serviceType === 'apartment' ? PRICE_PER_SQM_APARTMENT : PRICE_PER_SQM_HOUSE;
      const base = Math.round(params.areaSqm * rate);
      breakdown.push({ label: `Уборка (${params.areaSqm} м² × ${rate} ₽)`, amount: base });
      total += base;
      if (params.windows && params.windows > 0) {
        const win = params.windows * PRICE_PER_WINDOW;
        breakdown.push({ label: `Мойка окон (${params.windows} шт.)`, amount: win });
        total += win;
      }
      if (params.hasBalcony) {
        breakdown.push({ label: 'Балкон/лоджия', amount: BALCONY_SURCHARGE });
        total += BALCONY_SURCHARGE;
      }
      break;
    }
    case 'office': {
      const base = Math.round(params.areaSqm * PRICE_PER_SQM_OFFICE);
      breakdown.push({ label: `Уборка офиса (${params.areaSqm} м²)`, amount: base });
      total += base;
      if (params.windows && params.windows > 0) {
        const win = params.windows * PRICE_PER_WINDOW;
        breakdown.push({ label: `Мойка окон (${params.windows} шт.)`, amount: win });
        total += win;
      }
      break;
    }
    case 'after_repair': {
      const base = Math.round(params.areaSqm * PRICE_PER_SQM_AFTER_REPAIR);
      breakdown.push({ label: `Уборка после ремонта (${params.areaSqm} м²)`, amount: base });
      total += base;
      break;
    }
    case 'window': {
      const count = params.windows ?? Math.max(1, Math.ceil((params.areaSqm ?? 0) / 15));
      const win = count * PRICE_PER_WINDOW;
      breakdown.push({ label: `Мойка окон (${count} шт.)`, amount: win });
      total += win;
      break;
    }
    default: {
      const base = Math.round(params.areaSqm * PRICE_PER_SQM_APARTMENT);
      breakdown.push({ label: `Уборка (${params.areaSqm} м²)`, amount: base });
      total += base;
    }
  }

  total = Math.max(MIN_ORDER, total);

  return {
    basePrice: breakdown[0]?.amount ?? total,
    totalPrice: total,
    breakdown,
    currency: 'RUB',
  };
}
