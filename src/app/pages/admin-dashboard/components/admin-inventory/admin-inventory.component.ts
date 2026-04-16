import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../../core/services/supabase.service';
import { InventoryItem } from '../../../../core/models/database.models';

@Component({
  selector: 'app-admin-inventory',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-inventory.component.html',
  styleUrl: './admin-inventory.component.scss'
})
export class AdminInventoryComponent implements OnInit {
  private supabaseService = inject(SupabaseService);

  inventory: InventoryItem[] = [];
  loading: boolean = true;
  showForm: boolean = false;
  isEditing: boolean = false;
  
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  uploadingImage: boolean = false;

  currentItem: InventoryItem = {
    code: '',
    name: '',
    type: '',
    model: '',
    brand: '',
    description: '',
    color: '',
    material: '',
    stock: 0,
    price: 0.00,
    image_url: '',
    is_published: true,
    is_active: true
  };

  ngOnInit(): void {
    this.loadInventory();
  }

  async loadInventory() {
    this.loading = true;
    const { data, error } = await this.supabaseService.getInventory();
    if (!error && data) {
      this.inventory = data as InventoryItem[];
    } else {
      console.error('Error al cargar inventario:', error);
    }
    this.loading = false;
  }

  openNewForm() {
    this.isEditing = false;
    this.resetForm();
    this.showForm = true;
  }

  editItem(item: InventoryItem) {
    this.isEditing = true;
    this.currentItem = { ...item };
    this.selectedFile = null;
    this.imagePreview = item.image_url || null;
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.resetForm();
  }

  resetForm() {
    this.selectedFile = null;
    this.imagePreview = null;
    this.currentItem = {
      code: '', name: '', type: '', model: '', brand: '', description: '',
      color: '', material: '', stock: 0, price: 0.00, image_url: '',
      is_published: true, is_active: true
    };
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Mostrar preview localmente de manera rápida
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async saveItem() {
    // Validaciones
    if (!this.currentItem.code || !this.currentItem.name || !this.currentItem.type || !this.currentItem.model) {
      alert('Favor llena todos los campos obligatorios (*).');
      return;
    }

    if (this.currentItem.stock < 0 || this.currentItem.price < 0) {
      alert('El stock y el precio no pueden ser negativos.');
      return;
    }

    let finalImageUrl = this.currentItem.image_url;

    // Si hay un archivo seleccionado, primero subimos la imagen
    if (this.selectedFile) {
      this.uploadingImage = true;
      const fileExt = this.selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `armasones/${fileName}`;

      // Asumimos que creaste un bucket llamado 'inventory_images' en Supabase
      const { data, error } = await this.supabaseService.uploadImage('inventory_images', filePath, this.selectedFile);
      this.uploadingImage = false;

      if (error) {
        alert('Hubo un error al subir la imagen. Verifica que el bucket "inventory_images" exista y sea público.');
        console.error(error);
        return;
      }
      
      if (data) {
        finalImageUrl = data.publicUrl;
      }
    }

    const payloadToSave = { ...this.currentItem, image_url: finalImageUrl };

    // Limpiamos opcionales vacíos
    if (!payloadToSave.brand) delete payloadToSave.brand;
    if (!payloadToSave.description) delete payloadToSave.description;
    if (!payloadToSave.color) delete payloadToSave.color;
    if (!payloadToSave.material) delete payloadToSave.material;
    if (!payloadToSave.image_url) delete payloadToSave.image_url;

    if (this.isEditing && this.currentItem.id) {
      const { error } = await this.supabaseService.updateInventoryItem(this.currentItem.id, payloadToSave);
      if (!error) {
        this.loadInventory();
        this.closeForm();
      } else alert('Error al actualizar: ' + error.message);
    } else {
      const { error } = await this.supabaseService.createInventoryItem(payloadToSave);
      if (!error) {
        this.loadInventory();
        this.closeForm();
      } else alert('Error al crear: ' + error.message);
    }
  }

  async toggleActive(item: InventoryItem) {
    if (confirm(`¿Cambiar el estado del artículo ${item.name}?`)) {
      const { error } = await this.supabaseService.updateInventoryItem(item.id!, { is_active: !item.is_active });
      if (!error) this.loadInventory();
    }
  }
}
