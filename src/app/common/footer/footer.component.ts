import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IconComponent } from '../icon/icon.component';

@Component({
    selector: 'app-footer',
    imports: [RouterLink, NgClass, IconComponent],
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

    constructor(
        public router: Router
    ) {}

}