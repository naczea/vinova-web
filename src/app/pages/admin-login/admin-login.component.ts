import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../core/services/supabase.service';

@Component({
  selector: 'app-admin-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.scss'
})
export class AdminLoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  loading = false;

  private supabaseService = inject(SupabaseService);
  private router = inject(Router);

  async onLogin() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor completa todos los campos.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const { data, error } = await this.supabaseService.signIn(this.email, this.password);

    if (error) {
      this.errorMessage = 'Credenciales incorrectas o error de conexión.';
      this.loading = false;
    } else {
      // Si el login es exitoso, redirigimos al dashboard
      this.router.navigate(['/admin/dashboard']);
    }
  }
}

