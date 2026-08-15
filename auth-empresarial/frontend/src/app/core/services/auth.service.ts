import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, RegisterRequest, User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private accessToken: string | null = null;
  private currentUserSignal = signal<User | null>(null);
  readonly currentUser = this.currentUserSignal.asReadonly();

  constructor(private http: HttpClient) {}

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
      }));
  }

  refresh(): Observable<{ accessToken: string }> {
    return this.http
      .post<{ accessToken: string }>(`${environment.apiUrl}/auth/refresh`, {}, { withCredentials: true })
      .pipe(tap((response) => { this.accessToken = response.accessToken; }));
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
        this.accessToken = null;
        this.currentUserSignal.set(null);
      }));
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }
}
