/**
 * Local address autocomplete dataset.
 * Edit this file to add more cities/streets or expand coverage.
 */
export interface AddressSuggestion {
  city: string;
  streets: string[];
}

export const ADDRESS_DATASET: AddressSuggestion[] = [
  {
    city: 'Москва',
    streets: [
      'Ленина',
      'Лермонтова',
      'Пушкина',
      'Гагарина',
      'Советская',
      'Мира',
      'Центральная',
      'Молодежная',
      'Школьная',
      'Садовая',
      'Лесная',
      'Новая',
      'Набережная',
      'Заводская',
      'Полевая',
      'Речная',
      'Солнечная',
      'Зеленая',
      'Комсомольская',
      'Победы',
      'Октябрьская',
      'Кирова',
      'Горького',
      'Чапаева',
      'Фрунзе',
      'Калинина',
      'Труда',
      'Строителей',
      'Первомайская',
      'Спортивная',
    ],
  },
  {
    city: 'Мытищи',
    streets: [
      'Ленина',
      'Мира',
      'Советская',
      'Пушкина',
      'Молодежная',
      'Центральная',
      'Школьная',
      'Новая',
      'Садовая',
    ],
  },
  {
    city: 'Химки',
    streets: ['Ленина', 'Мира', 'Советская', 'Молодежная', 'Центральная'],
  },
  {
    city: 'Подольск',
    streets: ['Ленина', 'Мира', 'Советская', 'Победы', 'Центральная'],
  },
  {
    city: 'Королев',
    streets: ['Ленина', 'Мира', 'Гагарина', 'Советская'],
  },
  {
    city: 'Балашиха',
    streets: ['Ленина', 'Мира', 'Советская', 'Молодежная'],
  },
  {
    city: 'Люберцы',
    streets: ['Ленина', 'Мира', 'Советская'],
  },
  {
    city: 'Электросталь',
    streets: ['Ленина', 'Мира', 'Советская'],
  },
];

/** Get cities matching prefix (case-insensitive) */
export function getCitiesByPrefix(prefix: string): string[] {
  if (!prefix.trim()) return [];
  const p = prefix.trim().toLowerCase();
  return ADDRESS_DATASET.map((a) => a.city).filter((c) => c.toLowerCase().startsWith(p));
}

/** Get streets for a city matching prefix */
export function getStreetsByPrefix(city: string, prefix: string): string[] {
  const entry = ADDRESS_DATASET.find((a) => a.city === city);
  if (!entry) return [];
  if (!prefix.trim()) return entry.streets.slice(0, 10);
  const p = prefix.trim().toLowerCase();
  return entry.streets.filter((s) => s.toLowerCase().startsWith(p)).slice(0, 15);
}

/** Validate full address: city, street, house. Returns true if valid. */
export function validateAddress(parts: { city?: string; street?: string; house?: string }): boolean {
  const { city, street, house } = parts;
  if (!city && !street && !house) return true; // empty is valid (optional)
  if (!city || !street) return false;
  const entry = ADDRESS_DATASET.find((a) => a.city === city);
  if (!entry) return false;
  if (!entry.streets.includes(street)) return false;
  if (!house || house.trim() === '') return false;
  return /^\d+[а-яА-Яa-zA-Z]?$/.test(house.trim());
}

/** Parse address string "Город, Улица, 123" into parts */
export function parseAddressString(value: string): { city?: string; street?: string; house?: string } {
  const parts = value.split(',').map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0) return {};
  if (parts.length === 1) return { city: parts[0] };
  if (parts.length === 2) return { city: parts[0], street: parts[1] };
  return { city: parts[0], street: parts[1], house: parts[2] };
}
