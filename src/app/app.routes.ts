import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './common/not-found/not-found.component';
import { AdminLoginComponent } from './pages/admin-login/admin-login.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { adminGuard } from './core/guards/admin.guard';

import { CatalogComponent } from './pages/catalog/catalog.component';

export const routes: Routes = [
    { path: '', component: HomeComponent, pathMatch: 'full' },
    { path: 'catalogo', component: CatalogComponent },
    { 
      path: 'admin/login', 
      component: AdminLoginComponent 
    },
    { 
      path: 'admin/dashboard', 
      component: AdminDashboardComponent, 
      canActivate: [adminGuard] 
    },
    { path: '**', component: NotFoundComponent }
];
