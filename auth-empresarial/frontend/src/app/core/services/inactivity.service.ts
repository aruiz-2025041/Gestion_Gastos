  import { Injectable, inject, NgZone, Injector } from '@angular/core';
  import { Router } from '@angular/router';
  import { AuthService } from './auth.service';
  import { fromEvent, merge, Subscription, timer } from 'rxjs';
  import { switchMap, startWith } from 'rxjs/operators';

  @Injectable({
    providedIn: 'root'
  })
  export class InactivityService {
    private router = inject(Router);
    private ngZone = inject(NgZone);
    private injector = inject(Injector);

    // 2 minutos de inactividad (2 min * 60 seg * 1000 ms)
    private readonly INACTIVITY_TIME = 2 * 60 * 1000; // 2 minutos
    private userActivitySubscription?: Subscription;

    /**
     * Arranca el monitoreo de inactividad
     */
    startMonitoring(): void {
      this.stopMonitoring();

      const activityEvents$ = merge(
        fromEvent(window, 'mousemove'),
        fromEvent(window, 'keydown'),
        fromEvent(window, 'click'),
        fromEvent(window, 'scroll'),
        fromEvent(window, 'touchstart')
      ).pipe(startWith(0));

      // Se ejecuta fuera de la zona de Angular para optimizar rendimiento
      this.ngZone.runOutsideAngular(() => {
        this.userActivitySubscription = activityEvents$
          .pipe(
            switchMap(() => timer(this.INACTIVITY_TIME))
          )
          .subscribe(() => {
            this.ngZone.run(() => {
              this.handleTimeout();
            });
          });
      });
    }

    /**
     * Detiene el monitoreo activo
     */
    stopMonitoring(): void {
      if (this.userActivitySubscription) {
        this.userActivitySubscription.unsubscribe();
      }
    }

    /**
     * Ejecutado tras 2 minutos de inactividad
     */
    private handleTimeout(): void {
      this.stopMonitoring();

      // Inyección diferida para romper el bucle de dependencia circular
      const authService = this.injector.get(AuthService);
      
      // Limpia únicamente las variables del estado
      authService.clearSessionOnly();

      // Redirige al login notificando el motivo
      this.router.navigate(['/login'], {
        queryParams: { sessionExpired: 'inactivity' }
      });
    }
  }