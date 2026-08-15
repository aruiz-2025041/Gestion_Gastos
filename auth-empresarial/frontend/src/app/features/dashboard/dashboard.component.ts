import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 2rem;">
      <h1>Dashboard</h1>
      @if (authService.currentUser(); as user) {
        <p>Bienvenido, {{ user.name }} ({{ user.email }})</p>
      }
      <button (click)="onLogout()">Cerrar sesion</button>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.loadCurrentUser().subscribe();
  }

  onLogout(): void {
    this.authService.logout().subscribe(() => this.router.navigate(['/login']));
  }
}
