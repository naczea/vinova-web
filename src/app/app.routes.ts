import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: '**',
        loadComponent: () => import('./common/not-found/not-found.component').then(m => m.NotFoundComponent)
    }
];
