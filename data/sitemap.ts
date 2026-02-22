/**
 * Sitemap and navigation structure (source of truth).
 * URLs are kebab-case, trailing slash for GitHub Pages compatibility.
 */

export type NavItem = { label: string; href: string };

/** Main nav: all visible (no overflow "Ещё"). Direct links only — no dropdowns. */
export const mainNav: NavItem[] = [
  { label: 'Цены', href: '/prices/' },
  { label: 'Примеры работ', href: '/cases/' },
  { label: 'Отзывы', href: '/reviews/' },
  { label: 'О компании', href: '/about/' },
  { label: 'Вакансии', href: '/vacancies/' },
  { label: 'Контакты', href: '/contacts/' },
];

/** Private (individuals) dropdown: landing + subpages */
export const privateNav: NavItem[] = [
  { label: 'Услуги для частных лиц', href: '/private/' },
  { label: 'Квартира', href: '/private/apartment/' },
  { label: 'Дом/коттедж', href: '/private/house/' },
  { label: 'Мойка окон', href: '/private/window-wash/' },
  { label: 'Химчистка', href: '/private/dry-cleaning/' },
  { label: 'Озонирование', href: '/services/ozonation/' },
  { label: 'Удаление запахов', href: '/services/odor-removal/' },
  { label: 'Дезинфекция', href: '/services/disinfection/' },
];

/** Business dropdown: landing + all business type pages */
export const businessTypes: { slug: string; label: string }[] = [
  { slug: 'office', label: 'Офис' },
  { slug: 'warehouse', label: 'Склад' },
  { slug: 'facades', label: 'Фасады/вывески' },
  { slug: 'production', label: 'Производство/цех' },
  { slug: 'windows-climbing', label: 'Окна/альпинизм' },
  { slug: 'residential-complex', label: 'ЖК/подъезд' },
  { slug: 'store', label: 'Магазин/шоу-рум' },
  { slug: 'cafe', label: 'Кафе/ресторан' },
  { slug: 'parking', label: 'Парковка' },
  { slug: 'pool-fountain', label: 'Бассейн/фонтан' },
  { slug: 'school', label: 'Школа/детсад' },
  { slug: 'clinic', label: 'Поликлиника/больница' },
  { slug: 'car-service', label: 'Автосервис/автосалон' },
  { slug: 'mall', label: 'Торговый центр/бизнес центр' },
  { slug: 'fitness', label: 'Фитнес клуб' },
  { slug: 'hotel', label: 'Гостиница/отель' },
  { slug: 'dry-cleaning', label: 'Химчистка' },
  { slug: 'odor-removal', label: 'Удаление запахов' },
  { slug: 'ozonation', label: 'Озонирование' },
  { slug: 'disinfection', label: 'Дезинфекция' },
  { slug: 'salon', label: 'Салон красоты/парикмахерская' },
  { slug: 'administrative', label: 'Административное здание' },
  { slug: 'entertainment', label: 'Развлекательное учреждение' },
  { slug: 'other', label: 'Другие нежилые помещения' },
];

export const businessNav: NavItem[] = [
  ...businessTypes.map((t) => ({ label: t.label, href: `/business/${t.slug}/` })),
];

/** Private subpages: apartment types (anchors on /private/apartment/) */
export const apartmentAnchors: { id: string; label: string }[] = [
  { id: 'posle-remonta', label: 'После ремонта/строительства' },
  { id: 'generalnaya', label: 'Генеральная' },
  { id: 'podderzhivayushchaya', label: 'Поддерживающая' },
  { id: 'vip', label: 'VIP' },
  { id: 'kuhnya-sanuzel', label: 'Кухня/санузел' },
  { id: 'pereezd', label: 'До/после переезда' },
  { id: 'potop', label: 'После потопа' },
  { id: 'pozhar', label: 'После пожара' },
  { id: 'arenda', label: 'До/после аренды' },
  { id: 'dezinfekciya', label: 'После дезинфекции' },
  { id: 'zapushchennye', label: 'Запущенные' },
  { id: 'posle-smerti', label: 'После смерти' },
  { id: 'prazdnik', label: 'Перед праздником' },
  { id: 'meropriyatie', label: 'После мероприятия' },
  { id: 'rozhdenie', label: 'Перед рождением' },
  { id: 'eko', label: 'Эко' },
  { id: 'dop-uslugi', label: 'Дополнительные услуги' },
];

/** Private house anchors */
export const houseAnchors: { id: string; label: string }[] = [
  { id: 'posle-remonta', label: 'После ремонта/строительства' },
  { id: 'generalnaya', label: 'Генеральная' },
  { id: 'podderzhivayushchaya', label: 'Поддерживающая' },
  { id: 'vip', label: 'VIP' },
  { id: 'arenda', label: 'После аренды' },
  { id: 'pereezd', label: 'После переезда' },
  { id: 'prazdnik', label: 'Перед праздником' },
  { id: 'meropriyatie', label: 'После мероприятия' },
  { id: 'zapushchennye', label: 'Запущенные' },
  { id: 'rozhdenie', label: 'Перед рождением' },
  { id: 'eko', label: 'Эко' },
  { id: 'bassejn', label: 'Клининг бассейна' },
  { id: 'fontan', label: 'Клининг фонтана' },
  { id: 'territoriya', label: 'Уборка придомовой территории' },
  { id: 'bruschatka', label: 'Мойка брусчатки' },
  { id: 'dop-uslugi', label: 'Дополнительные услуги' },
];

/** Window wash anchors */
export const windowWashAnchors: { id: string; label: string }[] = [
  { id: 'seasonal', label: 'Сезонная' },
  { id: 'posle-remonta', label: 'После ремонта' },
  { id: 'alpinisty', label: 'Альпинистами' },
];

/** Dry cleaning (private) anchors */
export const dryCleaningAnchors: { id: string; label: string }[] = [
  { id: 'mebel', label: 'Мебели' },
  { id: 'kovry', label: 'Ковровых покрытий' },
  { id: 'spalnoe', label: 'Спального места' },
  { id: 'shtory', label: 'Штор' },
];

export function getBusinessBySlug(slug: string) {
  return businessTypes.find((t) => t.slug === slug);
}
