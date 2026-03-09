import { NgClass, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
    selector: 'app-about',
    imports: [NgClass, RouterLink, CarouselModule, NgFor],
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent {

    constructor(
        public router: Router
    ) {}

    aboutImages: string[] = [
        'assets/images/home/about/patient0.jpg',
        'assets/images/home/about/patient1.jpg',
        'assets/images/home/about/patient2.jpg',
        'assets/images/home/about/patient3.jpg'
    ];

    aboutCarouselOptions: OwlOptions = {
        margin: 0,
        loop: true,
        dots: true,
        autoplay: true,
        smartSpeed: 500,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1
            }
        }
    };

}