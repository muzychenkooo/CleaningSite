/**
 * Расчёт стоимости для подробного калькулятора.
 *
 * Формула (точно по ТЗ):
 *   price = (#2 × #4) + #6 + #7 + (1200 × #8) + (70 × #10)
 *
 * Где:
 *   #2 — тариф руб/м² (из Q2)
 *   #4 — площадь квартиры/дома м² (из Q4)
 *   #6 — доплата за санузлы (из Q6)
 *   #7 — сумма доп. услуг (из Q7)
 *   #8 — количество окон (из Q8)
 *   #10 — площадь озонирования м² (из Q10)
 *
 * Если вопрос не входит в выбранную ветку, его значение = 0.
 */

export interface CalculatorPriceParams {
  /** #2: тариф руб/м² */
  tariffPerM2: number;
  /** #4: площадь м² */
  areaM2: number;
  /** #6: доплата за санузлы (руб) */
  bathroomsCost: number;
  /** #7: сумма доп. услуг (руб) */
  extrasCost: number;
  /** #8: количество окон */
  windowsCount: number;
  /** #10: площадь озонирования м² */
  ozoneArea: number;
}

/**
 * Итоговая цена по формуле:
 * price = (#2 × #4) + #6 + #7 + (1200 × #8) + (70 × #10)
 */
export function calculateDetailedPrice(params: CalculatorPriceParams): number {
  const { tariffPerM2, areaM2, bathroomsCost, extrasCost, windowsCount, ozoneArea } = params;
  return (
    tariffPerM2 * areaM2 +
    bathroomsCost +
    extrasCost +
    1200 * windowsCount +
    70 * ozoneArea
  );
}
