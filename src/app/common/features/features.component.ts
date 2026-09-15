import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IconComponent } from '../icon/icon.component';

@Component({
    selector: 'app-features',
    imports: [NgClass, RouterLink, IconComponent],
    templateUrl: './features.component.html',
    styleUrls: ['./features.component.scss']
})
export class FeaturesComponent {

    constructor(
        public router: Router
    ) {}

}