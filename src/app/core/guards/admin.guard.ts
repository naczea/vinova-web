import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

export const adminGuard: CanActivateFn = async (route, state) => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);

  // Verificamos si hay una sesión activa
  const { data, error } = await supabaseService.getSession();

  if (data.session) {
    return true; // Acceso permitido
  }

  // Si no hay sesión, lo mandamos al login
  router.navigate(['/admin/login']);
  return false; 
};
