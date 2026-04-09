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
}
