import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-top-header',
    imports: [NgClass],
    templateUrl: './top-header.component.html',
    styleUrls: ['./top-header.component.scss']
})
export class TopHeaderComponent {

    constructor(
        public router: Router
    ) {}

}