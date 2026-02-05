import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
    selector: 'app-eye-care-services',
    imports: [RouterLink, CarouselModule],
    templateUrl: './eye-care-services.component.html',
    styleUrls: ['./eye-care-services.component.scss']
})
export class EyeCareServicesComponent {

    servicesSlides: OwlOptions = {
		nav: true,
		margin: 25,
		loop: true,
		dots: false,
		autoplay: true,
		smartSpeed: 1000,
		autoplayHoverPause: true,
		navText: [
            '<i class="flaticon-011-chevron-1"></i>',
            '<i class="flaticon-010-chevron"></i>'
		],
        responsive: {
            0: {
                items: 1
            },
            515: {
                items: 2
            },
            695: {
                items: 2
            },
            935: {
                items: 2
            },
            1200: {
                items: 3
            }
        }
    }

}