import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-how-it-works',
    imports: [NgClass],
    templateUrl: './how-it-works.component.html',
    styleUrls: ['./how-it-works.component.scss']
})
export class HowItWorksComponent {

    constructor(
        public router: Router
    ) {}

}