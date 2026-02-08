import { NgClass, NgFor } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { VINOVA_HOME_CONTENT } from '../../../content/vinova-home.content';

@Component({
    selector: 'app-navbar',
    imports: [NgClass, NgFor, RouterLink],
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

    constructor(
        public router: Router
    ) {}

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
