#!/usr/bin/env node
/**
 * Smoke test: fetch home page from running dev server and verify key content.
 * Usage: npm run dev (in another terminal) && node scripts/smoke-test.mjs
 * Or: npm run build && npm run start && node scripts/smoke-test.mjs
 */
const BASE = process.env.BASE_URL || 'http://localhost:3000';

async function main() {
  try {
    const res = await fetch(BASE);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const checks = [
      ['БОЛЬШАЯ УБОРКА', 'Hero headline'],
      ['Рассчитать', 'Calculator CTA'],
      ['Наши услуги', 'Services section'],
      ['Обратный звонок', 'Callback CTA'],
      ['Расчёт стоимости', 'Quiz/calculator section'],
      ['Тип уборки', 'Calculator form label'],
    ];
    for (const [text, label] of checks) {
      if (html.includes(text)) {
        console.log(`✓ ${label}`);
      } else {
        console.error(`✗ ${label}: missing "${text}"`);
        process.exit(1);
      }
    }
    // Container uses max-w 1280px; built HTML may contain escaped or minified class
    if (!html.includes('1280')) {
      console.error('✗ Container layout (1280) not found in HTML');
      process.exit(1);
    }
    console.log('✓ Container layout present');
    console.log('Smoke test passed.');
  } catch (e) {
    console.error('Smoke test failed:', e.message);
    if (e.cause?.code === 'ECONNREFUSED' || e.message?.includes('fetch failed')) {
      console.error('');
      console.error('Сервер не запущен. Запустите в одном терминале:  npm run dev');
      console.error('Затем в другом терминале:  npm run smoke');
    } else {
      console.error('Убедитесь, что dev-сервер запущен: npm run dev');
    }
    process.exit(1);
  }
}

main();
