import { Component } from '@angular/core';
import { VINOVA_HOME_CONTENT } from '../../content/vinova-home.content';

@Component({
    selector: 'app-whatsapp-float',
    imports: [],
    templateUrl: './whatsapp-float.component.html',
    styleUrl: './whatsapp-float.component.scss'
})
export class WhatsappFloatComponent {

    openWhatsApp() {
        const whatsappUrl = VINOVA_HOME_CONTENT.contact.whatsappUrl;
        window.open(whatsappUrl, '_blank');
    }

}