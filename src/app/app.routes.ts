import { Routes } from '@angular/router';
import { SeoRouteData } from './core/seo.service';

const HOME_DESCRIPTION =
    'Óptica especializada en salud visual, optometría pediátrica, ocupacional y clínica. En Vinova evaluamos, orientamos y acompañamos hacia una visión plena.';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
        data: {
            seo: {
                title: 'VINOVA - Centro de Visión Integral | Quito',
                description: HOME_DESCRIPTION
            } satisfies SeoRouteData
        }
    },
    {
        path: '**',
        loadComponent: () => import('./common/not-found/not-found.component').then(m => m.NotFoundComponent),
        data: {
            seo: {
                title: 'Página no encontrada | VINOVA',
                description: HOME_DESCRIPTION
            } satisfies SeoRouteData
        }
    }
];
