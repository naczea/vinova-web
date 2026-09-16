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
