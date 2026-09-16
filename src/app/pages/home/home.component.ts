import { Component } from '@angular/core';
import { HeroComponent } from './hero/hero.component';
import { FeaturesComponent } from '../../common/features/features.component';
import { AboutComponent } from '../../common/about/about.component';
import { EyeCareServicesComponent } from '../../common/eye-care-services/eye-care-services.component';
import { VisionSimulatorComponent } from './vision-simulator/vision-simulator.component';
import { FeedbackComponent } from '../../common/feedback/feedback.component';
import { ContactCtaComponent } from '../../common/contact-cta/contact-cta.component';


@Component({
    selector: 'app-home',
    imports: [
        HeroComponent,
        EyeCareServicesComponent,
        VisionSimulatorComponent,
        FeaturesComponent,
        AboutComponent,
        FeedbackComponent,
        ContactCtaComponent
    ],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {}
