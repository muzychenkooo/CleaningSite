export type ServiceCategory = 'individuals' | 'business';

export const serviceCategories = [
  { id: 'individuals' as const, label: 'Для частных клиентов', slug: 'chastnym-klientam' },
  { id: 'business' as const, label: 'Для бизнеса', slug: 'yuridicheskim-licam' },
];

export const services = [
  {
    id: 'uborka-kvartir',
    slug: 'uborka-kvartir',
    title: 'Уборка квартир',
    shortDesc: 'Профессиональная уборка квартир любой площади. Мойка окон, уборка мебели и сантехники. Гибкий график и безопасность.',
    category: 'individuals' as const,
    featured: true,
  },
  {
    id: 'uborka-domov',
    slug: 'uborka-domov',
    title: 'Уборка частных домов',
    shortDesc: 'Спектр услуг по уборке помещений различного назначения.',
    category: 'individuals' as const,
    featured: true,
  },
  {
    id: 'mojka-okon',
    slug: 'mojka-okon',
    title: 'Мытье окон',
    shortDesc: 'Мойка окон и фасадов: профессиональные услуги, современное оборудование, экологически чистые средства.',
    category: 'individuals' as const,
    featured: true,
  },
  {
    id: 'himchistka',
    slug: 'himchistka',
    title: 'Химчистка',
    shortDesc: 'Химчистка коммерческих помещений: профессиональная уборка, дезинфекция и уход за мебелью.',
    category: 'individuals' as const,
    featured: true,
  },
  {
    id: 'ozonirovanie',
    slug: 'ozonirovanie',
    title: 'Озонирование',
    shortDesc: 'Озонирование помещений для дезинфекции и удаления запахов.',
    category: 'individuals' as const,
    featured: false,
  },
  {
    id: 'udalenie-zapahov',
    slug: 'udalenie-zapahov',
    title: 'Удаление запахов',
    shortDesc: 'Профессиональное удаление стойких запахов.',
    category: 'individuals' as const,
    featured: false,
  },
  {
    id: 'dezinfekciya',
    slug: 'dezinfekciya',
    title: 'Дезинфекция',
    shortDesc: 'Дезинфекция помещений.',
    category: 'individuals' as const,
    featured: false,
  },
  {
    id: 'uborka-ofisov',
    slug: 'uborka-ofisov',
    title: 'Уборка офисов',
    shortDesc: 'Профессиональная уборка офисов любой площади и сложности. Мойка окон, уборка мебели и сантехники. Гибкий график и безопасность.',
    category: 'business' as const,
    featured: true,
  },
  {
    id: 'uborka-proizvodstvo',
    slug: 'uborka-proizvodstvo',
    title: 'Уборка на производстве',
    shortDesc: 'Спектр услуг по уборке помещений различного назначения.',
    category: 'business' as const,
    featured: true,
  },
  {
    id: 'mojka-okon-alpinizm',
    slug: 'mojka-okon-alpinizm',
    title: 'Мытье окон и фасадов',
    shortDesc: 'Мойка окон и фасадов: профессиональные услуги, современное оборудование, экологически чистые средства.',
    category: 'business' as const,
    featured: true,
  },
  {
    id: 'uborka-skladov',
    slug: 'uborka-skladov',
    title: 'Уборка на складе',
    shortDesc: 'Уборка на складе: чистота и порядок для вашего бизнеса. Обратитесь к нам за услугами профессионального клининга.',
    category: 'business' as const,
    featured: true,
  },
  {
    id: 'uborka-fasadov',
    slug: 'uborka-fasadov',
    title: 'Уборка фасадов/вывесок',
    shortDesc: 'Уборка фасадов и вывесок.',
    category: 'business' as const,
    featured: false,
  },
  {
    id: 'uborka-zhilkompleksov',
    slug: 'uborka-zhilkompleksov',
    title: 'Уборка жилых комплексов или подъездов',
    shortDesc: 'Уборка общих зон жилых комплексов и подъездов.',
    category: 'business' as const,
    featured: false,
  },
  {
    id: 'uborka-magazina',
    slug: 'uborka-magazina',
    title: 'Уборка магазина или шоурума',
    shortDesc: 'Уборка торговых помещений и шоурумов.',
    category: 'business' as const,
    featured: false,
  },
  {
    id: 'uborka-kafe',
    slug: 'uborka-kafe',
    title: 'Уборка в кафе/ресторане',
    shortDesc: 'Уборка в кафе и ресторанах.',
    category: 'business' as const,
    featured: false,
  },
  {
    id: 'uborka-parkovki',
    slug: 'uborka-parkovki',
    title: 'Уборка на парковке',
    shortDesc: 'Уборка парковок.',
    category: 'business' as const,
    featured: false,
  },
] as const;

export function getServiceBySlug(slug: string) {
  return services.find((s) => s.slug === slug);
}

export function getFeaturedServices(category?: ServiceCategory) {
  const featured = services.filter((s) => s.featured);
  return category ? featured.filter((s) => s.category === category) : featured;
}
