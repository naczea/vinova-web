import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../../core/services/supabase.service';
import { Client } from '../../../../core/models/database.models';

@Component({
  selector: 'app-admin-clients',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-clients.component.html',
  styleUrl: './admin-clients.component.scss'
})
export class AdminClientsComponent implements OnInit {
  private supabaseService = inject(SupabaseService);

  clients: Client[] = [];
  loading: boolean = true;
  showForm: boolean = false;
  isEditing: boolean = false;
  
  // Objeto vacío para el formulario
  currentClient: Client = {
    first_name: '',
    last_name: '',
    identification: '',
    phone: '',
    email: '',
    birth_date: '',
    gender: '',
    notes: '',
    accepts_conditions: true,
    is_active: true
  };

  ngOnInit(): void {
    this.loadClients();
  }

  async loadClients() {
    this.loading = true;
    const { data, error } = await this.supabaseService.getClients();
    if (!error && data) {
      this.clients = data as Client[];
    } else {
      console.error('Error al cargar clientes:', error);
    }
    this.loading = false;
  }

  openNewForm() {
    this.isEditing = false;
    this.currentClient = {
      first_name: '',
      last_name: '',
      identification: '',
      phone: '',
      email: '',
      birth_date: '',
      gender: '',
      notes: '',
      accepts_conditions: true,
      is_active: true
    };
    this.showForm = true;
  }

  editClient(client: Client) {
    this.isEditing = true;
    this.currentClient = { ...client }; // Clonamos para no modificar la lista original hasta guardar
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
  }

  async saveClient() {
    if (!this.currentClient.first_name || !this.currentClient.last_name || !this.currentClient.identification || !this.currentClient.phone) {
      alert('Por favor, llena los campos obligatorios: Nombres, Apellidos, Identificación y Teléfono.');
      return;
    }

    // Limpiamos campos vacíos para evitar mandar strings vacíos en fechas (Supabase espera null o date)
    const payloadToSave = { ...this.currentClient };
    if (!payloadToSave.birth_date) delete payloadToSave.birth_date;

    if (this.isEditing && this.currentClient.id) {
      const { error } = await this.supabaseService.updateClient(this.currentClient.id, payloadToSave);
      if (!error) {
        this.loadClients();
        this.closeForm();
      } else {
        alert('Error al actualizar: ' + error.message);
      }
    } else {
      const { error } = await this.supabaseService.createClient(payloadToSave);
      if (!error) {
        this.loadClients();
        this.closeForm();
      } else {
        alert('Error al crear: ' + error.message);
      }
    }
  }

  async setInactive(id: string) {
    if (confirm('¿Estás seguro de marcar a este cliente como inactivo?')) {
      const { error } = await this.supabaseService.updateClient(id, { is_active: false });
      if (!error) {
        this.loadClients();
      }
    }
  }
}

