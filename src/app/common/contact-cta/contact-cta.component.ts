import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, computed, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { VINOVA_HOME_CONTENT } from '../../content/vinova-home.content';
import { IconComponent } from '../icon/icon.component';

interface DirectionLink {
    label: string;
    href: string;
}

@Component({
    selector: 'app-contact-cta',
    imports: [IconComponent],
    templateUrl: './contact-cta.component.html',
    styleUrl: './contact-cta.component.scss'
})
export class ContactCtaComponent {
    protected readonly content = VINOVA_HOME_CONTENT;

    // El mapa arranca como una vista previa estática (imagen); el iframe de
    // Google Maps sólo se inserta al pulsarla, para no cargar nada de Google
    // (ni siquiera la petición del iframe) hasta que la persona lo pida.
    protected readonly mapLoaded = signal(false);

    protected readonly mapEmbedUrl: SafeResourceUrl;

    // Google Maps usa el enlace ya dado en el content (apunta a la ficha del
    // negocio); Waze y Apple Maps se arman con las coordenadas, siguiendo el
    // formato de deep-link documentado de cada servicio.
    protected readonly directionLinks = computed<DirectionLink[]>(() => {
        const { geo } = this.content.contact;
        const google: DirectionLink = { label: 'Google Maps', href: this.content.contact.addressUrl };
        const waze: DirectionLink = { label: 'Waze', href: `https://waze.com/ul?ll=${geo.latitude},${geo.longitude}&navigate=yes` };
        const apple: DirectionLink = { label: 'Apple Maps', href: `https://maps.apple.com/?daddr=${geo.latitude},${geo.longitude}` };

        if (this.isApplePlatform()) {
            return [apple, google, waze];
        }
        return [google, waze, apple];
    });

    constructor(@Inject(PLATFORM_ID) private platformId: object, sanitizer: DomSanitizer) {
        // Sin clave de Google Maps Platform: se usa el formato de embed
        // "output=embed" (sin API key), el mismo truco que usan muchos sitios
        // cuando no tienen una. La URL se construye aquí mismo a partir de
        // datos internos (nunca de un input de usuario), por eso es seguro
        // marcarla como confiable para un iframe.
        const { latitude, longitude } = this.content.contact.geo;
        const url = `https://www.google.com/maps?q=${latitude},${longitude}&z=16&hl=es&output=embed`;
        this.mapEmbedUrl = sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    protected showMap(): void {
        this.mapLoaded.set(true);
    }

    private isApplePlatform(): boolean {
        if (!isPlatformBrowser(this.platformId)) {
            return false;
        }
        return /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);
    }
}
