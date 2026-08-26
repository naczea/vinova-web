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

  private readonly mockCatalogItems: InventoryItem[] = [
    {
      id: 'mock-1',
      code: 'VIN-001',
      name: 'Montura Clásica Negra',
      type: 'Montura',
      brand: 'Vinova',
      model: 'Classic One',
      description: 'Montura ligera para uso diario.',
      color: 'Negro',
      material: 'Acetato',
      stock: 8,
      price: 120,
      image_url: 'images/services/services-1.jpg',
      is_published: true,
      is_active: true
    },
    {
      id: 'mock-2',
      code: 'VIN-002',
      name: 'Gafas Redondas Carey',
      type: 'Gafas',
      brand: 'Vinova',
      model: 'Round Care',
      description: 'Diseño moderno con acabado carey.',
      color: 'Carey',
      material: 'Acetato',
      stock: 4,
      price: 145,
      image_url: 'images/services/services-1.jpg',
      is_published: true,
      is_active: true
    },
    {
      id: 'mock-3',
      code: 'VIN-003',
      name: 'Lentes Deportivos Azul',
      type: 'Lentes',
      brand: 'Vinova Sport',
      model: 'Active Blue',
      description: 'Ideales para actividades al aire libre.',
      color: 'Azul',
      material: 'Policarbonato',
      stock: 12,
      price: 175,
      image_url: 'images/services/services-1.jpg',
      is_published: true,
      is_active: true
    },
    {
      id: 'mock-1',
      code: 'VIN-001',
      name: 'Montura Clásica Negra',
      type: 'Montura',
      brand: 'Vinova',
      model: 'Classic One',
      description: 'Montura ligera para uso diario.',
      color: 'Negro',
      material: 'Acetato',
      stock: 8,
      price: 120,
      image_url: 'images/services/services-1.jpg',
      is_published: true,
      is_active: true
    },
    {
      id: 'mock-1',
      code: 'VIN-001',
      name: 'Montura Clásica Negra',
      type: 'Montura',
      brand: 'Vinova',
      model: 'Classic One',
      description: 'Montura ligera para uso diario.',
      color: 'Negro',
      material: 'Acetato',
      stock: 8,
      price: 120,
      image_url: 'images/services/services-1.jpg',
      is_published: true,
      is_active: true
    },
    {
      id: 'mock-1',
      code: 'VIN-001',
      name: 'Montura Clásica Negra',
      type: 'Montura',
      brand: 'Vinova',
      model: 'Classic One',
      description: 'Montura ligera para uso diario.',
      color: 'Negro',
      material: 'Acetato',
      stock: 8,
      price: 120,
      image_url: 'images/services/services-1.jpg',
      is_published: true,
      is_active: true
    },
    {
      id: 'mock-1',
      code: 'VIN-001',
      name: 'Montura Clásica Negra',
      type: 'Montura',
      brand: 'Vinova',
      model: 'Classic One',
      description: 'Montura ligera para uso diario.',
      color: 'Negro',
      material: 'Acetato',
      stock: 8,
      price: 120,
      image_url: 'images/services/services-1.jpg',
      is_published: true,
      is_active: true
    },
    {
      id: 'mock-1',
      code: 'VIN-001',
      name: 'Montura Clásica Negra',
      type: 'Montura',
      brand: 'Vinova',
      model: 'Classic One',
      description: 'Montura ligera para uso diario.',
      color: 'Negro',
      material: 'Acetato',
      stock: 8,
      price: 120,
      image_url: 'images/services/services-1.jpg',
      is_published: true,
      is_active: true
    },
    {
      id: 'mock-4',
      code: 'VIN-004',
      name: 'Montura Minimal Plateada',
      type: 'Montura',
      brand: 'Vinova',
      model: 'Minimal Silver',
      description: 'Estilo elegante y discreto.',
      color: 'Plateado',
      material: 'Metal',
      stock: 2,
      price: 160,
      image_url: 'images/services/services-1.jpg',
      is_published: true,
      is_active: true
    }
  ];

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      await this.loadCatalogFromMock();
      // await this.loadCatalogFromDatabase();
    }
  }

  async loadCatalogFromDatabase() {
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

  async loadCatalogFromMock() {
    this.loading = true;
    this.items = this.mockCatalogItems;
    this.loading = false;
  }

 

}
