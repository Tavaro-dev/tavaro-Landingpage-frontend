import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { HERO_BY_ROUTE } from '../../lib/content/heroRoutes';
import { HERO_IMAGES } from '../../lib/content/heroImages';

// HERO_BY_ROUTE is preloaded on link hover; a stale entry would load the wrong photo and the page would wait again.
const pageFile = (route: string) => `app/(marketing)${route === '/' ? '' : route}/page.tsx`;

describe('hero photo per route', () => {
  for (const [route, stem] of Object.entries(HERO_BY_ROUTE)) {
    it(`${route} -> ${stem}`, () => {
      expect(HERO_IMAGES[stem], 'made by npm run heroes').toBeDefined();
      if (route.startsWith('/resorts/things-to-do/')) return; // first slide of the tiles hero, from thingsToDoData
      if (route === '/') return expect(readFileSync('components/shared/HomeHero.tsx', 'utf8')).toMatch(`/${stem}.jpg`);
      const src = readFileSync(pageFile(route), 'utf8');
      const hero = src.match(/import heroPhoto from "[^"]*\/([\w-]+)\.jpg"/)?.[1] ?? src.match(/photoSrc="[^"]*\/([\w-]+)\.jpg"/)?.[1];
      expect(hero).toBe(stem);
    });
  }
});
