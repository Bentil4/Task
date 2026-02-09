import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../core/services/storage.service';
import { STORAGE_KEYS } from '../../core/constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private storage = inject(StorageService);
  private router = inject(Router);
  
  public readonly isAuthenticated = signal<boolean>(
    this.storage.getItem(STORAGE_KEYS.AUTH) === 'true'
  );

  public login(): void {
    this.storage.setItem(STORAGE_KEYS.AUTH, 'true');
    this.isAuthenticated.set(true);
    this.router.navigate(['/']);
  }

  public logout(): void {
    this.storage.removeItem(STORAGE_KEYS.AUTH);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  public checkAuth(): boolean {
    return this.isAuthenticated();
  }
}
