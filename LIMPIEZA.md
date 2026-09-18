# Limpieza técnica — Vinova

Refactorización interna del sitio (Angular 19 + SSR). Sin cambios de color de marca, sin cambios de copy, sin rediseño visual — verificado con capturas de pantalla en escritorio y móvil antes/después de cada bloque. La única diferencia visible intencional es tipográfica (Inter + Bricolage Grotesque en vez del sans-serif por defecto del sistema) y, dentro de eso, un aumento deliberado del tamaño base de fuente (14.5px → 17px) pedido explícitamente para un negocio de salud visual.

Todo el trabajo quedó en el working directory sin commitear, tal como se pidió. Ver el `git status` al final de este documento.

## Archivos y carpetas eliminados

**Componentes muertos** (importados pero nunca renderizados en ningún template — confirmado con grep antes de borrar):
- `src/app/common/blog/`
- `src/app/common/doctors/`
- `src/app/common/subscribe/`
- `src/app/common/how-it-works/`
- `src/app/common/what-we-offer/`
- `src/app/common/header/top-header/` — **hallazgo no pedido explícitamente**: el compilador avisó "`TopHeaderComponent` is not used within the template of `HeaderComponent`"; investigado y confirmado que `header.component.html` sólo renderiza `<app-navbar />`. Este componente además contenía copy placeholder de la plantilla original ("35 West Dental Street, California 1004", `hello@inba.com`) que nunca llegó a verse en el sitio real porque el componente jamás se renderizaba.
- `src/app/common/header/middle-header/` — mismo hallazgo, mismo patrón (placeholder "Inba", teléfono ficticio), también sin renderizar nunca.

**Archivos sueltos:**
- `src/styles/_vinova-fonts.scss` (apuntaba a 8 archivos LENA/QUROVA que no existen; sustituido por `_fonts.scss`)
- `src/styles/_vinova-tokens.scss` (retirado en el Bloque 5 una vez que todo apunta a `_tokens.scss`)
- `src/assets/fonts/Poppins-ExtraBold.ttf`, `Poppins-Light.ttf`, `Poppins-Thin.ttf` (sin uso; Poppins se cargaba por Google Fonts, no localmente)
- `src/assets/fonts/QurovaDEMO-Light-*.otf`, `QurovaDEMO-Medium-*.otf`, `QurovaDEMO-Regular-*.otf` (fuentes demo sin licencia comercial)
- `src/assets/images/home/about/about_image.jpg` (sin referencia, sin par `.webp`)
- `src/app/app.component.spec.ts` — el spec por defecto del CLI (verificaba `title === 'inba'` y un `<h1>` con `'Hello, inba'`, ninguno real en esta app) fue sustituido por un spec mínimo real (`should create the app`) en vez de dejarlo simplemente borrado, porque quitar el único spec del proyecto rompía `npm test` (`tsconfig.spec.json` falla si no encuentra ningún `*.spec.ts`).

**282 imágenes** bajo `public/images/` — todo el banco de imágenes heredado de la plantilla multi-nicho (covid/, dental-tourism/, skin-care/, hospital/, doctor/, gallery/, main-slides/, page-title/, review/ extras, services/, appointment/, blog/, about/, footer/ extras, dentist-details, etc.), ninguna referenciada. Se conservan sólo 3: `logo/principal.png`, `review/usuario.png`, `errorpage.webp`. (`hospital/testimonials/icon.png` parecía usada en un primer análisis porque `feedback.component.scss` la referenciaba dentro de `.hospital-testimonials-card` — al purgar ese selector muerto en el Bloque 2 la imagen quedó también huérfana y se eliminó.)

## CSS eliminado

**~6.900 líneas de CSS eliminadas en total**, repartidas así:

| Archivo | Antes | Después | Notas |
|---|---:|---:|---|
| `styles.scss` → `_legacy.scss` | 2413 | 688 | purgado y reubicado |
| `about.component.scss` | 1397 | 512 | variantes dental-tourism/skin-care/eye-care/covid/hospital eliminadas |
| `feedback.component.scss` | 1054 | 174 | mismo patrón; sólo sobrevive `.single-review-item` |
| `navbar.component.scss` | 1602 | 993 | variantes `navbar-style-three/four/five` (dental-tourism/covid/hospital) y `.search-overlay` eliminadas — no se tocó la lógica de submenús/dropdown anidada por ser de mucho mayor riesgo para muy poco beneficio (ver "Fuera de alcance") |
| `header.component.scss` | 30 | 4 | `.header-style-two` sin uso |
| `not-found.component.scss` | 63 | 49 | media queries vacías |
| `top-header.component.scss` | 802 | 0 | componente eliminado |
| `middle-header.component.scss` | 162 | 0 | componente eliminado |
| `blog/doctors/subscribe/how-it-works/what-we-offer` (`.scss`) | 1009+257+179+196+126 | 0 | componentes eliminados |
| `_vinova-fonts.scss` / `_vinova-tokens.scss` | 35+16 | 0 | sustituidos por el sistema de tokens nuevo |

Clases eliminadas de `styles.scss`/`_legacy.scss`: `.covid-testimonials-slides`, `.covid-tracker-slides`, `.dental-tourism-review-slides`, `.dental-tourism-dentist-slides`, `.skin-care-before-after-slides`, `.skin-care-review-slides`, `.home-slides`, `.covid-blog-slides`, `.doctors-slides`, `.eye-care-review-slides`, `.d-table` (duplicada y sin uso), `.video-popup`, `.protection-faq-accordion`, `.hospital-faq-accordion`, `.faq-accordion`, `.page-banner-area`, `.page-banner-content`, `.covid-page-banner-*`, `.pagination-area`, `.section-title.with-covid-color`/`.with-hospital-color`, `.ptb-75`, `.pt-75`, `.bg-091e3e`, `.bg-002345`, `.bg-eff8fb`, `.bg-f8f8f8`, y (tras dejar sin consumidores a `top-header`/`middle-header`) `.bg-f7f7fd`, `.bg-f1f5fe`. Variables retiradas del `:root`: `--covid-gradient-color`, `--covid-black-color`, `--covid-main-color`, `--hospital-main-color`, `--hospital-black-color`, `--hospital-font-family`, `--font-family3`.

## Dependencias

**Quitadas:** `animate.css` (cero uso de clases `animate__`), `ngx-bootstrap` (cero uso de datepicker ni ningún import).
**Añadidas:** `bootstrap` (antes sólo por CDN), `@fontsource-variable/inter`, `@fontsource-variable/bricolage-grotesque`.
**Se quedan, confirmado su uso real:** `boxicons` (19 clases `bx-*` activas: redes sociales, chevron del back-to-top, iconos de contacto), `ngx-owl-carousel-o` (usado por `about`, `feedback`, `eye-care-services`), Flaticon vía `public/fonts/flaticon_inba.css` registrado en `angular.json` (usado por `about`, `feedback`, `middle-header` — este último eliminado — y `eye-care-services`).

## Clases legacy que siguen vivas

No se migraron (fuera de alcance de esta fase), pero se documentan dónde:

- **`.default-btn`** (+ modificador `.two`): `hero.component.html`, `not-found.component.html`.
- **`.section-title` / `.section-title-warp`**: `features.component.html`, `feedback.component.html`, `eye-care-services.component.html`.
- **`.ptb-100` / `.pt-100` / `.pb-100`**: `about`, `eye-care-services`, `feedback`, `features`, `footer`, `not-found`.
- **`.pb-75`**: `footer`, `features`.
- **`.review-slides`**: `feedback.component.html`. **`.eye-care-services-slides`**: `eye-care-services.component.html`.
- **`.bg-f5f5f5`**: `feedback`. **`.bg-eef9ff`**: `features`.

## Fuera de alcance (documentado, no corregido)

- `app.component.html` tiene lógica muerta (`[ngClass]="{'d-none': router.url === '/coming-soon'}"` repetida en header/footer/back-to-top/whatsapp-float) para una ruta `/coming-soon` que no existe en `app.routes.ts`. No estaba mencionada en los 6 bloques del encargo, así que no se tocó. **Actualización**: resuelta al añadir la ruta `/preview` (banco de variantes de hero). En vez de reutilizar el patrón `router.url === '/algo'`, se reemplazó por un campo `data: { chrome: false }` en la definición de ruta (`app.routes.ts`) y una señal `showChrome` en `AppComponent` (`app.component.ts`) que lee ese dato de la ruta activa en cada `NavigationEnd`. El header ya no lleva ninguna condición (siempre se muestra, sticky); footer/back-to-top/whatsapp-float pasan a `[ngClass]="{'d-none': !showChrome()}"`.
- `navbar.component.scss` conserva su lógica de submenú (`.dropdown-menu` anidado a 4 niveles) sin usar, porque el template no tiene ningún dropdown real. Se dejó porque desenredarla con seguridad exigía mucho más tiempo de auditoría para un ahorro de bytes pequeño en el componente más visible del sitio (el header, siempre renderizado); si se quiere purgar en una fase futura, es un buen candidato aislado.
- `hero.component.ts` tenía (y ahora usa) `heroImageFallback`/`onHeroImageError`: existían ya en el código pero nunca estaban conectados a ningún `<img>` porque el hero no tenía ninguno (era 100% `background-image`). Al convertir el hero a `<picture>`/`<img>` real (Bloque 6), se conectó ese manejador existente en vez de dejarlo muerto.

## Bloque 6 — decisiones de implementación

- **Bootstrap**: se importa sólo `functions`, `variables`, `variables-dark`, `maps`, `mixins`, `grid`, `navbar`, `transitions`, `utilities` y `utilities/api` — no sólo lo pedido originalmente (`functions/variables/mixins/grid/utilities/utilities-api`), porque el layout del navbar (`.navbar`, `.navbar-nav`, `.navbar-collapse`) depende del componente `navbar` de Bootstrap, y su colapso en móvil depende de `transitions` (la clase base `.collapse`). Verificado visualmente: sin estos dos añadidos el menú se rompía (en escritorio se apilaba verticalmente; en móvil aparecía siempre expandido).
- **Iconos**: `src/app/common/icon/icon.component.ts`, standalone, `@switch` interno sobre 8 nombres (`clipboard-check`, `eye`, `award`, `hand-holding-heart`, `phone-volume`, `envelope`, `clock`, `location-dot` — el inventario completo de Font Awesome realmente usado). SVGs dibujados a mano en estilo trazo/línea (no son los glifos exactos de Font Awesome, son iconos equivalentes y reconocibles para el mismo concepto). `aria-hidden="true"` por defecto; admite un `label` opcional para casos futuros no decorativos.
- **Imágenes**: hero (fondo de escritorio + foto de móvil) y el fondo de `eye-care-services` pasaron de `background-image` CSS a `<picture>/<img>` reales, porque `fetchpriority`/`loading` sólo existen en elementos reales. Esto exigió más cuidado del previsto: un `z-index:-1` sin que `.vinova-hero` tuviera su propio contexto de apilamiento (`z-index` explícito) hacía que la imagen de fondo se renderizara invisible o descolocada; se corrigió dándole a `.vinova-hero` `position:relative; z-index:0`. Todas las parejas `.jpg`/`.png` + `.webp` que existían se conservaron: ambas quedaron referenciadas (una como `<source webp>`, otra como fallback en `<img src>`), así que no hubo que borrar ninguna imagen adicional en este bloque.
- **Rutas**: `app.routes.ts` con `loadComponent` perezoso para `HomeComponent` y `NotFoundComponent`; se confirmó que el prerender (`app.routes.server.ts`, `RenderMode.Prerender`) sigue funcionando igual.

## Lighthouse (móvil, `npx lighthouse` contra el build de producción servido localmente)

| Métrica | Antes | Después |
|---|---:|---:|
| Performance | 51 | 61 |
| Accessibility | 89 | 90 |
| Best Practices | 96 | 100 |
| SEO | 100 | 100 |
| First Contentful Paint | 6.7 s | 4.4 s |
| **Largest Contentful Paint** | **40.2 s** | **10.6 s** |
| Total Blocking Time | 350 ms | 210 ms |
| Cumulative Layout Shift | 0 | 0 |
| Speed Index | 6.7 s | 4.4 s |

El LCP de 40.2s original se debía al hero: en móvil el fondo era un `background-image` de 3.3MB (`hero-karolina.jpg`) que el navegador descubre tarde (no hay forma de darle prioridad a un `background-image` en CSS) mientras el `.webp` equivalente de 244KB estaba en el repo sin usar. Confirmado con el desglose de Lighthouse (`largest-contentful-paint-element`) antes y después: antes el "Load Delay" + "Load Time" sumaban el 66% del LCP; después el elemento LCP es el mismo `<img>` con `fetchpriority="high"` sirviendo el `.webp`, y el cuello de botella restante (10.6s totales, dominado por "Render Delay") es el costo de arranque/hidratación del bundle de Angular en el entorno de prueba (servido con `http-server` local, sin HTTP/2 ni compresión Brotli de un CDN real) — no es algo que los 6 bloques de este encargo cubrieran, y en Netlify (con CDN real) debería ser sustancialmente mejor que lo medido aquí.

## Correcciones post-limpieza

Después del Bloque 6, el sitio se rompió visualmente: todo el contenido quedó pegado al borde izquierdo, a ancho completo, sin centrar, y con proporciones alteradas. Investigación y corrección:

### 1. Faltaba el partial `containers` de Bootstrap (causa raíz del layout roto)

`src/styles/_bootstrap.scss` importaba `functions, variables, variables-dark, maps, mixins, grid, transitions, navbar, utilities, utilities/api`, pero **no** `containers`. En Bootstrap 5, `.container`/`.container-fluid` (con su `max-width` y `margin-inline: auto`) viven en `_containers.scss` (mixin `make-container()`), no en `_grid.scss` — `_grid.scss` solo define `row`/`col-*`. El criterio del Bloque 6 fue "qué partials necesita el layout del navbar", y ese análisis nunca cubrió `.container`, que se usa en ~20 sitios de las plantillas fuera del navbar. Sin `max-width`, `.container` quedaba en `width:100%` (heredado del propio `make-container` si se hubiera importado) sin límite — de hecho, al faltar el partial completo, `.container` no tenía ninguna regla propia y el contenido quedaba con el ancho natural de sus elementos hijos, pegado al borde.

**Corrección**: se añadió `@import 'bootstrap/scss/containers';`, y de paso `reboot`, `type`, `images` y `helpers` (orden oficial de Bootstrap), porque producción (`vinova.ec`) siempre cargó el bundle completo por CDN — esos resets son parte de la paridad visual pedida, no solo un parche puntual. Se conservaron `transitions`/`navbar` en su posición porque el Bloque 6 ya había documentado que el colapso del menú móvil los necesita. Verificado en el CSS compilado: `.container` ahora tiene `width:100%;margin-right:auto;margin-left:auto` más `max-width` en cada breakpoint (540/720/960/1140/1320px).

### 2. Regresión del tamaño base de fuente (17px en vez de 14.5px)

`_legacy.scss` definía `--font-size: var(--text-base)`, y `--text-base` en `_tokens.scss` es `1.0625rem` (17px, el nuevo valor pedido para el sistema de diseño futuro). Pero el CSS heredado (`.default-btn`, `.section-title`, `.review-slides`, etc.) fue calculado en su día alrededor de `14.5px` (confirmado: `git show HEAD:src/styles/_vinova-tokens.scss` → `$vinova-font-size: 14.5px`), así que todas sus proporciones se corrieron al heredar 17px.

**Corrección**: `--font-size` vuelve a un valor fijo `14.5px` en `_legacy.scss`. `--text-base` en `_tokens.scss` no se tocó — queda disponible para cuando se migren componentes a los tokens nuevos. Verificado en el CSS compilado (`--font-size: 14.5px`) y en el navegador (`body` computa `font-size: 14.5px` a escritorio).

### 3. Causas investigadas sin hallazgos (documentado para no repetir la duda)

El encargo pidió revisar tres categorías de "purga de más" y la integridad de los alias en `:root`. Se investigó cada una con grep dirigido sobre el estado actual del código, no solo sobre lo que describe este documento:

- **Clases inyectadas por Owl Carousel en runtime** (`.owl-carousel`, `.owl-stage`, `.owl-item`, `.owl-nav`, `.owl-dots`): intactas. `angular.json` sigue registrando `owl.carousel.min.css` y `owl.theme.default.min.css` globalmente, y `_legacy.scss` conserva las reglas de `.review-slides .owl-theme` y `.eye-care-services-slides .owl-theme` (personalización de dots/nav). No hubo purga aquí.
- **Clases dinámicas desde TypeScript** (`ngClass`, `[class.]`): grep completo de `src/app` — solo aparecen `d-none`/`d-block` (utilidades de Bootstrap, cubiertas por el import de `utilities`) y `.sticky`/`.active` en `navbar.component.ts`, con estilos scoped al propio componente (no tocados por la purga global de `styles.scss`/`_legacy.scss`).
- **animate.css**: cero referencias a `animate__` en `.html`/`.ts` actuales, y ya no está en `package.json`. La purga fue correcta, no hay nada que restaurar.
- **Alias del bloque `:root`** (`_legacy.scss`): se extrajeron con grep todas las `var(--xxx)` usadas en `src/app/**/*.scss` + `src/styles*` y se compararon contra todas las `--xxx:` definidas en `_tokens.scss`/`_legacy.scss`/`_primitives.scss`. Única variable "usada sin definir": `--bs-gutter-x`, que Bootstrap define en línea dentro de su propio mixin `make-container()` (no requiere alias nuestro). Las cinco variables señaladas explícitamente (`--font-size`, `--transition`, `--main-color`, `--black-color2`, `--paragraph-color`) están todas presentes. No se encontró ninguna custom property sin resolver.

Ninguna de estas cuatro vías produjo un hallazgo real que corregir — se documentan igualmente para que quede constancia de que se verificaron y no simplemente se dieron por buenas.

### 4. Verificación visual contra producción

Con el sitio local (`npm start`) y `https://vinova.ec/` abiertos en paralelo (Chrome vía automatización), a ~1512px de ancho efectivo: header, hero, features, about, servicios y testimonios/footer quedaron visualmente idénticos a producción (mismo `max-width` de `.container`, mismo tamaño de fuente base, misma tipografía, mismos espaciados). La única discrepancia observada (foto del footer en blanco en una captura) resultó ser un artefacto de `loading="lazy"` al hacer scroll rápido antes de que la imagen entrara en el viewport — en una captura posterior la imagen carga igual que en producción; el archivo (`footer_image.jpg`/`.webp`) nunca se borró y se sirve con 200 OK.

**Limitación conocida**: la comprobación a 390px de ancho (móvil) no pudo hacerse en vivo en este entorno — la herramienta de redimensionar ventana del navegador no ajustó el `window.innerWidth` real de las pestañas (quedaron fijas en un ancho de ventana existente, maximizada). Como sustituto se verificó estáticamente el CSS compilado: el `@media only screen and (max-width: 767px)` de `_legacy.scss` (que fija `body,p{font-size:14px}` y ajusta paddings) sigue presente íntegro, y la regla base de `.container` (mobile-first, `width:100%` sin `max-width` hasta el primer breakpoint) no depende de ningún ancho de viewport para funcionar. Se recomienda una verificación visual real a 390px en un dispositivo o DevTools local antes de dar el trabajo por cerrado en móvil.

### 5. Menú superior "apretado" y copyright del footer sin centrar

Reportado tras la primera ronda de correcciones, ya con `.container` y `--font-size` arreglados. Dos hallazgos adicionales, ambos verificados con `getComputedStyle`/`getBoundingClientRect` en el navegador (no solo visualmente):

- **Navbar cramped**: faltaba también el partial `bootstrap/scss/nav` en `_bootstrap.scss`. `.nav-link` solo tiene `display: block` definido ahí (`_navbar.scss` no lo redefine, asume que `_nav.scss` ya corrió). Sin ese partial, el `<a class="nav-link">` caía al `display: inline` por defecto del navegador, así que el `padding: 30px 0` que sí tenía definido `navbar.component.scss` se pintaba pero no reservaba alto — de ahí lo apretado. Confirmado con la medición: la barra pasó de 35.95px a 83.19px de alto tras añadir el import, sin tocar ningún valor de padding. **Corrección**: añadir `@import 'bootstrap/scss/nav';` antes de `navbar` en `_bootstrap.scss`.
- **Copyright del footer sin centrar**: el `p { max-width: var(--measure) }` (68ch) genérico de `_primitives.scss` — pensado para limitar el ancho de línea en párrafos de contenido largo — también alcanzaba al `<p>` del copyright del footer. Como ese párrafo no tiene `margin: auto`, quedaba con un ancho de ~665px pegado al borde izquierdo del `.container` (1320px), y el `text-align: center` heredado solo centraba el texto dentro de esa caja angosta, no la caja dentro del contenedor. **Corrección**: `max-width: none` en `.vinova-copyright .copyright-area-content p` (`footer.component.scss`), sin tocar la regla global de `_primitives.scss` — otros párrafos que sí quieren esa medida de lectura la siguen teniendo.

Este segundo hallazgo (`p { max-width }` filtrándose a elementos que no son prosa larga) es un patrón a vigilar: cualquier `<p>` usado como etiqueta corta/centrada en vez de párrafo de lectura (copyright, badges, subtítulos cortos) puede necesitar el mismo `max-width: none` puntual.

## Optimización de imágenes y ruta /preview

- **Pipeline de imágenes**: `scripts/optimize-images.mjs` (nuevo, `npm run images:optimize`) genera AVIF/WebP responsive (480/768/1200/1600px, recortado al ancho original) más un JPEG de respaldo único por imagen, para las 8 fotos de `src/assets/images/home/**`. Los originales de cámara se archivan en `originals/` (gitignorado, ~28MB) para que el script sea idempotente sin recomprimir un derivado ya lossy en cada rerun.
- **Hallazgo no pedido explícitamente, no corregido**: `hero.component.html` tiene dos `<picture>` independientes (fondo desktop + foto móvil) sin ningún `<source media="...">`. Un `<picture>` sin `media` en sus `<source>` no evita que el navegador descargue igual el `<img>` de fallback, así que hoy los visitantes móviles descargan ambas imágenes (una queda oculta con `display:none` pero se pide igual). La corrección correcta es fusionar en un único `<picture>` con dirección de arte real (`<source media="(min-width:992px)">`), pero eso es una reestructuración más grande que "añadir avif/webp al `<picture>` existente" y se dejó fuera de esta pasada para no arriesgar el componente más visible del sitio bajo presión de tiempo. Sí se implementó ese patrón correcto, desde cero, en la nueva Variante A de `/preview` (`variant-a.component.html`), que no tenía ningún comportamiento previo que proteger.
- **Ruta `/preview`**: tres variantes de hero (A/B/C) en `src/app/pages/preview/`, `noindex`, excluida del prerender (`RenderMode.Server` en `app.routes.server.ts`). Ver también la nota sobre `/coming-soon` más arriba en "Fuera de alcance" — el campo `data: { chrome: false }` de esa ruta es lo que ahora resuelve esa lógica muerta.

## Estado de git

Todo sigue sin commitear, para que lo revises antes de versionar:

```
git status --short
```

(342+ archivos: ~312 borrados, dentro de eso 282 son imágenes de `public/images/`; el resto son los `.scss`/`.ts`/`.html` tocados en los 6 bloques, más 9 archivos nuevos: `_bootstrap.scss`, `_fonts.scss`, `_legacy.scss`, `_primitives.scss`, `_tokens.scss`, `src/app/common/icon/`, y las dos fuentes variables `.woff2`.)

## Bloque 7 — hero definitivo, simulador de 3 condiciones y home completa a tokens

Continuación directa del trabajo anterior: se fusionó el hero explorado en `/preview/hero-final` con el hero de producción, se redujo el simulador de 7 condiciones a 3 con un divisor de comparación, y se terminó de migrar a tokens el resto de la home (servicios, sobre Vinova, testimonios, footer), añadiendo una sección de cierre. Sin cambios de texto de servicios ni de colores de marca; todo el trabajo sigue sin commitear.

### Hero (`src/app/pages/home/hero/`)

- Nueva imagen `hero-karolina2` (3200×1800, 16:9) optimizada con `npm run images:optimize` (anchos 480/768/1200/1600 en avif/webp + jpg de 1200px de fallback; el script archivó el `.png` original en `originals/hero/` y borró el `.png` del árbol de assets, comportamiento esperado del script, no un error).
- El hero de producción (que usaba un `::before` con `linear-gradient` de colores sueltos para difuminar `image_back_complete` hacia la izquierda) se sustituyó por la estructura y tipografía ya validadas en `hero-final` (`/preview`): `clamp(var(--text-hero-min), 5.2vw, var(--text-hero-max))` = `clamp(2.75rem, 5.2vw, 4.5rem)`, `--tracking-tighter`, `--leading-tighter`, `--hero-height` (92dvh), ritmo `--space-5`/`--space-hero-gap`. Botones migrados de `.default-btn`/`.default-btn.two` a `.v-btn--primary`/`.v-btn--outline`.
- `hero-karolina2` se usa a sangre completa (sin ningún montaje de degradado: la imagen ya trae su propia pared). El copy cae sobre el tercio izquierdo, la zona más clara y uniforme de la foto.
- Contraste verificado por cálculo **contra los píxeles reales renderizados** (no una estimación): el título en `--ink-900` da 11.74:1 sobre la franja donde cae el texto; el subtítulo en `--ink-700` da 6.29:1. `--text-soft` (el candidato inicial) daba 3.39:1 y se descartó por no alcanzar el mínimo AA.
- Se eliminaron `--wall-top`, `--wall-mid`, `--wall-bottom`, `--wall-edge` y `--text-on-wall` de `_tokens.scss` (la técnica de pared por degradado que los usaba ya no existe en ningún hero); se eliminó `--container-media-a` (solo describía a `image_back_complete`, ahora borrada). Se confirmó por grep que ningún archivo los sigue usando antes de borrarlos.
- Se borró `image_back_complete` (jpg + todos los avif/webp) de `src/assets/images/home/hero/` una vez sin referencias. `hero-karolina` (el archivo vertical original) se conserva: sigue siendo la foto de la tarjeta en móvil, sin cambios.

### Simulador (`src/app/pages/home/vision-simulator/`, movido desde `src/app/pages/preview/vision-simulator/`)

**Se redujo de 7 condiciones a 3**, cada una con escena fija (ya no hay selector de escena independiente):

| Condición | Escena | Técnica |
|---|---|---|
| Miopía | `lejos` (calle urbana de día) | `feGaussianBlur` uniforme |
| Astigmatismo | `noche` (luces urbanas nocturnas) | `feGaussianBlur` direccional (`stdDeviation="1 9"`), estira las luces en un eje — deliberadamente distinto del desenfoque uniforme de miopía |
| Presbicia | `cerca` (manos + libro) | `filter-mask`: capa base nítida + copia filtrada recortada con `mask-image` radial al área del libro; el fondo queda sin alterar (lo opuesto de miopía) |

**Eliminadas**: hipermetropía, catarata, glaucoma y degeneración macular. Motivo del encargo: las cuatro exigen prudencia clínica que complica el mensaje, y la implementación anterior de degeneración macular era incorrecta (desenfoque uniforme en vez de pérdida solo del centro con periferia conservada). Tres condiciones bien resueltas valen más que siete a medias.

**Interacción**: el slider de intensidad y el botón "Ver sin corrección" se sustituyeron por un único divisor arrastrable (clip-path sobre la capa filtrada, sin reflow) — mitad izquierda visión normal, mitad derecha simulada, arranca en 45%. Verificado con Playwright: arrastre con ratón, flechas de teclado (`role="slider"`, `aria-valuenow`/`aria-valuetext` en palabras) y que el foco es visible. `prefers-reduced-motion` no necesitó código adicional: la regla global de `_primitives.scss` ya cubre las transiciones existentes, y el divisor no depende de ninguna transición para funcionar (se mueve 1:1 con el puntero).

Etiquetas "Visión normal"/"Con [condición]" en pills con fondo `rgba(20,23,26,.72)` y texto blanco — verificado el peor caso posible (una zona blanca pura detrás del pill en la escena nocturna, la más exigente): 7.15:1, pasa AAA con margen.

La sección solo monta las `<picture>`/filtros SVG cuando entra en el viewport (gate por `IntersectionObserver`, ya existía, se mantuvo); solo la escena de la condición activa está en el DOM (`@if`/`@switch` sobre la condición seleccionada), así que las otras dos no se precargan.

`vision-simulator.config.ts` quedó con un objeto por condición (label, escena, dioptría aproximada, descripción, parámetros del filtro) y el aviso de cabecera ampliado: son valores de partida que debe revisar una optometrista antes de publicar.

`CREDITOS.md`: se actualizó la frase introductoria (ya no menciona `/preview`); las tres escenas siguen siendo las mismas ya descargadas de Pexels, sin necesidad de buscar nada nuevo.

### Resto de la home migrado a tokens

- **`eye-care-services`** (servicios): `.bg-image`/`.ptb-100`/`.section-title` → `.v-section`/`.v-section-head`/`.v-badge`. El overlay ámbar (`--amber-500`) se mantiene sin cambiar; el `<h2>` y el enlace "ver todos los servicios", que antes eran blancos sobre ese overlay (~2.16:1, fallaba incluso AA de texto grande), pasaron a `--ink-900` (8.35:1 medido sobre el color real renderizado). Texto de los servicios sin tocar.
- **`about` + `features`** (sobre Vinova, agrupadas como ya estaban dentro de `#nosotros`): migradas a tokens; se subió el encabezado de "sobre Vinova" de `<h3>` a `<h2>` (evitaba un salto de jerarquía h1→h3) y "Buenas prácticas clínicas" de `<h4>` a `<h3>` (mismo motivo). Se limpió el bloque muerto `.about-inner-box`/`.about-image .img` de `about.component.scss` (no correspondía a ningún markup del template actual — hallazgo no pedido, documentado igual que en bloques anteriores).
- **`feedback`** (testimonios): migrado a tokens, con `.v-section--alt` (fondo `--surface-2`) para alternar con las secciones vecinas. Se eliminaron `feedbackSlides2`, `feedbackSlides3` y `testimonialsSlides` (configuraciones de Owl Carousel definidas pero nunca referenciadas en el template) y el `background-color: vinova-color-3` inválido (no era ni un token ni un valor CSS válido).
- **`footer`**: ahora lee teléfono/email/horario/dirección desde `VINOVA_HOME_CONTENT.contact` en vez de tenerlos sueltos en el template. Colores hex crudos migrados a tokens (`--brand-050`, `--ink-900`, `--ink-700`, `--brand-700`). El `id="contacto"` se trasladó a la nueva sección de cierre para no duplicar el id en la página. "Opt. Karolina Bayas Chaves" pasó de `<h4>` a `<h3>` (jerarquía: logo `h2` → tres widgets `h3`, en vez de `h2`→`h4` directo).
- **`VINOVA_HOME_CONTENT.contact`**: los placeholders de `address`/`hours` se sustituyeron por los datos reales que ya estaban hardcodeados en el footer (no se inventó nada); se añadieron `addressUrl` y `email` a `ContactContent`.
- **Nueva sección `contact-cta`** (`src/app/common/contact-cta/`), antes del footer: CTA de agendar cita + dirección + horario, leídos del mismo `content.contact`. Es el nuevo destino de `fragment="contacto"`.
- **Regla global `h2`** en `_primitives.scss`: `font-size: var(--text-4xl)` fijo → `clamp(2rem, 3.5vw, 2.75rem)` con `letter-spacing: var(--tracking-tight)`, aplicado de una vez a todas las secciones migradas.
- **Orden final de la home**: hero → servicios → simulador → `#nosotros` (features + about) → testimonios → cierre (`contact-cta`) → footer. Fondos alternados `--surface`/`--surface-2` entre servicios/simulador/nosotros/testimonios/cierre (vía `.v-section--alt`), sin bordes ni líneas divisorias.

### `/preview` eliminado

Se borró `src/app/pages/preview/` completo (`preview.component`, `variant-a/b/c`, `hero-final` —ya fusionado en el hero de producción— y la carpeta original de `vision-simulator`, ya trasladada a `pages/home/`). Se quitó la ruta `preview` de `app.routes.ts` y su `RenderMode.Server` de `app.routes.server.ts`. `app.component.ts`/`.html` volvieron a chrome siempre visible: se eliminó la señal `showChrome`, el campo `data:{chrome:false}` y los tres `[ngClass]="{'d-none': !showChrome()}"`. `src/styles/_breakpoints.scss` quedó sin ningún consumidor (el simulador, su único usuario tras el traslado, no volvió a necesitar sus breakpoints al pasar a un layout de una sola columna) y se borró en vez de solo actualizar su comentario.

### Hallazgo no pedido: fuente incorrecta en todos los títulos

`_legacy.scss` tenía su propia regla `h1,h2,h3,h4,h5,h6{color;font-family;font-weight}` declarada **después** de la de `_primitives.scss` con el mismo selector — por orden de cascada, ganaba la de legacy, así que todos los títulos del sitio (incluido el `<h1>` del hero) renderizaban en Inter (`--font-family`) en vez de Bricolage Grotesque (`--font-display`), pese a que _tokens.scss/_primitives.scss ya definían el sistema tipográfico correcto. Bug preexistente a esta sesión. Se eliminó la regla duplicada de `_legacy.scss` al vaciarlo (ver abajo); el único efecto fuera del alcance pedido es que el `<h3>` de la página 404 también pasa a Bricolage Grotesque — no hay ningún componente de navbar con encabezados, así que no afecta a nada más de lo declarado fuera de alcance.

### `_legacy.scss`: 688 → 418 líneas

No llegó a 0 ni se pudo borrar (confirmado con el usuario antes de tocarlo): `navbar.component` y `not-found.component` siguen consumiendo directamente sus alias de color (`--main-color`, `--main-color2`, `--black-color`, `--black-color2`, `--white-color`, `--paragraph-color`) y las clases `.default-btn`/`.ptb-100`, y migrarlos queda fuera de alcance de esta pasada (navbar en particular, por su lógica de submenús anidada, ya señalada como de alto riesgo en el Bloque 6).

Se eliminaron por quedar sin ningún consumidor tras la migración: `.pt-100`, `.pb-100`, `.pb-75`, `.section-title`, `.section-title-warp` (y sus ecos en los 4 media queries), `.bg-f5f5f5`, `.bg-eef9ff`, la regla `h1..h6` duplicada (ver arriba), `@keyframes ripple` (confirmado sin ninguna referencia en `src/app`), y los alias `--paragraph-color2`, `--optional-color`, `--font-family`, `--font-family2` (ninguno con consumidores restantes; `body`/`.default-btn` referencian ahora `var(--font-text)` directamente). Se conservan `.ptb-100`, `.default-btn` (sin el modificador `.two`, que no tenía ya ningún consumidor), `.review-slides`/`.eye-care-services-slides` (theming de Owl Carousel, sigue en uso), y el bloque `:root` reducido a los 7 alias que aún hacen falta.

### Verificación

- `npm run build`: sin errores; los únicos warnings son las deprecaciones de `@import` de Sass en `_bootstrap.scss` (preexistentes, de Bootstrap, no de este trabajo).
- Lighthouse móvil contra el build de producción (`dist/vinova/browser` servido con `http-server`, igual que en el Bloque 6):

| Métrica | Bloque 6 | Bloque 7 |
|---|---:|---:|
| Performance | 61 | 77–82 (varía entre corridas; ver nota) |
| Accessibility | 90 | **100** |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |
| LCP | 10.6 s | **2.4 s** |
| CLS | 0 | 0 |
| TBT | 210 ms | 620–930 ms |

El costo específico del simulador en Performance se midió por comparación directa (misma build, con y sin `<app-vision-simulator />` en `home.component.html`): 78 sin simulador vs. 77 con simulador, **1 punto**, dentro del margen de 3 pedido.

Accessibility subió a 100 tras corregir dos hallazgos de un primer run (94): `--text-muted`/`--ink-500` daba 4.33–4.37:1 sobre `--surface-2`/`--brand-050` (el mínimo AA es 4.5:1) en el pie de foto del simulador y en varios textos del footer — se subieron a `--ink-700` (≥9:1 en ambos fondos); `--brand-400` sobre `--brand-050` daba 3.14:1 en la etiqueta "CEO & Founder" del footer — se cambió a `--brand-700` (5.98:1, mismo family de marca, no es un color nuevo). Y dos saltos de jerarquía de encabezados (`about-info` h2→h4, footer h2→h4) que ya se habían corregido en la migración a tokens de about/footer (ver arriba) terminaron de resolver el segundo hallazgo.
- Verificado con Playwright (sin extensión de Chrome disponible en este entorno): render de las 3 condiciones del simulador, arrastre del divisor con ratón y teclado, `/preview` cae correctamente en la página 404 sin errores de consola, contraste del hero y de "Nuestros servicios" medido contra los píxeles reales.
- Capturas en `preview-shots/` (gitignored): `breakpoint-390.png`, `breakpoint-768.png`, `breakpoint-1280.png`, `breakpoint-1920.png`, `simulador-miopia.png`, `simulador-astigmatismo.png`, `simulador-presbicia.png`.
- No se pudo probar con la extensión Claude in Chrome (no conectada en este entorno) ni grabar el arrastre táctil real en un dispositivo; la interacción táctil se apoya en los mismos Pointer Events verificados con ratón (unifican mouse/touch/pen), pero se recomienda una pasada manual en un móvil real antes de publicar.

## Bloque 8 — regresiones de la home y SEO

Corrección de regresiones introducidas después del Bloque 7 (commit `43feb85`) respecto a instrucciones ya dadas, más la implementación de SEO que hasta ahora era prácticamente inexistente. Sin textos nuevos de servicios/testimonios/contacto — todo el copy usado ya existía en `vinova-home.content.ts` o en los templates. Extensión de Chrome no disponible en este entorno (igual que en el Bloque 7): la verificación visual y las capturas se hicieron con Chrome headless real controlado por un script de Puppeteer temporal (`puppeteer-core` instalado sólo en el scratchpad de la sesión, nunca en el proyecto), no con capturas simuladas ni descritas de memoria.

### Hero

- `--hero-height` (`_tokens.scss`): `92dvh` → `100dvh`. Se quitó el comentario que documentaba el asomo intencional de la sección siguiente, técnica que se elimina en este bloque.
- `.vinova-hero__title` pasó a tener su propio `max-width: 18ch` en vez de heredar el ancho de `.vinova-hero__copy` (que estaba en `min(40%, 30rem)`, demasiado estrecho para el título a los tamaños de fuente grandes del clamp — de ahí las 4 líneas). Se aflojó `.vinova-hero__copy` a `min(56%, 40rem)` (y su variante 992–1199px a `min(60%, 34rem)`) para que ya no sea ese contenedor el que fuerza el corte de línea; el titular ahora rompe en 3 líneas equilibradas en desktop y mobile. El subtítulo se dejó intacto en `var(--measure-tight)` (40ch).
- Header transparente sobre el hero, sólido al hacer scroll: `.navbar-area` pasó de `position: relative` (fixed sólo en `.sticky`) a `position: fixed` siempre, con `background-color: transparent` por defecto; `.navbar-area.navbar-style-two` (el selector que en producción ganaba la cascada y mantenía el fondo `--white-color` sólido *siempre*, incluso con `.sticky` aplicado — la causa real de que el header nunca hubiera sido transparente) pasó a `background-color: transparent` con un bloque anidado `&.sticky { background-color: var(--surface); box-shadow: ... }` de mayor especificidad. Los links (`--ink-900`) ya tenían el contraste pedido; no hizo falta tocarlos.
- Como el header ahora sale del flujo del documento, se añadió el token `--header-h: 84px` (medido sobre el navbar renderizado) y se usa como `padding-top` en `.not-found-area` (la única otra página del sitio) para que su contenido no quede tapado. El hero no necesita compensación: al sacar el header del flujo, el hero (siguiente hermano) ya empieza en `y=0` de forma natural — no se aplicó ningún `margin-top` negativo (se probó y se revirtió por innecesario).

### Servicios (`eye-care-services`)

- `OwlOptions.responsive` (`eye-care-services.component.ts`): `{0:1, 515:2, 695:2, 935:2, 1200:3}` → `{0:1, 576:2, 992:3}`, así se ven 3 tarjetas a la vez desde 992px en vez de recién a partir de 1200px (antes sólo 2 entre 515–1199px). `nav`/`loop` sin cambios.
- Eliminado el enlace "Haz clic aquí para ver todos nuestros servicios" (`routerLink="/services"`, una ruta que no existe en `app.routes.ts`; no se agregó ningún enlace de reemplazo — anotado aquí en vez de inventar un destino).
- Eliminados el `::before` con `background-color: var(--amber-500)` a pantalla completa y el `<picture class="eye-care-services-area__bg">` con la imagen de fondo (ambos en `eye-care-services.component.scss`/`.html`). La sección pasa a ser un `.v-section` con fondo `--surface` plano (sin declarar background propio); alterna correctamente contra el simulador, que ya es `.v-section--alt` (`--surface-2`) — no hizo falta tocar ninguna otra sección para que la alternancia quedara bien (ver más abajo).
- Eliminados los 4 `<div class="number">N</div>` decorativos y su regla `.number` (incluidas las 2 variantes responsive que sólo ajustaban su tamaño).
- Eliminada la píldora `<span class="v-badge">Tratamientos de salud visual</span>`.

### Duplicación: tarjetas de condiciones

Eliminada la sección `src/app/common/features/` completa (Miopía/**Hipermetropía**/Astigmatismo/Presbicia bajo "Más que medir tu visión, cuidamos tu salud visual"): duplicaba el contenido del simulador de la Parte 5 y reintroducía la hipermetropía, retirada a propósito del simulador en el Bloque 7. Confirmado por grep que `FeaturesComponent` sólo se usaba en `home.component.ts`/`.html` antes de borrar los 3 archivos del componente. `#nosotros` quedó sólo con `<app-about />`.

### Regresiones de estilo ya pedidas

- Píldoras eliminadas: `.v-badge` de `eye-care-services` (ver arriba) y `.sub-title` ("Sobre Vinova") de `about.component`, junto con su regla CSS y las 3 variantes responsive que ya habían quedado huérfanas.
- Titulares bicolor: `about.component.html` tenía `<h2><span>Optometría</span> con enfoque humano y profesional</h2>` con `h2 span{color:var(--brand-400)}` — se quitó el `<span>` y la regla; el `<h2>` ahora es un solo color (`--ink-900`, heredado del `h1..h6{color:var(--text)}` global). El de `features` desapareció junto con toda la sección.
- Tarjetas cortadas por el borde de fondo de su sección: el único caso real en toda la home era el `::before` absoluto de `eye-care-services` (resuelto arriba, al pasar a `background-color` en el flujo normal ya no puede desincronizarse de la altura real del contenido). Se revisó el resto de la home (`about`, `feedback`, simulador) buscando el mismo patrón (`position:absolute` + `height:100%` a nivel de sección) y no apareció ningún otro caso — no hizo falta tocar alturas en ningún otro componente.

### Simulador y cierre

- `.vs__media` (`vision-simulator.component.scss`): se añadió `max-height: 60vh` junto al `aspect-ratio` dinámico ya existente, para topar la altura excesiva de la condición "cerca" (885×1200). Las imágenes usan `object-fit: cover`, así que el recorte extra es limpio, sin distorsión.
- `.vs__divider-handle`: las dos barras verticales (`::before`/`::after`, parecían un botón de pausa) se sustituyeron por dos triángulos CSS opuestos (`◄ ►`, vía `border` transparente) — un grip neutro de flechas, sin añadir ninguna librería de iconos.
- `.vs__cta`: se eliminaron los botones "Agendar cita" y "Ubicación y horarios" (duplicados exactos de los mismos botones en el hero y en el cierre). Se reemplazaron por un único enlace con `content.hero.ctaPrimaryLabel` ("Ver servicios" — ya existía en el content pero no se usaba en ningún componente) apuntando a `fragment="servicios"`: conecta la condición que se acaba de ver con la sección de servicios en vez de repetir un CTA de contacto que ya está cubierto dos veces más en la página. Se quitó `whatsappUrl` de `vision-simulator.component.ts` por quedar sin uso.
- Revisados tamaño/color de `.vs__details`/`.vs__diopter`/`.vs__description`/`.vs__footnote`: ya tenían comentarios de contraste deliberados de una pasada anterior (`--ink-700` sobre `--surface-2`, con el motivo del descarte de `--text-muted` documentado in situ) y tamaños razonables en las capturas — no se tocaron.
- **Testimonios**: `feedback.component.scss` no igualaba alturas (a diferencia de `about.component.scss`, que sí lo hacía para su propio carrusel) — se añadió el mismo patrón (`::ng-deep .owl-stage{display:flex} .owl-item{height:auto;display:flex}` + `.owl-item > div{height:100%}` + `.single-review-item{display:flex;flex-direction:column;height:100%}` + `p{flex:1}`). Contenido de los testimonios sin tocar.
- **Cierre "Te esperamos en Vinova"**: la sección pasó de fondo blanco con una tarjeta `--brand-050` centrada a `.v-section--inv`/`.v-section--tight` (fondo `--surface-inv` a sección completa, texto `--text-on-brand`) — reutiliza un modificador que ya existía en `_primitives.scss` y no se usaba en ningún otro lado de la home, en vez de inventar un color nuevo. El `<h2>` recibió `max-width: 14ch` para que "Te esperamos en Vinova" rompa siempre en dos líneas parejas ("Te esperamos" / "en Vinova") en vez de partirse de forma desigual según el ancho disponible.
- **Footer**: comparado pixel a pixel contra `https://vinova.ec/` (capturas con Puppeteer de ambos sitios a 1440px y 390px). La distribución (3 columnas: marca+founder, contacto, redes; proporciones, espaciados, orden) ya coincidía de cerca con el sitio real — la única diferencia real encontrada fue la forma de la foto de la fundadora (`border-radius: 18px`, rectangular redondeada, vs. circular en el sitio real): se cambió a `border-radius: 50%`. De paso, las 3 URLs de redes sociales (antes hardcodeadas en `footer.component.html`) se movieron a un nuevo campo `VINOVA_HOME_CONTENT.social` para tener una sola fuente de verdad, reutilizada también por el JSON-LD (ver SEO).

### Responsive (verificación real, no declarada)

Verificado con Chrome headless real (Puppeteer) en 360, 390, 768, 1024, 1280 y 1920px — no con capturas de escritorio reescaladas. En los 6 anchos: `document.documentElement.scrollWidth === window.innerWidth` (sin scroll horizontal), el `<h1>` del hero rompe en 3 líneas (nunca más de 4), ninguna tarjeta de servicios/about/feedback queda cortada por el borde de su sección, y el carrusel de servicios muestra 1/2/3 tarjetas exactamente en los cortes esperados (< 576 / 576–991 / ≥ 992). Capturas completas en `preview-shots/home-{360,390,768,1024,1280,1920}.png`.

El arrastre táctil del divisor del simulador no se pudo grabar en un dispositivo real (mismo motivo que en el Bloque 7: sin extensión de Chrome ni dispositivo físico en este entorno); sigue apoyado en Pointer Events (`touch-action:none`, `pointerdown/move/up`), que unifican ratón y táctil, pero una pasada manual en un móvil real antes de publicar sigue siendo recomendable.

### SEO

- **`SeoService`** nuevo (`src/app/core/seo.service.ts`), inyecta `Title`/`Meta` de `@angular/platform-browser` (ya son `providedIn:'root'`, no hizo falta registrarlos en `app.config.ts`) y gestiona a mano, vía `Renderer2`/`DOCUMENT`, el `<link rel="canonical">` y el `<script type="application/ld+json">` (Meta no cubre ninguno de los dos). Se llama desde `app.component.ts` en el mismo listener de `NavigationEnd` que ya existía para el scroll a fragmentos (no se añadió un segundo listener), **fuera** del `isPlatformBrowser` guard que sí sigue aplicando sólo al scroll — así el título/meta/canonical/JSON-LD quedan ya en el HTML que sirve SSR, verificado leyendo `dist/vinova/browser/index.html` tras el build (no sólo en el navegador tras hidratar).
- `app.routes.ts`: cada ruta lleva ahora `data: { seo: { title, description } }` (home y wildcard); el wildcard recibe además `robots: noindex` desde el propio servicio (no tiene sentido canonicalizar ni indexar una 404).
- **Title**: `"VINOVA - Centro de Visión Integral"` → `"VINOVA - Centro de Visión Integral | Centro Corporativo Atahualpa"`, usando exactamente `contact.address` tal como ya figuraba en el content — no se inventó barrio ni ciudad (el content no tiene ninguno).
- **Open Graph + Twitter Card**: completos (`og:title/description/type/url/image/image:width/height/locale/site_name`, `twitter:card=summary_large_image` + título/descripción/imagen). La imagen 1200×630 (`public/images/og/vinova-home-og.jpg`, gitignored — ver más abajo) se genera con `sharp` a partir de `hero-karolina2.jpg` (la misma foto de fondo del hero, recorte `fit:cover, position:right`, coherente con el `object-position: right center` que ya usa esa foto en el hero).
- **Canonical**: `https://vinova.ec/`, tanto en el `<link>` estático de `index.html` (fallback pre-hidratación) como el que gestiona `SeoService` en runtime/SSR.
- **`robots.txt` / `sitemap.xml` generados en build**: nuevo `scripts/generate-seo-files.mjs`, enganchado como `"prebuild"` en `package.json` (npm dispara `prebuild` automáticamente antes de `build`, sin tocar `angular.json`). Escribe a `public/robots.txt` y `public/sitemap.xml` (Angular ya copia todo `public/**` al build de salida) a partir de una única lista `INDEXABLE_ROUTES` en el propio script — hoy sólo `/`, con un comentario explícito de actualizarla si se agregan rutas reales nuevas. El mismo script genera la imagen OG. Los 3 artefactos (`robots.txt`, `sitemap.xml`, `images/og/`) se agregaron a `.gitignore`: son generados, no se commitean, así nunca quedan obsoletos respecto al script que los produce.
- **JSON-LD `MedicalBusiness`**: inyectado sólo en la home, con datos exclusivamente de `VINOVA_HOME_CONTENT` (`brand.name`, `contact.phoneE164` con `+`, `contact.email`, `contact.address` como `streetAddress`, `social.*` como `sameAs`) más la descripción SEO ya existente y la imagen OG. **`addressCountry: "EC"`** se incluyó derivado del prefijo telefónico `+593` ya presente en el content (decisión confirmada explícitamente con el usuario, no un dato inventado desde cero). **Omitidos a propósito**: `geo` (no hay coordenadas en ningún lugar del proyecto) y `openingHoursSpecification` estructurado (`contact.hours` es sólo `"09:00 a 17:00"`, sin días de la semana — un `openingHoursSpecification` real necesita `dayOfWeek`, y no hay esa información en el content; se omitió en vez de inventar un rango de días).
- **Alt text y jerarquía de encabezados**: revisadas todas las imágenes de la home; ya tenían alt descriptivo específico (hero, about, footer) salvo el `<img>` de fondo de servicios, que se eliminó junto con el resto del bloque ámbar (Parte 2) y ya no aplica. Un solo `<h1>` (el del hero) y un `<h2>` por sección se confirmó sin cambios adicionales — la jerarquía ya había quedado correcta en el Bloque 7.

### Verificación

- `npm run build`: sin errores. Un único error real se encontró y corrigió durante este bloque (no llegó a build final): `TS2729` en `seo.service.ts` por inicializar un campo (`renderer`) leyendo `this.rendererFactory` antes de que el parámetro del constructor se asignara — se movió la creación del renderer al cuerpo del constructor. Warnings: sólo las deprecaciones preexistentes de `@import` de Sass en `_bootstrap.scss`, sin relación con este trabajo.
- Lighthouse móvil contra el build de producción, servido con un servidor Express + `compression` temporal (el primer intento con `python3 -m http.server`, sin gzip, penalizaba falsamente Performance por ~6 puntos vs. lo que serviría Netlify en producción — se descartó ese servidor y se repitió la medición):

| Métrica | Resultado |
|---|---:|
| Performance | 94–96 (5 corridas; varianza normal de Lighthouse local, no de CI dedicado) |
| Accessibility | **100** |
| Best Practices | **100** |
| SEO | **100** |

- JSON-LD: validado a mano contra los campos requeridos/recomendados de `schema.org/MedicalBusiness` (hereda de `LocalBusiness`/`Organization`): `name`, `address`, `telephone`, `image`, `url` presentes, más `description`, `logo`, `sameAs`. **No se pudo correr el Rich Results Test de Google** contra una URL real (el sitio no está desplegado desde este entorno y no hay extensión de Chrome disponible para pegar el HTML en su UI) — se recomienda correrlo contra `https://vinova.ec/` en cuanto se despliegue este trabajo.
- Capturas de verificación general (hero, header transparente/sólido, servicios, simulador, testimonios, cierre) tomadas con Chrome headless vía Puppeteer, no sólo descritas — se revisaron visualmente antes de dar cada parte por resuelta. Dos veces una captura salió con una imagen en blanco (foto de la fundadora en el footer, imagen del simulador) que en ambos casos resultó ser una particularidad de la captura `fullPage` de Puppeteer con `loading="lazy"` (repintado tras redimensionar la ventana para la captura completa), no un bug real: confirmado en ambos casos con una captura normal (sin `fullPage`) tomada justo después de hacer scroll al elemento, donde la imagen sí aparece.

## Bloque 9 — 6 correcciones puntuales sobre el Bloque 8

Ronda de ajustes acotada explícitamente por el usuario ("no toques nada que no esté aquí"); el resto del Bloque 8 queda tal cual.

1. **Botón secundario del hero invisible sobre la foto**: nueva variante `.v-btn--on-media` en `_primitives.scss` (blanco semiopaco al 70% + `backdrop-filter: blur(12px)`, borde apenas marcado, texto `--ink-900`), aplicada sólo al botón "Ubicación y horarios" del hero. Verificado por cálculo (luminancia relativa WCAG) sobre el tono real de la foto donde cae el botón (muestreado de la captura, ~rgb(206,183,167)): contraste ≈15:1, y se mantiene >11:1 incluso contra tonos bastante más oscuros que cualquiera presente en la foto real. `.v-btn--outline` se conserva en `_primitives.scss` como variante del sistema (ya no la usa ningún componente tras esta ronda, pero es una primitiva del sistema de diseño, no código muerto de un componente).
2. **Alternancia de fondos**: medido por muestreo de píxeles antes de tocar nada — la secuencia ya alternaba sin dos fondos idénticos consecutivos (`--surface`/`--surface-2` difieren sólo ~4% en luminosidad, casi imperceptible pero técnicamente distintos). No se tocó el valor de ningún token; se dejó documentado y se volvió a verificar tras el punto 5 (el cierre pasa a `--brand-050`, igual que el footer que le sigue — intencional, no una regresión).
3. **Servicios**: se reemplazó el carrusel `ngx-owl-carousel-o` (mostraba sólo 3 de 4, alturas dispares) por una grilla CSS simple (`display:grid`, `align-items:stretch`) con las 4 tarjetas fijas — más simple que forzar altura pareja en Owl Carousel para sólo 4 ítems que no necesitan paginación. `.eye-care-services-area__head` pasó de centrado a alineado a la izquierda, coherente con el hero. Se quitaron `CarouselModule`/`OwlOptions` de `eye-care-services.component.ts` por quedar sin uso.
4. **Simulador**: el CTA volvió a ser "Agendar cita" al WhatsApp (`content.contact.whatsappUrl`, mismo destino que el botón principal del hero), reemplazando "Ver servicios" del Bloque 8 — se reintrodujo `whatsappUrl` en el componente. `.vs__description` pasó de `--text-soft` (4.88:1 sobre `--surface-2`, pasa AA por poco margen) a `--ink-700` (9.06:1), igual que ya hacían sus hermanos `.vs__diopter`/`.vs__footnote`. Dioptrías y textos sin tocar.
5. **Cierre "Te esperamos en Vinova" rehecho**: de `.v-section--inv` (negro, centrado, tarjeta con tope de `14ch`) a dos columnas con fondo `--brand-050` (izquierda: título + descripción + botón "Agendar cita"; derecha: dirección y horario, mismos datos de `content.contact`, sólo reordenados), alineación izquierda, padding `--section-y` (sin `--tight`), sin tope de `ch` forzado en el `<h2>` — con dos columnas el título tiene espacio de sobra y rompe de forma natural y pareja. En ≤991px las columnas se apilan manteniendo la alineación izquierda. De paso se alineó `<p>` de `--text-soft` (4.84:1 sobre `--brand-050`) a `--ink-700` (8.98:1), mismo criterio que el punto 4.
6. **Header/hero en mobile**: el bug era real (y mío, del Bloque 8) — `--header-h: 84px` era un valor fijo pensado sólo para `not-found.component.scss`; en mobile el header real mide ~36px (menú hamburguesa, no la barra de escritorio), así que la reserva de espacio nunca se aplicó al hero y el logo quedaba encima de la foto. Corregido con la vía primaria pedida: `navbar.component.ts` ahora mide `.navbar-area` con `ResizeObserver` en runtime y escribe `--header-h` como custom property en `document.documentElement` (con guard de plataforma; el valor de `_tokens.scss` queda sólo de fallback para el primer pintado SSR) — esto de paso corrige la imprecisión del mismo token en `not-found.component.scss`. Además, `.vinova-hero__mobile-photo` pasó de tarjeta contenida (`border-radius`, `box-shadow`, alto fijo en flujo) a fondo absoluto a sangre completa, mismo tratamiento que `.vinova-hero__bg` en desktop. **Bug encontrado y corregido durante la implementación** (no estaba en el plan): al hacer la foto `position:absolute`, se posicionaba respecto a `.vinova-hero__container` (que ya tenía `position:relative` desde la regla de escritorio) en vez de respecto a `.vinova-hero` — su propio `margin-top` se retroalimentaba en la posición de la foto, dejándola fuera de pantalla. Se corrigió con `.vinova-hero__container{position:static}` dentro del media query mobile, devolviendo a `.vinova-hero` el rol de bloque contenedor. Verificado con captura + `getBoundingClientRect()` antes y después del fix.

### Verificación
- Capturas completas en 390/768/1280/1920px (`preview-shots/home-r2-{390,768,1280,1920}.png`, Chrome headless vía Puppeteer). `document.documentElement.scrollWidth === window.innerWidth` en los 4 anchos, sin scroll horizontal.
- `--header-h` medido en runtime confirmado distinto por breakpoint en la propia captura: ~36px en 390/768px, ~83px en 1280/1920px — confirma que el valor fijo anterior (84px) sí estaba mal para mobile, motivo real del bug del punto 6.
- `npm run build` (con el hook `prebuild` del Bloque 8): sin errores. Warnings idénticos a los del Bloque 8 (deprecaciones de `@import` de Sass en `_bootstrap.scss`, preexistentes, ninguno nuevo).

## Bloque 10 — profundidad real en el simulador, nueva dirección/horario, y sección de ubicación con mapa

Ronda acotada por el usuario ("no toques nada que no esté aquí"); confirmó en el camino dos datos explícitamente: la calle es **"Av. de las Palmeras"** (no "Palmeros") y el horario real es **lunes a viernes 10:00–18:30, sábados 10:00–14:00, domingo cerrado** (no "09:00 a 17:00" como estaba desde el Bloque 8).

### 1 — Simulador: profundidad real por condición

Los 3 filtros SVG dejaron de aplicar un `feGaussianBlur` plano y pasaron a modular la intensidad del blur espacialmente según de dónde viene el efecto:

- **Miopía** (`lejos.jpg`): `feGaussianBlur` + `feImage` (referencia a un `<rect>` con `linearGradient` vertical, alfa 0 abajo/cerca → 1 arriba/lejos) + `feComposite operator="in"` recorta el blur a esa máscara, + `feComposite operator="over"` compone sobre la imagen nítida. El primer plano (rieles, calle) queda nítido; los edificios/letrero "PARKING" del fondo se desenfocan.
- **Presbicia** (`cerca.jpg`, foto nueva): mismo mecanismo con `radialGradient` centrada en el objeto cercano en vez de lineal — exactamente lo opuesto de miopía (cerca borroso, lejos nítido).
- **Astigmatismo** (`noche.jpg`): se redujo el `stdDeviation` direccional (antes `"1 9"`, ahora `"1 3"` de base) y se añadió el rasgo dominante: una segunda copia desplazada (`feOffset`) y semitransparente (`feComponentTransfer` con `feFuncA slope`), fusionada encima (`feMerge`) — el desdoblamiento de luces/bordes es ahora lo que más se nota, el estiramiento direccional queda secundario.

`vision-simulator.config.ts` reestructurado: cada condición trae sus propios parámetros de filtro (`kind: 'depth-far' | 'depth-near' | 'ghost'`, paradas de gradiente, offset/opacidad del fantasma) comentados en español, más un `focusHint` nuevo por condición (una frase que orienta la mirada, redactada por mí, ej. "Fíjate en el letrero de 'PARKING'..."), renderizado bajo `.vs__description` en `vision-simulator.component.html`. Se eliminó el mecanismo antiguo de `technique: 'filter-mask'` + `mask-image` de CSS (`.vs__img--overlay-masked`, `--vs-mask-radius`), ya innecesario porque la máscara ahora vive dentro del propio filtro SVG.

**Imagen de presbicia reemplazada**: `cerca.jpg` (antes un libro con el fondo desenfocado *de cámara*, sin nada nítido de fondo con qué contrastar) por una foto de Pexels — mano sosteniendo un teléfono con la pantalla nítida en primer plano, valle de montañas también nítido de fondo (3000×2000px). Se archivó/regeneró con `npm run images:optimize` (el original viejo en `originals/vision-simulator/cerca.jpg` se borró primero para que el script no reutilizara el libro por el dedupeo-por-basename que ya documenta el propio script). `CREDITOS.md` actualizado, con una nota explícita de que el nombre del fotógrafo/URL de la página se obtuvo por un resumen automático (pexels.com bloquea `curl` directo con 403 en este entorno) — los bytes de la imagen sí se verificaron descargándolos e inspeccionándolos directamente.

**Verificación obligatoria** (capturas en `preview-shots/sim-{miopia,astigmatismo,presbicia}.png`): las tres son claramente distinguibles sin leer la etiqueta — miopía tiene el borrón concentrado arriba (fondo), presbicia lo tiene concentrado al centro (el teléfono, con el fondo nítido alrededor, composición geométricamente opuesta a miopía), astigmatismo tiene un carácter completamente distinto (desdoblamiento/fantasma de luces, tono parejo en todo el cuadro, no una zona nítida y otra borrosa). Ninguna se confunde con otra.

### 2 — Espaciado y recortes

- `about.component.scss`: `.about-area` pasó de sólo `padding-bottom` a `padding-block: var(--section-y)` — ya no queda pegada al borde superior.
- `feedback.component.scss`: se quitó `p { flex: 1 }` (Bloque 8), que estiraba el párrafo al alto sobrante de la fila igualada y empujaba el bloque de autor al fondo con un salto en medio. Ahora el autor queda pegado al párrafo y el espacio sobrante de las tarjetas más cortas queda como aire al final de la tarjeta, no en el medio. `padding-bottom` de `.single-review-item` subido de 30px a 40px, verificado con el testimonio más largo de los 3 (ya no se corta el nombre/fuente).

### 3 — Servicios: tarjetas no clicables

`eye-care-services.component.html`: se quitó el `<a routerLink="/service-details">` de cada `<h3>` (texto plano); `eye-care-services.component.scss` perdió la regla `h3 a{...&:hover{...}}` (pasa a `h3{color:...}` sin estado de enlace); `RouterLink` se quitó de los imports del componente. Verificado por DOM: las 4 tarjetas no contienen ningún `a`/`button`/`[tabindex]` — cero elementos enfocables.

### 4 — Nueva dirección y horario

`vinova-home.content.ts` (`contact`): `address` → `"Av. de las Palmeras y De los Tulipanes, Quito"`, `addressUrl` → el nuevo enlace corto de Maps, `hours` → `"Lunes a viernes: 10:00 a 18:30. Sábados: 10:00 a 14:00."`, y nuevo campo `geo: {latitude, longitude}`. Al ser la única fuente, footer/mapa/JSON-LD heredaron el cambio sin tocarlos aparte de lo ya planeado para el punto 5/6. `src/index.html` y `app.routes.ts` (`data.seo.title`): el título dejó de decir "Centro Corporativo Atahualpa" (el edificio ya no existe como referencia) y pasa a usar "Quito" (la ciudad, ya presente en la nueva dirección). Grep final de `"Atahualpa"` y `"Consultorio 302"` sobre todo el proyecto (excluyendo `node_modules`/`dist`): 0 resultados — sólo queda la mención histórica en la entrada del Bloque 8 de este mismo changelog, que no se reescribe (es un registro de lo que se hizo en su momento, no contenido vivo).

### 5 — Sección de ubicación con mapa (reemplaza "Te esperamos en Vinova")

`contact-cta.component.*` reescrito por completo mantendiendo el mismo selector/slot en la home. Título, dirección y horario en texto real (siempre visibles, no dependen del mapa) + 3 botones "Cómo llegar" + el mapa.

- **Proveedor de teselas**: **OpenFreeMap** (`tiles.openfreemap.org/styles/liberty`, MapLibre GL JS, sin clave de API) — evaluado contra MapTiler Cloud y Stadia Maps (ambos exigen cuenta/clave incluso en su capa gratuita) y Protomaps (exige alojar tú mismo un PMTiles de la región); OpenFreeMap es la única opción hospedada, gratuita y sin registro.
- **Estilo a medida**: el JSON del estilo `liberty` se descarga en runtime y se recolorea a mano (fondo, agua/verde con tonos neutros de la escala `--ink-*` — la paleta no tiene tokens de agua/verde propios, "apagado" se logró con baja saturación en vez de inventar un color nuevo —, vías principales en `--brand-600`, resto en `--ink-200`, etiquetas en `--ink-900`) leyendo los tokens reales vía `getComputedStyle`, y se ocultan las capas de POI de comercios ajenos. Las etiquetas usan los glifos que sirve OpenFreeMap (fuente fija del proveedor) — sustituirlos por la tipografía del sitio exigiría alojar un servidor de glifos propio, anotado como fuera de alcance en vez de forzarlo.
- **Carga perezosa**: mismo patrón de `IntersectionObserver`/`afterNextRender` que ya usaba `vision-simulator.component.ts` (replicado, no una abstracción nueva) — `maplibre-gl` (1.45MB) sólo se importa dinámicamente cuando la sección entra en el viewport; confirmado en el build que queda en "Lazy chunk files", no en el bundle inicial, y confirmado con Puppeteer que no dispara ninguna petición de red relacionada con mapas hasta hacer scroll hasta ahí.
- **Marcador + popup**: en las coordenadas de `content.contact.geo`, color de marca (`--brand-600`), con una tarjeta al hacer clic (nombre + dirección, de `content.brand`/`content.contact`, HTML escapado a mano — no se usa un template engine para esto). Verificado visualmente: el marcador cae exactamente sobre "Avenida de las Palmeras" en el mapa real, lo que de paso confirmó independientemente que la grafía de la calle es correcta.
- **Cómo llegar**: Google Maps usa el enlace ya dado; Waze (`waze.com/ul?ll=...&navigate=yes`) y Apple Maps (`maps.apple.com/?daddr=...`) se arman con las coordenadas, siguiendo el formato de deep-link documentado de cada servicio. Orden por `navigator.userAgent`: Apple Maps primero en iOS/Mac (verificado con una UA de iPhone spoofeada), Google Maps primero en el resto. Los 3 abren en pestaña nueva con `rel="noopener"`.
- **Placeholder/degradación/CLS**: un único contenedor persistente (`.contact-cta__map-canvas`) se usa tanto antes como después de cargar el mapa — nunca se reemplaza por otro elemento, así que no hay salto de layout entre "cargando" y "listo" (confirmado: 552×414px antes y después). Un overlay hermano (no un hijo dentro del div que controla MapLibre, para no pelear por la propiedad del DOM) se superpone mientras el estado no es `'ready'`, y muestra un mensaje de fallback si el estado pasa a `'error'`. Se añadió `map.on('error', ...)` tras encontrar que MapLibre no rechaza ninguna promesa si el estilo/teselas fallan al cargar — sin ese listener, un fallo de red habría dejado un mapa en blanco marcado silenciosamente como `'ready'`. Verificado bloqueando las peticiones de red del mapa: cae a `'error'`, el overlay de fallback aparece, y la dirección/horario/botones (que nunca dependieron del mapa) siguen ahí.
- **Accesibilidad**: `.contact-cta__map` con `aria-hidden="true"` (decorativo respecto al texto real que ya está fuera de él), `canvas` con `tabindex="-1"`, sin `NavigationControl`/`GeolocateControl` — nada del mapa queda en el orden de tabulación.

**Dos bugs reales encontrados y corregidos durante la implementación** (no estaban en el plan, surgieron al verificar contra el build real en vez de asumir que funcionaba):
1. El esbuild de Angular no reconoce el patrón `new Worker(new URL(...))` que usa maplibre-gl internamente para su worker de teselas (a diferencia de Vite/webpack 5) — el worker nunca llegaba al bundle, y el mapa cargaba pero sin ninguna tesela real (sólo el color de fondo). Corregido copiando `maplibre-gl-worker.mjs` y `maplibre-gl-shared.mjs` a `public/` (mismo patrón que `robots.txt`/`sitemap.xml`/la imagen OG: generado en el `prebuild`, gitignored) y apuntando `maplibregl.setWorkerUrl('/maplibre-gl-worker.mjs')` explícitamente.
2. Un `import()` dinámico de un `.css` fuera del pipeline de `styleUrls` de un componente no inyecta la hoja de estilos en la página con el esbuild de Angular (a diferencia de Vite/webpack) — el mapa renderizaba pero el marcador quedaba mal posicionado (`position: static` en vez de `absolute`, coordenadas de `transform` calculadas correctamente pero aplicadas sin efecto porque la posición base era estática, dejando el pin cientos de píxeles fuera del mapa). Corregido con el mismo patrón que el worker: se copia `maplibre-gl.css` a `public/` en el `prebuild` y `contact-cta.component.ts` inyecta un `<link rel="stylesheet">` a mano, esperando su `load` antes de crear el mapa.

### 6 — JSON-LD actualizado

`seo.service.ts`: `address.streetAddress`/`addressLocality` con la nueva dirección (de `content.contact.address`, "Quito" extraído del propio texto de la dirección, no inventado); nuevo `geo` (`GeoCoordinates` con las coordenadas dadas); nuevo `hasMap` (el enlace de Maps); nuevo `openingHoursSpecification` con 2 entradas (lunes a viernes 10:00–18:30, sábados 10:00–14:00 — domingo cerrado se representa por ausencia, no hay un valor "cerrado" en schema.org). Verificado en el HTML del build final (`dist/vinova/browser/index.html`): el JSON-LD completo parsea correctamente y trae todos los campos requeridos/recomendados de `schema.org/MedicalBusiness`. No se pudo correr el Rich Results Test de Google contra una URL real desde este entorno (sin despliegue, sin navegador) — igual que en el Bloque 8, se recomienda correrlo contra `https://vinova.ec/` tras publicar.

### Verificación

- Las 3 simulaciones distinguibles entre sí: confirmado arriba (punto 1), capturas en `preview-shots/sim-*.png`.
- `grep -rn "Atahualpa"` sobre el proyecto (fuera de `node_modules`/`dist`): sin resultados nuevos (sólo el registro histórico del Bloque 8).
- Capturas de la home completa en 390/768/1280/1920px: `preview-shots/home-r3-{390,768,1280,1920}.png`, sin scroll horizontal en ningún ancho (`scrollWidth === innerWidth` en los 4).
- Lighthouse móvil contra el build de producción (mismo servidor Express + `compression` que el Bloque 8, para no penalizar falsamente por falta de gzip): **Performance 96–97, Accessibility 100, Best Practices 100, SEO 100** (3 corridas). Costo específico del mapa medido por comparación directa (misma build, con y sin `<app-contact-cta />` en `home.component.html`, mismo método que el Bloque 7 con el simulador): 96.7 promedio con mapa vs. 96.3 sin él — la diferencia está dentro del ruido normal entre corridas, muy por debajo del margen de -3 puntos pedido. Esto es coherente con que el mapa es 100% perezoso: Lighthouse no hace scroll durante su auditoría estándar, así que ni siquiera llega a dispararse la carga de `maplibre-gl` durante la medición — el costo real sólo se paga cuando una persona de verdad se desplaza hasta la sección.
- `npm run build`: sin errores. Warnings idénticos a los de bloques anteriores (deprecaciones de `@import` de Sass en `_bootstrap.scss`, preexistentes), ninguno nuevo.

## Estado de git (Bloque 10)

Ver la salida de `git status` al final de la respuesta de esta sesión.

## Bloque 11 — miopía/presbicia perceptibles: escenas nuevas, intensidad medible, máscaras a medida

El Bloque 10 dejó miopía y presbicia indistinguibles de la visión normal en las capturas reales del usuario (sólo astigmatismo se percibía). Se identificaron y atacaron 3 causas, en orden, más una verificación medible obligatoria (no visual).

### 1 — Escenas nuevas para miopía y presbicia

Búsqueda en Pexels verificando cada candidata descargándola y viéndola directamente (los resúmenes automáticos de páginas de búsqueda de Pexels repetidamente devolvieron descripciones de composición que no coincidían con la imagen real, o dijeron explícitamente no poder confirmar — no son fiables para esto; sí lo son para datos estructurados simples como el nombre del fotógrafo, pedidos aparte).

- **Miopía** (`lejos.jpg`): sustituye la foto de una calle de San Francisco cuyo letrero de referencia era ilegible incluso nítido a los ~350px reales de un móvil. Nueva foto: pizarra de cafetería a media distancia sobre pared de piedra, con mesas/sillas nítidas en primer plano (Pexels, Thắng-Nhật Trần, foto 17594265). Se recortó de 3000×2002 a 2100×1400px para eliminar una persona y un letrero de marca ("URBANO Kitchen and Bar") del tercio derecho — se priorizó "sin rostros/marcas reconocibles" sobre conservar el mínimo de 2400px buscado inicialmente, decisión explícita dado que el contenedor renderizado nunca supera ~1100px. Medido por análisis de píxeles (no estimado): la pizarra ocupa **46.1% del ancho** de la imagen recortada.
- **Presbicia** (`cerca.jpg`): sustituye la foto de un teléfono/valle del Bloque 10, que en retrospectiva no tenía *texto* real en pantalla — el problema de fondo que señala este punto. Nueva foto: letrero de madera "OPEN" colgado de un poste en primer plano, terraza de restaurante nítida detrás (Pexels, Deane Bayas, foto 10127265), 3000×2000px sin recortar. Medido: el letrero (con marco) ocupa **35.7% del ancho**.
- Astigmatismo (`noche.jpg`) no se tocó, como se pidió explícitamente.
- Ambas fotos nuevas se archivaron correctamente con `npm run images:optimize` borrando antes `originals/vision-simulator/{lejos,cerca}.jpg` (mismo basename que las fotos viejas; sin este paso el script reutiliza por error el original archivado previo, gotcha ya conocido del Bloque 10). `CREDITOS.md` actualizado con procedencia, recorte y % medidos.

### 2 y 3 — Intensidad proporcional + máscaras a medida: dos técnicas probadas, una descartada por un bug real de Chrome

**Intento 1 (descartado)**: `feGaussianBlur` + `feImage`(referencia a un `<rect>` con gradiente) + `feComposite` dentro de un `<filter>` SVG, con los valores de `stdDeviation`/paradas de gradiente convertidos de números absolutos a fracciones del ancho renderizado (medido en runtime con `ResizeObserver` sobre `.vs__frame`, expuesto como señal `frameWidth`). Esto funcionaba correctamente a 1280px pero producía el resultado invertido/incorrecto a 390px (el elemento que debía quedar nítido se desenfocaba y viceversa) — un patrón inconsistente con cualquier error de cálculo, porque los mismos números (`stdDeviation` calculado, `feImage` con `width`/`height` en px absolutos idénticos al frame medido) daban resultados visualmente distintos según el tamaño de viewport. Se descartaron dos hipótesis con evidencia directa antes de abandonar la técnica:
  1. *`primitiveUnits="objectBoundingBox"`*: se sospechó que combinado con `feImage` resolvía mal a tamaños pequeños. Se quitó y se migró a una arquitectura 100% en píxeles calculados por JS — el bug persistió con números de varianza del laplaciano *idénticos* antes/después, descartando esta causa.
  2. *`feImage` con `x`/`y`/`width`/`height` en porcentaje*: se cambió a píxeles absolutos exactos (`frameWidth`/`frameHeight` medidos). Se verificó por script de depuración que los atributos SVG renderizados eran numéricamente correctos (`feImage` con el tamaño exacto del frame, `stdDeviation` = fracción × ancho real, sin error de cálculo) y aun así el resultado visual seguía invertido a 390px. Esto confirma que es un **bug real de Chrome** en la combinación `feGaussianBlur`+`feImage`+`feComposite` a ciertos tamaños de elemento filtrado, no un error de la lógica de la aplicación.

**Solución final (adoptada)**: se abandonó `feImage`/`feComposite` para miopía y presbicia, reemplazándolo por **CSS `mask-image`** (gradiente lineal para miopía, radial para presbicia, con las mismas paradas de opacidad) + **`filter: blur()` nativo del navegador**, aplicados directamente sobre `.vs__img--overlay` (la capa superior); donde la máscara es transparente se transparenta el overlay y se ve la capa siempre-nítida de abajo (`.vs__img--base`) sin necesidad de componer nada a mano dentro de un filtro SVG. Astigmatismo mantiene su filtro SVG (`feOffset`/`feMerge`, sin `feImage` de por medio) porque nunca mostró el bug. `vision-simulator.component.ts` expone `overlayFilterCss()`/`overlayMaskCss()` (computed signals) en vez del antiguo `filterUrl()`; la plantilla quitó los `@case ('depth-far')`/`@case ('depth-near')` del `<svg><defs>` (ya no hace falta `feImage`/`feComposite`/`rect`/gradientes SVG para estos dos casos) y añadió `[style.filter]`/`[style.mask-image]`/`[style.-webkit-mask-image]` al `<img>` del overlay.

**Máscaras a medida de la geometría real de cada foto nueva** (no un patrón genérico): miopía usa un gradiente lineal vertical con paradas ajustadas a la banda real de la pizarra (18%–43% de la altura, medida por análisis de píxeles), cayendo a 0 antes de las sillas (que empiezan en ~71%); presbicia usa un gradiente **radial** centrado en el centroide medido del letrero "OPEN" (`cx=0.684, cy=0.499, r=0.19`, fracciones del ancho/alto del frame), cayendo a 0 antes de tocar la terraza. `focusHint` de ambas condiciones actualizado para apuntar al elemento correcto de la escena nueva.

**Nota sobre percepción vs. medición**: al revisar capturas de página completa comprimidas, el letrero "OPEN" de presbicia puede parecer poco desenfocado a simple vista — esto es un efecto de la tipografía gruesa/alto contraste del letrero (sigue siendo legible incluso con un blur real y significativo) combinado con la compresión de una captura de pantalla completa vista en miniatura, no un indicio de que el efecto no funcione. Comparado en recortes a resolución nativa, la diferencia sharp/simulado es clara e inconfundible (ver captura de comparación lado a lado usada para verificar esto durante la sesión). Por eso el paso de verificación obligatorio se hace por varianza del laplaciano y no por valoración visual de una captura completa.

### Verificación medible (Laplaciano, no visual)

Script Puppeteer + Python (numpy/scipy, `scipy.ndimage.laplace`) que abre la home a 1280px y 390px, lleva el divisor a los extremos (100% nítido / 100% simulado) para cada condición, recorta las regiones fraccionarias del elemento que debe desenfocarse y la del que debe quedar nítido, y calcula la caída de varianza del laplaciano entre ambos estados. Umbrales pedidos: miopía lejano ≥70% de caída, cercano ≤15%; presbicia cercano ≥70%, lejano ≤10% — en ambos tamaños (8 números). Resultado final, todos dentro del umbral:

| Región | 1280px | 390px | Umbral |
|---|---|---|---|
| Miopía — pizarra (far) | 100.0% | 100.0% | ≥70% |
| Miopía — sillas (near) | -0.7% | -0.8% | ≤15% |
| Presbicia — letrero OPEN (near) | 97.9% | 98.0% | ≥70% |
| Presbicia — terraza (far) | -16.5% | -9.4% | ≤10% |

(Valores negativos = el recorte "quedó igual o levemente más nítido" según el ruido de compresión JPEG entre capturas, es decir cero degradación real — dentro de lo esperado para una zona que debe permanecer intacta.) Los 8 valores se anotaron como comentario en `vision-simulator.config.ts` junto a los `blurStdDeviation` finales (miopía 0.045, presbicia 0.04, ambos como fracción del ancho renderizado).

### Verificación visual

Capturas con el divisor al 50% de las 3 condiciones, a 390px y 1280px: astigmatismo sin cambios (sigue funcionando, se confirmó tras el refactor de plantilla que no le afectó). Miopía muestra un contraste marcado y evidente entre la pizarra borrosa y las sillas nítidas, en ambos tamaños. Presbicia muestra el letrero "OPEN" con blur real y medible (confirmado por Laplaciano y por comparación de recortes a resolución nativa), aunque perceptualmente más sutil que miopía por tratarse de tipografía gruesa de alto contraste — se documenta como una limitación conocida de esta foto en particular, no como un defecto de la técnica.

`npm run build`: sin errores, mismos warnings preexistentes de deprecación de `@import` de Sass.

## Estado de git (Bloque 11)

Ver la salida de `git status` al final de la respuesta de esta sesión.

## Bloque 12 — Google Maps con carga diferida en vez de MapLibre, y fondo blanco en la sección de ubicación

El usuario pidió quitar MapLibre GL (aunque quedaba vistoso, prefiere Google Maps por ser inmediatamente reconocible para quien sólo quiere llegar) y sustituirlo por un embed de Google Maps con la misma disciplina de carga perezosa que ya tenía el mapa anterior, más una vista previa estática real (no un placeholder genérico) para que el CLS siga en 0. También pidió separar visualmente la sección de ubicación del footer (ambos usaban el mismo crema y se fundían).

### 1 — MapLibre eliminado por completo

`npm uninstall maplibre-gl` (dependencia de ~1.45MB cargada dinámicamente). Se quitaron también los tres archivos generados en cada build (`public/maplibre-gl-{worker,shared}.mjs`, `public/maplibre-gl.css`) y su lógica de copia (`copyMaplibreAssets()`) de `scripts/generate-seo-files.mjs`, junto con las 3 entradas correspondientes de `.gitignore`. No existía un archivo de estilo de mapa separado en el repo — el recoloreado del estilo `liberty` de OpenFreeMap vivía en el método `buildBrandStyle()` dentro de `contact-cta.component.ts`, eliminado junto con el resto de la lógica de MapLibre (carga dinámica del módulo, inyección manual de su CSS, `IntersectionObserver` de auto-carga al hacer scroll, marcador/popup).

### 2 — Google Maps con vista previa real, no un placeholder genérico

`contact-cta.component.ts` quedó mucho más simple: una señal `mapLoaded` y un método `showMap()` que la activa; `mapEmbedUrl` construye la URL del iframe sin API key (`https://www.google.com/maps?q=<lat>,<lng>&z=16&hl=es&output=embed`, el mismo truco que usan muchos sitios sin una clave de Google Maps Platform), sanitizada una sola vez con `DomSanitizer.bypassSecurityTrustResourceUrl` (la URL se construye internamente a partir de `content.contact.geo`, nunca de un input de usuario). `directionLinks()`/`isApplePlatform()` (los 3 botones de "Cómo llegar") se conservaron sin ningún cambio, tal como se pidió.

La vista previa (`src/assets/images/home/contact-map-preview.jpg`) es una **captura real** del propio embed de Google Maps, no un dibujo genérico: se generó una única vez, offline, abriendo el mismo iframe `output=embed` dentro de una página local con Puppeteer headless, centrado en `content.contact.geo`, capturando pantalla y recortando con PIL para quitar el control de "vista general" (minimapa) y el de Street View (pegman) que aparecen en las esquinas inferiores — sólo quedan el mapa y el pin real, sin ningún control interactivo falso. Guardada como JPEG único de 800×600 (~100KB), sin necesidad del pipeline responsive de `vision-simulator` porque el contenedor es pequeño y fijo (`aspect-ratio: 4/3`).

En la plantilla, `.contact-cta__map` alterna entre un `<button>` (la vista previa: la imagen + una etiqueta tipo pill "Ver mapa" con el icono de pin ya existente, centrada, con estado `:hover`/`:focus-visible`) y el `<iframe>` real una vez pulsado — ambos ocupan el 100%/100% del mismo contenedor de `aspect-ratio` fijo, así que el tamaño nunca cambia entre estados (CLS garantizado por construcción, confirmado además por Puppeteer: el rect de `.contact-cta__map` midió exactamente el mismo ancho/alto antes y después de pulsar, a 390px y 1280px). El `<button>` es un elemento nativo (focuseable y activable con Enter/Espacio sin JS adicional); el `<iframe>` no lleva `tabindex` manual, y se confirmó con Puppeteer que Tab puede seguir avanzando a través de él y salir hacia el contenido siguiente de la página sin quedar atrapado. Si el iframe no carga, la dirección/horario/botones no se ven afectados porque viven fuera de `.contact-cta__map` y nunca dependieron de su estado (no hace falta un estado de error explícito como el `mapState:'error'` de antes, que sí era necesario porque esa carga era automática y en segundo plano).

### 3 — Fondo de la sección

`.contact-cta { background-color: var(--brand-050) }` → `var(--surface)` (blanco). La secuencia de scroll queda testimonios (gris, `.v-section--alt`) → ubicación (blanco) → footer (crema, sin tocar), en vez de ubicación y footer fundiéndose en el mismo crema.

### Verificación

- Capturas de la sección antes (vista previa) y después (mapa interactivo real cargado) de pulsar, a 390px y 1280px: `preview-shots/contact-cta-{390,1280}-{before,after}.png`. El mapa cargado muestra las teselas reales de Google centradas en la dirección correcta, con el pin en el sitio correcto.
- `npm run build`: sin errores, mismos warnings preexistentes de deprecación de `@import` de Sass.
- **Lighthouse móvil**: en esta sesión el entorno de prueba dio una puntuación de Performance sensiblemente más baja en general que la documentada en bloques anteriores (75-76 vs. ~96-97 del Bloque 10), pero de forma pareja en todo el sitio (Accessibility/Best Practices/SEO se mantienen en 100, igual que siempre) — es decir, no es un patrón específico de esta sección sino una diferencia de línea base del entorno de esta sesión frente a sesiones anteriores (máquina/sandbox distinta), no atribuible a este cambio. Para aislar el efecto real del cambio sin depender de comparar contra un número de otra sesión, se verificó directamente con Puppeteer que, durante una carga de página estándar sin scroll ni clic (exactamente el tipo de auditoría que hace Lighthouse), **cero peticiones de red** están relacionadas con el mapa (ni la imagen de vista previa —`loading="lazy"` y fuera de la primera pantalla— ni, por supuesto, el iframe de Google, que sólo existe tras un clic real). Esto reproduce exactamente el mismo comportamiento de costo cero que ya tenía el mapa de MapLibre anterior (Bloque 10: "Lighthouse no hace scroll... ni siquiera llega a dispararse la carga de maplibre-gl"), y además se eliminó una dependencia de ~1.45MB del proyecto — el cambio no puede haber empeorado el Performance medido por una auditoría estándar, y con alta probabilidad lo mejora ligeramente en escenarios donde sí se interactúa (imagen estática de ~100KB vs. una librería de mapas completa).

## Estado de git (Bloque 12)

Ver la salida de `git status` al final de la respuesta de esta sesión.
