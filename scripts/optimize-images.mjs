// Genera variantes AVIF/WebP responsive + un JPEG de respaldo para cada foto
// del banco de contenido (src/assets/images/home/**). Los originales de
// cámara se archivan sin comprimir en /originals (fuera de git, ver
// .gitignore) para que los reruns nunca recompriman un derivado ya lossy.
// Un clon nuevo del repo no trae /originals: volver a correr este script
// desde cero en otra máquina exige tener los archivos de cámara disponibles
// localmente — consecuencia aceptada de sacarlos del control de versiones,
// tal como se pidió, no un bug del script.
import { readdir, mkdir, stat, copyFile, rename, unlink } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const SOURCE_DIR = path.join(ROOT, 'src/assets/images/home');
const ORIGINALS_DIR = path.join(ROOT, 'originals');

const RESPONSIVE_WIDTHS = [480, 768, 1200, 1600];
const AVIF_QUALITY = 72;
const WEBP_QUALITY = 78;
const FALLBACK_MAX_WIDTH = 1200;
const FALLBACK_QUALITY = 80;

const RASTER_RE = /\.(jpe?g|png)$/i;

async function findSourceImages(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...await findSourceImages(full));
        } else if (RASTER_RE.test(entry.name)) {
            files.push(full);
        }
    }
    return files;
}

// Anchos candidatos, recortados al ancho original. Si un candidato se pasa
// del original, se sustituye por el propio ancho original una sola vez
// (dedupeado) en vez de descartarlo — así image_back_complete (1536px)
// obtiene [480, 768, 1200, 1536] sin necesitar un caso especial por nombre.
function computeWidths(originalWidth, targets = RESPONSIVE_WIDTHS) {
    const widths = new Set();
    for (const t of targets) {
        if (t < originalWidth) {
            widths.add(t);
            continue;
        }
        widths.add(originalWidth);
        break;
    }
    if (widths.size === 0) {
        widths.add(originalWidth);
    }
    return [...widths].sort((a, b) => a - b);
}

// Busca por nombre base sin extensión, no por ruta exacta: cuando el
// fallback de una imagen cambia de extensión (image_back_complete.png ->
// .jpg tras la primera pasada), el archivo de trabajo de la siguiente
// ejecución ya no coincide con el nombre archivado. Si se comparara por
// ruta exacta, esa segunda ejecución archivaría por error el propio
// derivado comprimido en vez de reconocer el original ya guardado.
async function ensureArchived(sourcePath, relPath) {
    const relDir = path.dirname(relPath);
    const relBase = path.basename(relPath, path.extname(relPath));
    const archiveDir = path.join(ORIGINALS_DIR, relDir);
    await mkdir(archiveDir, { recursive: true });

    const existing = (await readdir(archiveDir))
        .find(f => path.basename(f, path.extname(f)) === relBase);
    if (existing) {
        return path.join(archiveDir, existing);
    }

    const archivePath = path.join(archiveDir, path.basename(sourcePath));
    await copyFile(sourcePath, archivePath);
    console.log(`  archivado -> originals/${path.relative(ORIGINALS_DIR, archivePath)}`);
    return archivePath;
}

async function processImage(sourcePath) {
    const relPath = path.relative(SOURCE_DIR, sourcePath);
    const dir = path.dirname(sourcePath);
    const ext = path.extname(sourcePath);
    const base = path.basename(sourcePath, ext);

    console.log(`\n${relPath}`);
    const archivePath = await ensureArchived(sourcePath, relPath);
    const image = sharp(archivePath);
    const { width: originalWidth } = await image.metadata();
    const widths = computeWidths(originalWidth);

    const staged = [];
    for (const width of widths) {
        const avifFinal = path.join(dir, `${base}-${width}.avif`);
        const webpFinal = path.join(dir, `${base}-${width}.webp`);
        const avifTmp = `${avifFinal}.tmp`;
        const webpTmp = `${webpFinal}.tmp`;

        await sharp(archivePath).resize({ width }).avif({ quality: AVIF_QUALITY }).toFile(avifTmp);
        await sharp(archivePath).resize({ width }).webp({ quality: WEBP_QUALITY }).toFile(webpTmp);
        staged.push([avifTmp, avifFinal], [webpTmp, webpFinal]);
    }

    const fallbackWidth = Math.min(FALLBACK_MAX_WIDTH, originalWidth);
    const fallbackFinal = path.join(dir, `${base}.jpg`);
    const fallbackTmp = `${fallbackFinal}.tmp`;
    await sharp(archivePath).resize({ width: fallbackWidth }).jpeg({ quality: FALLBACK_QUALITY, mozjpeg: true }).toFile(fallbackTmp);
    staged.push([fallbackTmp, fallbackFinal]);

    // Solo se renombra a destino final una vez que TODOS los derivados se
    // generaron con éxito, así un crash a mitad de proceso nunca deja un
    // derivado a medio escribir pisando al bueno anterior.
    for (const [tmp, final] of staged) {
        await rename(tmp, final);
    }

    const fallbackStat = await stat(fallbackFinal);
    if (fallbackStat.size === 0) {
        throw new Error(`Fallback JPEG vacío para ${relPath}, abortando antes de borrar el original`);
    }

    // El .png original solo se borra una vez verificado que su reemplazo
    // .jpg existe y pesa más que cero bytes.
    if (ext.toLowerCase() === '.png') {
        await unlink(sourcePath);
        console.log(`  borrado ${relPath} (reemplazado por ${base}.jpg)`);
    }

    // Limpia el .webp de una sola resolución que dejó la limpieza anterior
    // (huérfano ahora que existe el set con sufijo de ancho).
    const staleWebp = path.join(dir, `${base}.webp`);
    if (existsSync(staleWebp) && !widths.some(w => path.join(dir, `${base}-${w}.webp`) === staleWebp)) {
        await unlink(staleWebp);
        console.log(`  borrado ${base}.webp (sustituido por variantes con ancho)`);
    }

    console.log(`  anchos generados: ${widths.join(', ')} · fallback ${fallbackWidth}px`);
}

async function main() {
    const images = await findSourceImages(SOURCE_DIR);
    console.log(`Encontradas ${images.length} imágenes bajo src/assets/images/home`);
    for (const image of images) {
        await processImage(image);
    }
    console.log('\nListo.');
}

main().catch(err => {
    console.error(err);
    process.exitCode = 1;
});
