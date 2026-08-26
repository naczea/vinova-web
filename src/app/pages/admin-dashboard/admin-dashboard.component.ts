import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SupabaseService } from '../../core/services/supabase.service';
import { AdminClientsComponent } from './components/admin-clients/admin-clients.component';
import { AdminInventoryComponent } from './components/admin-inventory/admin-inventory.component';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, AdminClientsComponent, AdminInventoryComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {
  private supabaseService = inject(SupabaseService);
  private router = inject(Router);

  activeTab: 'clients' | 'inventory' = 'inventory';
  isSidebarCollapsed: boolean = false;

  async logout() {
    await this.supabaseService.signOut();
    this.router.navigate(['/admin/login']);
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}
