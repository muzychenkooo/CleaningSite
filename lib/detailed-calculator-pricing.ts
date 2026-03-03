/**
 * Расчёт стоимости для ветки "Квартира / Дом" подробного калькулятора.
 *
 * Формула основана на документах квиза (квартира-коттедж):
 * - базовая ставка зависит от типа уборки;
 * - доплата за санузлы;
 * - доп. услуги с фиксированной ценой/за м²/за штуку;
 * - коэффициент загрязненности;
 * - в конце показываем цену и цену со скидкой 10%.
 */

export type ApartmentHouseCleaningType = 'after_repair' | 'general' | 'support' | 'custom';

export interface ApartmentHouseExtrasInput {
  windowsCount?: number;
  balconyAreaSqm?: number;
  ozoneAreaSqm?: number;
  photoChem?: boolean;
  fridge?: boolean;
  microwave?: boolean;
  oven?: boolean;
  chandelier?: boolean;
}

export interface ApartmentHouseCalcInput {
  cleaningType: ApartmentHouseCleaningType;
  areaSqm: number;
  bathroomsCount: number;
  extras: ApartmentHouseExtrasInput;
  dirtinessLevel: number; // 1..10
}

export interface ApartmentHousePriceBreakdownItem {
  label: string;
  amount: number;
}

export interface ApartmentHousePriceResult {
  baseRatePerSqm: number;
  baseCost: number;
  bathroomsSurcharge: number;
  extrasTotal: number;
  dirtinessPercent: number;
  dirtinessSurcharge: number;
  totalBeforeDiscount: number;
  totalWithDiscount: number;
  breakdown: ApartmentHousePriceBreakdownItem[];
}

// Ставки из документа:
// После ремонта/Новостройка = 320 руб/м2
// Генеральная = 300 руб/м2
// Поддерживающая = 250 руб/м2
// Свой вариант = 0 руб/м2
export function getRatePerSqm(type: ApartmentHouseCleaningType): number {
  switch (type) {
    case 'after_repair':
      return 320;
    case 'general':
      return 300;
    case 'support':
      return 250;
    case 'custom':
    default:
      return 0;
  }
}

// Доплата за санузлы:
// 1 = +0
// 2 = +3000
// 3+ = +5000
export function getBathroomsSurcharge(bathroomsCount: number): number {
  if (bathroomsCount <= 1) return 0;
  if (bathroomsCount === 2) return 3000;
  return 5000;
}

// Коэффициент загрязненности:
// 1..5 = +0
// 6 = +10%
// 7 = +15%
// 8 = +20%
// 9 = +30%
// 10 = +50%
export function getDirtinessPercent(level: number): number {
  if (level <= 5) return 0;
  switch (level) {
    case 6:
      return 10;
    case 7:
      return 15;
    case 8:
      return 20;
    case 9:
      return 30;
    case 10:
      return 50;
    default:
      return 0;
  }
}

/**
 * Основной расчёт для квартиры/дома.
 *
 * Extras (из документа, единицы не меняем):
 * - Окна: 1300 руб/шт
 * - Балкон: +3000 руб/м2
 * - Озон: +100 руб/м2
 * - Химчистка по фото: 0 руб/м2
 * - Холодильник: 1200 (документ: /м2 — оставляем как есть)
 * - СВЧ: 500
 * - Духовка: 700
 * - Люстра: 1000
 */
export function calculateApartmentHousePrice(input: ApartmentHouseCalcInput): ApartmentHousePriceResult {
  const area = Math.max(0, input.areaSqm || 0);
  const bathrooms = Math.max(0, input.bathroomsCount || 0);

  const rate = getRatePerSqm(input.cleaningType);
  const baseCost = Math.round(area * rate);

  const breakdown: ApartmentHousePriceBreakdownItem[] = [];

  breakdown.push({
    label: `Уборка (${area} м² × ${rate.toLocaleString('ru-RU')} ₽)`,
    amount: baseCost,
  });

  const bathroomsSurcharge = getBathroomsSurcharge(bathrooms);
  if (bathroomsSurcharge > 0) {
    breakdown.push({
      label: `Доплата за санузлы (${bathrooms} шт.)`,
      amount: bathroomsSurcharge,
    });
  }

  let extrasTotal = 0;

  const { extras } = input;
  const windowsCount = Math.max(0, extras.windowsCount || 0);
  if (windowsCount > 0) {
    const cost = windowsCount * 1300;
    extrasTotal += cost;
    breakdown.push({
      label: `Мойка окон (${windowsCount} шт. × 1300 ₽)`,
      amount: cost,
    });
  }

  const balconyArea = Math.max(0, extras.balconyAreaSqm || 0);
  if (balconyArea > 0) {
    const cost = balconyArea * 3000;
    extrasTotal += cost;
    breakdown.push({
      label: `Балкон (${balconyArea} м² × 3000 ₽)`,
      amount: cost,
    });
  }

  const ozoneArea = Math.max(0, extras.ozoneAreaSqm || 0);
  if (ozoneArea > 0) {
    const cost = ozoneArea * 100;
    extrasTotal += cost;
    breakdown.push({
      label: `Озонирование (${ozoneArea} м² × 100 ₽)`,
      amount: cost,
    });
  }

  if (extras.photoChem) {
    breakdown.push({
      label: 'Химчистка по фото',
      amount: 0,
    });
  }

  if (extras.fridge) {
    extrasTotal += 1200;
    breakdown.push({
      label: 'Холодильник',
      amount: 1200,
    });
  }

  if (extras.microwave) {
    extrasTotal += 500;
    breakdown.push({
      label: 'СВЧ',
      amount: 500,
    });
  }

  if (extras.oven) {
    extrasTotal += 700;
    breakdown.push({
      label: 'Духовка',
      amount: 700,
    });
  }

  if (extras.chandelier) {
    extrasTotal += 1000;
    breakdown.push({
      label: 'Люстра',
      amount: 1000,
    });
  }

  const subtotalBeforeDirtiness = baseCost + bathroomsSurcharge + extrasTotal;

  const dirtinessPercent = getDirtinessPercent(input.dirtinessLevel);
  const dirtinessSurcharge = Math.round((subtotalBeforeDirtiness * dirtinessPercent) / 100);

  if (dirtinessSurcharge > 0) {
    breakdown.push({
      label: `Коэффициент загрязненности (+${dirtinessPercent}%)`,
      amount: dirtinessSurcharge,
    });
  }

  const totalBeforeDiscount = subtotalBeforeDirtiness + dirtinessSurcharge;
  const totalWithDiscount = Math.round(totalBeforeDiscount * 0.9); // скидка 10%

  return {
    baseRatePerSqm: rate,
    baseCost,
    bathroomsSurcharge,
    extrasTotal,
    dirtinessPercent,
    dirtinessSurcharge,
    totalBeforeDiscount,
    totalWithDiscount,
    breakdown,
  };
}

