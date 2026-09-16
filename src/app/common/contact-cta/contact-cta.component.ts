import { Component } from '@angular/core';
import { VINOVA_HOME_CONTENT } from '../../content/vinova-home.content';
import { IconComponent } from '../icon/icon.component';

@Component({
    selector: 'app-contact-cta',
    imports: [IconComponent],
    templateUrl: './contact-cta.component.html',
    styleUrl: './contact-cta.component.scss'
})
export class ContactCtaComponent {
    protected readonly content = VINOVA_HOME_CONTENT;
}
