// Genera, antes de cada build (hook "prebuild" en package.json), archivos
// estáticos que angular.json ya copia desde public/ al build de salida:
// robots.txt, sitemap.xml, y la imagen Open Graph 1200x630. Vive en un
// script en vez de checkearse a mano para que nunca queden desactualizados
// respecto al dominio real o las rutas indexables del sitio.
//
// Única fuente de verdad de rutas indexables: este sitio es de una sola
// página (ver src/app/app.routes.ts). Si se agregan rutas reales nuevas,
// añadirlas también aquí.
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const SITE_URL = 'https://vinova.ec';
const INDEXABLE_ROUTES = ['/'];

const PUBLIC_DIR = path.join(ROOT, 'public');
const OG_SOURCE = path.join(ROOT, 'src/assets/images/home/hero/hero-karolina2.jpg');
const OG_OUT_DIR = path.join(PUBLIC_DIR, 'images/og');
const OG_OUT_FILE = path.join(OG_OUT_DIR, 'vinova-home-og.jpg');

async function writeRobotsTxt() {
    const content = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
    await writeFile(path.join(PUBLIC_DIR, 'robots.txt'), content, 'utf8');
    console.log('robots.txt generado');
}

async function writeSitemapXml() {
    const today = new Date().toISOString().slice(0, 10);
    const urls = INDEXABLE_ROUTES.map(
        route => `  <url>\n    <loc>${SITE_URL}${route}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`
    ).join('\n');
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
    await writeFile(path.join(PUBLIC_DIR, 'sitemap.xml'), xml, 'utf8');
    console.log('sitemap.xml generado');
}

async function generateOgImage() {
    await mkdir(OG_OUT_DIR, { recursive: true });
    await sharp(OG_SOURCE)
        .resize({ width: 1200, height: 630, fit: 'cover', position: 'right' })
        .jpeg({ quality: 82, mozjpeg: true })
        .toFile(OG_OUT_FILE);
    console.log('images/og/vinova-home-og.jpg generado (1200x630)');
}

await writeRobotsTxt();
await writeSitemapXml();
await generateOgImage();
