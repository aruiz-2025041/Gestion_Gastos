import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, RegisterRequest, User } from '../models/user.model';
import { InactivityService } from './inactivity.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private inactivityService = inject(InactivityService);

  private accessToken: string | null = null;
  private currentUserSignal = signal<User | null>(null);
  readonly currentUser = this.currentUserSignal.asReadonly();

  register(data: RegisterRequest): Observable<{ message: string; user: User }> {
    return this.http.post<{ message: string; user: User }>(
      `${environment.apiUrl}/auth/register`, data
    );
  }

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, data, { withCredentials: true })
      .pipe(tap((response) => {
        this.accessToken = response.accessToken;
        this.currentUserSignal.set(response.user);

        // Inicia el monitoreo de 5 minutos tras login exitoso
        this.inactivityService.startMonitoring();
      }));
  }

  refresh(): Observable<{ accessToken: string }> {
    return this.http
      .post<{ accessToken: string }>(`${environment.apiUrl}/auth/refresh`, {}, { withCredentials: true })
      .pipe(tap((response) => { 
        this.accessToken = response.accessToken; 
        this.inactivityService.startMonitoring();
      }));
  }

  loadCurrentUser(): Observable<{ user: User }> {
    return this.http
      .get<{ user: User }>(`${environment.apiUrl}/auth/me`)
      .pipe(tap((response) => this.currentUserSignal.set(response.user)));
  }

  logout(): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>(`${environment.apiUrl}/auth/logout`, {}, { withCredentials: true })
      .pipe(tap(() => {
        this.clearSession();
      }));
  }

  /** Limpia variables y detiene el monitoreo */
  clearSession(): void {
    this.clearSessionOnly();
    this.inactivityService.stopMonitoring();
  }

  /** Limpia solo las variables locales en memoria sin invocar al InactivityService */
  clearSessionOnly(): void {
    this.accessToken = null;
    this.currentUserSignal.set(null);
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }
}