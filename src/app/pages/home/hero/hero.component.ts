import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { VINOVA_HOME_CONTENT } from '../../../content/vinova-home.content';

@Component({
    selector: 'app-hero',
    imports: [NgFor, RouterLink],
    templateUrl: './hero.component.html',
    styleUrls: ['./hero.component.scss']
})
export class HeroComponent {
    content = VINOVA_HOME_CONTENT;

    private readonly heroImageFallback =
        "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='900' height='1200' viewBox='0 0 900 1200'><rect width='100%' height='100%' fill='%23EDEDED'/><text x='50%' y='50%' text-anchor='middle' dominant-baseline='middle' font-family='Arial' font-size='32' fill='%23999'>Imagen%20no%20disponible</text></svg>";

    onHeroImageError(event: Event): void {
        const img = event.target as HTMLImageElement | null;
        if (!img || img.dataset['fallbackApplied'] === 'true') {
            return;
        }

        const failedSrc = img.currentSrc || img.src;
        console.warn('Hero image failed to load:', failedSrc);
        img.dataset['fallbackApplied'] = 'true';
        img.src = this.heroImageFallback;
    }
}
