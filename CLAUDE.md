# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

One-page marketing/landing site for **VINOVA – Centro de Visión Integral** (an eye-care clinic in Ecuador). Built with **Angular 19** (standalone components, no NgModules), SCSS, and Server-Side Rendering. All user-facing copy is in Spanish (`<html lang="es">`).

Deployment target is **Netlify**: `src/server.ts` implements the SSR request handler using `@netlify/angular-runtime`, not the default Angular CLI Express server. The `serve:ssr:vinova` npm script (`node dist/vinova/server/server.mjs`) is CLI boilerplate left over from `ng add @angular/ssr` and is not the actual deploy path — don't rely on it as documentation of how the site is served in production.

## Commands

- `npm start` / `npm run ng serve` — dev server
- `npm run build` — production build (outputs to `dist/vinova`)
- `npm run watch` — dev-config build in watch mode
- `npm test` — Karma/Jasmine unit tests (browser-based, via `ng test`)
- Run a single spec: `ng test --include='**/home.component.spec.ts'` (only `app.component.spec.ts` currently exists as an example)

There is no configured lint script in `package.json`.

## Architecture

**Routing** (`src/app/app.routes.ts`): only two routes — `''` → `HomeComponent` and `'**'` → `NotFoundComponent`. This is a one-page site; in-page navigation uses router fragments (e.g. `#servicios`), not distinct routes. `src/app/app.routes.server.ts` prerenders every route (`RenderMode.Prerender`).

**App shell** (`app.component.ts`/`.html`): wraps every route with `app-header`, `<router-outlet>`, `app-footer`, `app-back-to-top`, and `app-whatsapp-float`. It also handles anchor-fragment scrolling on `NavigationEnd` (guarded with `isPlatformBrowser` since this runs under SSR). Chrome is hidden via `d-none` when `router.url === '/coming-soon'`, even though that route isn't currently registered in `app.routes.ts` — check both files before assuming a route exists.

**Page composition** (`src/app/pages/home/home.component.ts`): the home page is a straight list of section components imported and stacked in template order (hero, features, about, eye-care-services, what-we-offer, doctors, feedback, how-it-works, blog, subscribe). Adding/reordering homepage sections means editing this list and the corresponding `<app-*>` tags in `home.component.html`.

**Component layout**:
- `src/app/common/` — shared/reused UI sections and chrome (header + its `navbar`/`top-header`/`middle-header` sub-components, footer, back-to-top, whatsapp-float, and the homepage section components like `about`, `doctors`, `feedback`, `features`, etc.)
- `src/app/pages/home/` — the home page and page-specific pieces (currently just `hero`)

Every component follows the same standalone pattern: `imports: [...]` array in the `@Component` decorator (no NgModules), separate `.html`/`.scss`/`.ts` files, 4-space indentation, single quotes in TS.

**Content model** (`src/app/content/vinova-home.content.ts`): typed content object `VINOVA_HOME_CONTENT` (interfaces: `BrandContent`, `HeroContent`, `AboutContent`, `ServicesContent`, `TestimonialsContent`, `ContactContent`, `NavigationContent`) intended as the single source of truth for site copy. **In practice this is only partially adopted** — only `navbar`, `hero`, and `whatsapp-float` currently import and use it; other sections (e.g. `feedback`, `features`) still have copy hardcoded directly in their `.html` templates. When editing copy, check whether the component already reads from `VINOVA_HOME_CONTENT` before hardcoding text in the template, and prefer wiring new/changed sections into this content object over adding more hardcoded strings.

**Carousels**: sections with sliders (e.g. `feedback`) use `ngx-owl-carousel-o`, configured via `OwlOptions` objects with responsive breakpoints defined per-instance in the component class.

**Styling**: global styles in `src/styles.scss`, with shared design tokens/fonts under `src/styles/_vinova-tokens.scss` and `_vinova-fonts.scss` (Sass partials, imported by other stylesheets). Component-scoped styles live alongside each component as `.component.scss`. Third-party CSS (animate.css, boxicons, ngx-bootstrap datepicker, owl-carousel themes, a local flaticon icon font) is registered globally in the `styles` array of `angular.json`, not imported per-component. `index.html` also pulls Bootstrap 5 and Google Fonts from CDNs.

**SSR/platform checks**: browser-only APIs (`window`, `document`, scroll position) must be guarded with `isPlatformBrowser(this.platformId)` (see `app.component.ts`, `navbar.component.ts`'s scroll listener) since components render on the server first.
