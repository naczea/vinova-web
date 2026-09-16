import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../icon/icon.component';
import { VINOVA_HOME_CONTENT } from '../../content/vinova-home.content';

@Component({
    selector: 'app-footer',
    imports: [RouterLink, IconComponent],
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
    protected readonly content = VINOVA_HOME_CONTENT;
}
