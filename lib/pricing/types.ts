export type ServiceType = 'apartment' | 'house' | 'office' | 'after_repair' | 'window' | 'other';

export interface PricingParams {
  serviceType: ServiceType;
  areaSqm: number;
  rooms?: number;
  windows?: number;
  hasBalcony?: boolean;
}

export interface PriceResult {
  basePrice: number;
  totalPrice: number;
  breakdown: { label: string; amount: number }[];
  currency: 'RUB';
}
