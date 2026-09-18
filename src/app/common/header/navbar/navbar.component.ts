import { DOCUMENT, NgClass, NgFor, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, HostListener, Inject, OnDestroy, PLATFORM_ID, ViewChild, afterNextRender } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { VINOVA_HOME_CONTENT } from '../../../content/vinova-home.content';

@Component({
    selector: 'app-navbar',
    imports: [NgClass, NgFor, RouterLink],
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnDestroy {
    @ViewChild('navbarArea') private navbarAreaRef!: ElementRef<HTMLElement>;
    private resizeObserver?: ResizeObserver;

    constructor(
        public router: Router,
        @Inject(PLATFORM_ID) private platformId: object,
        @Inject(DOCUMENT) private document: Document
    ) {
        // Altura real del header medida en runtime (no un número fijo): el layout
        // cambia de navbar de escritorio a menú hamburguesa según el ancho, así que
        // un valor estático nunca es preciso en todos los breakpoints. El valor de
        // _tokens.scss queda sólo como fallback para el primer pintado en SSR.
        afterNextRender(() => {
            if (!isPlatformBrowser(this.platformId)) {
                return;
            }
            const el = this.navbarAreaRef.nativeElement;
            this.resizeObserver = new ResizeObserver(([entry]) => {
                const height = entry.contentRect.height;
                this.document.documentElement.style.setProperty('--header-h', `${height}px`);
            });
            this.resizeObserver.observe(el);
        });
    }

    ngOnDestroy(): void {
        this.resizeObserver?.disconnect();
    }

    content = VINOVA_HOME_CONTENT;
    whatsappUrl = VINOVA_HOME_CONTENT.contact.whatsappUrl;
    navItems = VINOVA_HOME_CONTENT.navigation.items;

    switcherClassApplied = false;
    switcherToggleClass() {
        this.switcherClassApplied = !this.switcherClassApplied;
    }

    searchClassApplied = false;
    searchToggleClass() {
        this.searchClassApplied = !this.searchClassApplied;
    }

    classApplied = false;
    toggleClass() {
        this.classApplied = !this.classApplied;
    }

    // Navbar Sticky
    isSticky: boolean = false;
    @HostListener('window:scroll')
    checkScroll() {
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        if (scrollPosition >= 50) {
            this.isSticky = true;
        } else {
            this.isSticky = false;
        }
    }

}
