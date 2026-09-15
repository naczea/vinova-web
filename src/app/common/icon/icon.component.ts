import { Component, Input } from '@angular/core';

export type IconName =
    | 'clipboard-check'
    | 'eye'
    | 'award'
    | 'hand-holding-heart'
    | 'phone-volume'
    | 'envelope'
    | 'clock'
    | 'location-dot';

@Component({
    selector: 'app-icon',
    imports: [],
    templateUrl: './icon.component.html',
    styleUrl: './icon.component.scss'
})
export class IconComponent {
    @Input({ required: true }) name!: IconName;
    @Input() label?: string;
}
