import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, ViewportScroller } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet, Event } from '@angular/router';
import { HeaderComponent } from './common/header/header.component';
import { FooterComponent } from './common/footer/footer.component';
import { BackToTopComponent } from './common/back-to-top/back-to-top.component';
import { WhatsappFloatComponent } from './common/whatsapp-float/whatsapp-float.component';
import { SeoRouteData, SeoService } from './core/seo.service';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, HeaderComponent, FooterComponent, BackToTopComponent, WhatsappFloatComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {

    title = 'VINOVA - Centro de Visión Integral';

    constructor(
        public router: Router,
        private route: ActivatedRoute,
        private seo: SeoService,
        private viewportScroller: ViewportScroller,
        @Inject(PLATFORM_ID) private platformId: object
    ) {
        this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
                this.updateSeo(event.urlAfterRedirects);

                if (!isPlatformBrowser(this.platformId)) {
                    return;
                }
                const fragment = this.router.parseUrl(event.urlAfterRedirects).fragment;
                if (fragment) {
                    setTimeout(() => this.viewportScroller.scrollToAnchor(fragment), 0);
                } else {
                    this.viewportScroller.scrollToPosition([0, 0]);
                }
            }
        });
    }

    private updateSeo(urlAfterRedirects: string): void {
        let leaf = this.route.snapshot;
        while (leaf.firstChild) {
            leaf = leaf.firstChild;
        }
        const seoData = leaf.data['seo'] as SeoRouteData | undefined;
        if (!seoData) {
            return;
        }
        const path = urlAfterRedirects.split('?')[0].split('#')[0] || '/';
        this.seo.updateForRoute(seoData, path);
        if (path === '/') {
            this.seo.setMedicalBusinessJsonLd(seoData.description);
        }
    }

}
