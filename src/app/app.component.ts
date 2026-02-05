import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, NgClass, ViewportScroller } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet, Event } from '@angular/router';
import { HeaderComponent } from './common/header/header.component';
import { FooterComponent } from './common/footer/footer.component';
import { BackToTopComponent } from './common/back-to-top/back-to-top.component';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, HeaderComponent, FooterComponent, NgClass, BackToTopComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {

    title = 'VINOVA - Centro de Visión Integral';

    constructor(
        public router: Router,
        private viewportScroller: ViewportScroller,
        @Inject(PLATFORM_ID) private platformId: object
    ) {
        this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
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

}
