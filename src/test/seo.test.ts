/// <reference types="node" />
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const robotsTxt = fs.readFileSync(path.join(__dirname, '../../public/robots.txt'), 'utf-8');
const sitemapXml = fs.readFileSync(path.join(__dirname, '../../public/sitemap.xml'), 'utf-8');

const deferredSlugs = ['riyaah', 'icici-bank-atm-kiosk', 'ambit', 'northernarc', 'citrus'];
const shippedSlugs = [
  'cad',
  'verzion-cloud-migration',
  'tata-capital-ai-interface',
  'mashreq',
  'astrosure.ai',
  'adreport.io',
];

// ──────────────────────────────────────────────────────────────────────────────
// robots.txt
// ──────────────────────────────────────────────────────────────────────────────

describe('robots.txt', () => {
  it.each(deferredSlugs)('disallows deferred case-study slug: %s', (slug) => {
    expect(robotsTxt).toContain(`Disallow: /case-study/${slug}`);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// sitemap.xml
// ──────────────────────────────────────────────────────────────────────────────

describe('sitemap.xml', () => {
  it.each(deferredSlugs)('does not contain deferred case-study slug: %s', (slug) => {
    expect(sitemapXml).not.toContain(slug);
  });

  it.each(shippedSlugs)('contains shipped case-study slug: %s', (slug) => {
    expect(sitemapXml).toContain(slug);
  });
});
