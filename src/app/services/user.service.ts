import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User } from '../models';
import { RoleService } from './role.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly STORAGE_KEY = 'rbac_users';
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  
  private usersSubject = new BehaviorSubject<User[]>(this.loadUsers());
  public users$ = this.usersSubject.asObservable();

  constructor(private roleService: RoleService) {
    if (this.isBrowser) {
      this.initializeDefaultUsers();
    }
  }

  getAllUsers(): Observable<User[]> {
    return of(this.usersSubject.value).pipe(delay(300));
  }

  getUserById(id: string): Observable<User | undefined> {
    const user = this.usersSubject.value.find(u => u.id === id);
    return of(user).pipe(delay(200));
  }

  createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Observable<User> {
    // Check if username already exists
    if (this.usersSubject.value.some(u => u.username === user.username)) {
      return throwError(() => new Error('Username already exists'));
    }

    // Validate password is provided
    if (!user.password || user.password.length < 6) {
      return throwError(() => new Error('Password is required and must be at least 6 characters'));
    }

    const newUser: User = {
      ...user,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const users = [...this.usersSubject.value, newUser];
    this.updateUsers(users);
    return of(newUser).pipe(delay(300));
  }

  updateUser(id: string, updates: Partial<User>): Observable<User> {
    const users = this.usersSubject.value;
    const index = users.findIndex(u => u.id === id);

    if (index === -1) {
      return throwError(() => new Error('User not found'));
    }

    // Check if username is being changed and already exists
    if (updates.username && updates.username !== users[index].username) {
      if (users.some(u => u.username === updates.username && u.id !== id)) {
        return throwError(() => new Error('Username already exists'));
      }
    }

    const updatedUser: User = {
      ...users[index],
      ...updates,
      id: users[index].id,
      updatedAt: new Date()
    };

    users[index] = updatedUser;
    this.updateUsers(users);
    return of(updatedUser).pipe(delay(300));
  }

  deleteUser(id: string): Observable<boolean> {
    const users = this.usersSubject.value.filter(u => u.id !== id);
    if (users.length === this.usersSubject.value.length) {
      return throwError(() => new Error('User not found'));
    }
    this.updateUsers(users);
    return of(true).pipe(delay(300));
  }

  private initializeDefaultUsers(): void {
    const users = this.usersSubject.value;
    if (users.length === 0) {
      this.roleService.getAllRoles().subscribe(roles => {
        const adminRole = roles.find(r => r.name === 'Admin');
        const managerRole = roles.find(r => r.name === 'Manager');
        const viewerRole = roles.find(r => r.name === 'Viewer');

        const defaultUsers: User[] = [
          {
            id: '1',
            username: 'admin',
            password: 'admin',
            email: 'admin@rbac.com',
            firstName: 'Admin',
            lastName: 'User',
            role: adminRole,
            roleId: adminRole?.id,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: '2',
            username: 'john.manager',
            password: 'manager123',
            email: 'john@company.com',
            firstName: 'John',
            lastName: 'Manager',
            role: managerRole,
            roleId: managerRole?.id,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: '3',
            username: 'jane.viewer',
            password: 'viewer123',
            email: 'jane@company.com',
            firstName: 'Jane',
            lastName: 'Viewer',
            role: viewerRole,
            roleId: viewerRole?.id,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ];
        this.updateUsers(defaultUsers);
      });
    }
  }

  private updateUsers(users: User[]): void {
    this.usersSubject.next(users);
    this.saveUsers(users);
  }

  private saveUsers(users: User[]): void {
    if (this.isBrowser) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
    }
  }

  private loadUsers(): User[] {
    if (!this.isBrowser) {
      return [];
    }
    
    const usersStr = localStorage.getItem(this.STORAGE_KEY);
    if (usersStr) {
      try {
        return JSON.parse(usersStr);
      } catch {
        return [];
      }
    }
    return [];
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

