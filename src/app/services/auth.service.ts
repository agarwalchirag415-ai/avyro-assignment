import { Injectable, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthUser, LoginCredentials, User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_KEY = 'rbac_auth_user';
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  // Using signals for reactive state
  currentUserSignal = signal<AuthUser | null>(this.getUserFromStorage());
  isAuthenticated = computed(() => this.currentUserSignal() !== null);

  constructor(private router: Router) {}

  login(credentials: LoginCredentials): Observable<AuthUser | null> {
    return new Observable(observer => {
      // Fallback: Check for hardcoded admin credentials first
      if (credentials.username === 'admin' && credentials.password === 'admin') {
        const authUser: AuthUser = {
          id: '1',
          username: 'admin',
          email: 'admin@rbac.com',
          firstName: 'Admin',
          lastName: 'User',
          role: {
            id: '1',
            name: 'Admin',
            description: 'System Administrator with full access',
            permissions: [
              { id: '1', name: 'Dashboard Access', type: 'page', code: 'dashboard', description: 'Access to dashboard page' },
              { id: '2', name: 'Users Access', type: 'page', code: 'users', description: 'Access to users page' },
              { id: '3', name: 'Roles Access', type: 'page', code: 'roles', description: 'Access to roles page' },
              { id: '4', name: 'Add User', type: 'feature', code: 'add-user', description: 'Can add new users' },
              { id: '5', name: 'Edit User', type: 'feature', code: 'edit-user', description: 'Can edit existing users' },
              { id: '6', name: 'Delete User', type: 'feature', code: 'delete-user', description: 'Can delete users' },
              { id: '7', name: 'Add Role', type: 'feature', code: 'add-role', description: 'Can add new roles' },
              { id: '8', name: 'Edit Role', type: 'feature', code: 'edit-role', description: 'Can edit existing roles' },
              { id: '9', name: 'Delete Role', type: 'feature', code: 'delete-role', description: 'Can delete roles' }
            ],
            createdAt: new Date(),
            updatedAt: new Date()
          }
        };

        this.setAuthUser(authUser);
        observer.next(authUser);
        observer.complete();
        return;
      }

      // Dynamic login: Check against users in localStorage
      const getUsersFromStorage = (): User[] => {
        if (!this.isBrowser) return [];
        
        const usersStr = localStorage.getItem('rbac_users');
        if (!usersStr) return [];
        
        try {
          return JSON.parse(usersStr);
        } catch {
          return [];
        }
      };

      // Use timeout to allow UserService initialization
      setTimeout(() => {
        const users = getUsersFromStorage();
        
        // Find user with matching username and password
        const user = users.find(
          u => u.username === credentials.username && 
               u.password === credentials.password &&
               u.isActive
        );

        if (user && user.role) {
          const authUser: AuthUser = {
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
          };

          this.setAuthUser(authUser);
          observer.next(authUser);
          observer.complete();
        } else {
          observer.error({ message: 'Invalid username or password' });
        }
      }, 500); // Give UserService time to initialize
    });
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.AUTH_KEY);
    }
    this.currentUserSubject.next(null);
    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUserSignal();
  }

  hasPermission(permissionCode: string): boolean {
    const user = this.currentUserSignal();
    if (!user || !user.role) return false;
    return user.role.permissions.some(p => p.code === permissionCode);
  }

  hasPageAccess(page: string): boolean {
    const user = this.currentUserSignal();
    if (!user || !user.role) return false;
    return user.role.permissions.some(p => p.type === 'page' && p.code === page);
  }

  private setAuthUser(user: AuthUser): void {
    if (this.isBrowser) {
      localStorage.setItem(this.AUTH_KEY, JSON.stringify(user));
    }
    this.currentUserSubject.next(user);
    this.currentUserSignal.set(user);
  }

  private getUserFromStorage(): AuthUser | null {
    if (!this.isBrowser) {
      return null;
    }
    
    const userStr = localStorage.getItem(this.AUTH_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }
}

