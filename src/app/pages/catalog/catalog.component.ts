import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { SupabaseService } from '../../core/services/supabase.service';
import { InventoryItem } from '../../core/models/database.models';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-catalog',
  imports: [CommonModule],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss'
})
export class CatalogComponent implements OnInit {
  private supabaseService = inject(SupabaseService);
  private platformId = inject(PLATFORM_ID);
  
  items: InventoryItem[] = [];
  loading: boolean = true;

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      await this.loadCatalog();
    }
  }

  async loadCatalog() {
    try {
      this.loading = true;
      // Get only published items with stock > 0
      const { data, error } = await this.supabaseService.getPublishedInventory();

      if (error) throw error;
      this.items = data || [];
      
    } catch (error) {
      console.error('Error loading catalog:', error);
    } finally {
      this.loading = false;
    }
  }

}
