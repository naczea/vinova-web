import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    const isBrowser = isPlatformBrowser(this.platformId);

    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey, {
      auth: {
        persistSession: isBrowser,
        autoRefreshToken: isBrowser,
        detectSessionInUrl: isBrowser
      }
    });
  }

  // Obtener la sesión actual para el Guard
  async getSession() {
    return await this.supabase.auth.getSession();
  }

  // Método para hacer login
  async signIn(email: string, pass: string) {
    return await this.supabase.auth.signInWithPassword({
      email: email,
      password: pass,
    });
  }

  // Método para cerrar sesión
  async signOut() {
    return await this.supabase.auth.signOut();
  }

  // --- CRUD DE CLIENTES ---

  async getClients() {
    return await this.supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
  }

  async createClient(client: any) {
    return await this.supabase
      .from('clients')
      .insert([client]);
  }

  async updateClient(id: string, client: any) {
    return await this.supabase
      .from('clients')
      .update(client)
      .eq('id', id);
  }

  async deleteClient(id: string) {
    return await this.supabase
      .from('clients')
      .delete()
      .eq('id', id);
  }

  // --- CRUD DE INVENTARIO ---

  async getInventory() {
    return await this.supabase
      .from('inventory')
      .select('*')
      .order('created_at', { ascending: false });
  }

  async getPublishedInventory() {
    return await this.supabase
      .from('inventory')
      .select('*')
      .eq('is_published', true)
      .gt('stock', 0)
      .order('created_at', { ascending: false });
  }

  async createInventoryItem(item: any) {
    return await this.supabase
      .from('inventory')
      .insert([item]);
  }

  async updateInventoryItem(id: string, item: any) {
    return await this.supabase
      .from('inventory')
      .update(item)
      .eq('id', id);
  }

  async deleteInventoryItem(id: string) {
    return await this.supabase
      .from('inventory')
      .delete()
      .eq('id', id);
  }

  // --- ALMACENAMIENTO DE IMÁGENES (STORAGE) ---

  async uploadImage(bucket: string, path: string, file: File) {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(path, file);

    if (error) {
      return { data: null, error };
    }

    // Obtener la URL pública de la imagen
    const { data: publicUrlData } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return { 
      data: { publicUrl: publicUrlData.publicUrl }, 
      error: null 
    };
  }
}
