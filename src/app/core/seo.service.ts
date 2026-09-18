import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { VINOVA_HOME_CONTENT } from '../content/vinova-home.content';

export interface SeoRouteData {
    title: string;
    description: string;
}

const SITE_URL = 'https://vinova.ec';
// Recorte 1200x630 generado a partir de la foto del hero por scripts/generate-seo-files.mjs (prebuild).
const OG_IMAGE_URL = `${SITE_URL}/images/og/vinova-home-og.jpg`;

@Injectable({ providedIn: 'root' })
export class SeoService {
    private readonly renderer: Renderer2;

    constructor(
        private readonly title: Title,
        private readonly meta: Meta,
        rendererFactory: RendererFactory2,
        @Inject(DOCUMENT) private readonly document: Document
    ) {
        this.renderer = rendererFactory.createRenderer(null, null);
    }

    updateForRoute(data: SeoRouteData, path: string): void {
        const isIndexable = path === '/';
        const url = isIndexable ? `${SITE_URL}/` : `${SITE_URL}${path}`;

        this.title.setTitle(data.title);
        this.meta.updateTag({ name: 'description', content: data.description });
        this.meta.updateTag({ name: 'robots', content: isIndexable ? 'index, follow' : 'noindex, follow' });

        this.meta.updateTag({ property: 'og:title', content: data.title });
        this.meta.updateTag({ property: 'og:description', content: data.description });
        this.meta.updateTag({ property: 'og:type', content: 'website' });
        this.meta.updateTag({ property: 'og:url', content: url });
        this.meta.updateTag({ property: 'og:image', content: OG_IMAGE_URL });
        this.meta.updateTag({ property: 'og:image:width', content: '1200' });
        this.meta.updateTag({ property: 'og:image:height', content: '630' });
        this.meta.updateTag({ property: 'og:locale', content: 'es_EC' });
        this.meta.updateTag({ property: 'og:site_name', content: VINOVA_HOME_CONTENT.brand.name });

        this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
        this.meta.updateTag({ name: 'twitter:title', content: data.title });
        this.meta.updateTag({ name: 'twitter:description', content: data.description });
        this.meta.updateTag({ name: 'twitter:image', content: OG_IMAGE_URL });

        if (isIndexable) {
            this.setCanonical(`${SITE_URL}/`);
        } else {
            this.removeCanonical();
        }
    }

    // JSON-LD MedicalBusiness: sólo se llama para la home, con datos exclusivamente
    // tomados de VINOVA_HOME_CONTENT.
    setMedicalBusinessJsonLd(description: string): void {
        if (this.document.getElementById('ld-medical-business')) {
            return;
        }
        const content = VINOVA_HOME_CONTENT;
        const jsonLd = {
            '@context': 'https://schema.org',
            '@type': 'MedicalBusiness',
            name: content.brand.name,
            description,
            url: `${SITE_URL}/`,
            logo: `${SITE_URL}/images/logo/principal.png`,
            image: OG_IMAGE_URL,
            telephone: `+${content.contact.phoneE164}`,
            email: content.contact.email,
            address: {
                '@type': 'PostalAddress',
                streetAddress: content.contact.address,
                addressLocality: 'Quito',
                addressCountry: 'EC'
            },
            geo: {
                '@type': 'GeoCoordinates',
                latitude: content.contact.geo.latitude,
                longitude: content.contact.geo.longitude
            },
            hasMap: content.contact.addressUrl,
            openingHoursSpecification: [
                {
                    '@type': 'OpeningHoursSpecification',
                    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                    opens: '10:00',
                    closes: '18:30'
                },
                {
                    '@type': 'OpeningHoursSpecification',
                    dayOfWeek: ['Saturday'],
                    opens: '10:00',
                    closes: '14:00'
                }
            ],
            sameAs: [content.social.facebook, content.social.instagram, content.social.tiktok]
        };

        const script = this.renderer.createElement('script');
        this.renderer.setAttribute(script, 'type', 'application/ld+json');
        this.renderer.setProperty(script, 'id', 'ld-medical-business');
        this.renderer.setProperty(script, 'textContent', JSON.stringify(jsonLd));
        this.renderer.appendChild(this.document.head, script);
    }

    private setCanonical(url: string): void {
        let link = this.document.querySelector<HTMLLinkElement>("link[rel='canonical']");
        if (!link) {
            link = this.renderer.createElement('link');
            this.renderer.setAttribute(link, 'rel', 'canonical');
            this.renderer.appendChild(this.document.head, link);
        }
        this.renderer.setAttribute(link, 'href', url);
    }

    private removeCanonical(): void {
        const link = this.document.querySelector("link[rel='canonical']");
        if (link) {
            this.renderer.removeChild(this.document.head, link);
        }
    }
}
