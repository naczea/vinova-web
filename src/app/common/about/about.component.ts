import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
    selector: 'app-about',
    imports: [CarouselModule, NgFor],
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent {

    private readonly aboutImageSizes = '(min-width: 1400px) 428px, (min-width: 1200px) 368px, (min-width: 992px) 310px, (min-width: 768px) 696px, calc(100vw - 32px)';

    aboutImages = ['patient0', 'patient1', 'patient2', 'patient3'].map(name => ({
        avifSrcset: [480, 768, 1200, 1600].map(w => `assets/images/home/about/${name}-${w}.avif ${w}w`).join(', '),
        webpSrcset: [480, 768, 1200, 1600].map(w => `assets/images/home/about/${name}-${w}.webp ${w}w`).join(', '),
        sizes: this.aboutImageSizes,
        jpg: `assets/images/home/about/${name}.jpg`,
        width: 1200,
        height: 1800
    }));

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