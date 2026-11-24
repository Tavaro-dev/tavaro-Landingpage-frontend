import { beforeAll, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

// The routing in proxy.ts for each host: where a path is shown, and where an old address sends you.
let proxy: (req: NextRequest) => Response | undefined;
let siteUrl: (path: string) => string;

beforeAll(async () => {
  vi.stubEnv('NEXT_PUBLIC_ROOT_DOMAIN', 'tavaro.in'); // read when the modules load
  vi.resetModules();
  ({ proxy } = await import('../../proxy'));
  ({ siteUrl } = await import('../../lib/subdomains'));
});

const visit = (host: string, path: string, dest = 'document') =>
  proxy(new NextRequest(`https://${host}${path}`, { headers: { host, 'sec-fetch-dest': dest } }));

describe('subdomain addresses', () => {
  it('gives each section its subdomain', () => {
    expect(siteUrl('/resorts')).toBe('https://resort.tavaro.in/');
    expect(siteUrl('/resorts/venues#map')).toBe('https://resort.tavaro.in/venues#map');
    expect(siteUrl('/residences/leela')).toBe('https://residence.tavaro.in/leela');
    expect(siteUrl('/wellness')).toBe('https://wellness.tavaro.in/');
    expect(siteUrl('/contact')).toBe('https://tavaro.in/contact');
    expect(siteUrl('#register-interest')).toBe('#register-interest');
  });
});

describe('proxy', () => {
  it('shows the section on its subdomain', () => {
    expect(visit('resort.tavaro.in', '/venues')?.headers.get('x-middleware-rewrite')).toBe('https://resort.tavaro.in/resorts/venues');
    expect(visit('mare.tavaro.in', '/')?.headers.get('x-middleware-rewrite')).toBe('https://mare.tavaro.in/mare');
  });

  it('leaves the group pages and the checkout alone', () => {
    expect(visit('tavaro.in', '/')).toBeUndefined();
    expect(visit('tavaro.in', '/contact')).toBeUndefined();
    expect(visit('resort.tavaro.in', '/checkout')).toBeUndefined();
    expect(visit('preview.vercel.app', '/resorts')).toBeUndefined();
  });

  it.each([
    ['tavaro.in', '/resorts/venues', 'https://resort.tavaro.in/venues'],
    ['resort.tavaro.in', '/resorts/venues', 'https://resort.tavaro.in/venues'],
    ['resort.tavaro.in', '/contact', 'https://tavaro.in/contact'],
    ['resort.tavaro.in', '/residences/leela', 'https://residence.tavaro.in/leela'],
  ])('%s%s moves to %s', (host, path, to) => {
    const res = visit(host, path);
    expect(res?.status).toBe(308);
    expect(res?.headers.get('location')).toBe(to);
  });

  it('answers a background page fetch with nothing, so the browser loads the new address in full', () => {
    expect(visit('tavaro.in', '/resorts', 'empty')?.status).toBe(204);
  });
});
