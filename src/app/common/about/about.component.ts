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

    aboutImages = [
        { webp: 'assets/images/home/about/patient0.webp', jpg: 'assets/images/home/about/patient0.jpg', width: 1978, height: 2967 },
        { webp: 'assets/images/home/about/patient1.webp', jpg: 'assets/images/home/about/patient1.jpg', width: 3456, height: 5184 },
        { webp: 'assets/images/home/about/patient2.webp', jpg: 'assets/images/home/about/patient2.jpg', width: 3456, height: 5184 },
        { webp: 'assets/images/home/about/patient3.webp', jpg: 'assets/images/home/about/patient3.jpg', width: 2174, height: 3261 }
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