import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TopHeaderComponent } from './top-header/top-header.component';
import { MiddleHeaderComponent } from './middle-header/middle-header.component';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
    selector: 'app-header',
    imports: [NgClass, TopHeaderComponent, MiddleHeaderComponent, NavbarComponent],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

    constructor(
        public router: Router
    ) {}

}