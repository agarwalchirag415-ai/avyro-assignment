import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Role, Permission } from '../models';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private readonly STORAGE_KEY = 'rbac_roles';
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  
  private rolesSubject = new BehaviorSubject<Role[]>(this.loadRoles());
  public roles$ = this.rolesSubject.asObservable();

  constructor() {
    if (this.isBrowser) {
      this.initializeDefaultRoles();
    }
  }

  getAllRoles(): Observable<Role[]> {
    return of(this.rolesSubject.value).pipe(delay(300));
  }

  getRoleById(id: string): Observable<Role | undefined> {
    const role = this.rolesSubject.value.find(r => r.id === id);
    return of(role).pipe(delay(200));
  }

  createRole(role: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>): Observable<Role> {
    const newRole: Role = {
      ...role,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const roles = [...this.rolesSubject.value, newRole];
    this.updateRoles(roles);
    return of(newRole).pipe(delay(300));
  }

  updateRole(id: string, updates: Partial<Role>): Observable<Role> {
    const roles = this.rolesSubject.value;
    const index = roles.findIndex(r => r.id === id);

    if (index === -1) {
      return throwError(() => new Error('Role not found'));
    }

    const updatedRole: Role = {
      ...roles[index],
      ...updates,
      id: roles[index].id,
      updatedAt: new Date()
    };

    roles[index] = updatedRole;
    this.updateRoles(roles);
    return of(updatedRole).pipe(delay(300));
  }

  deleteRole(id: string): Observable<boolean> {
    const roles = this.rolesSubject.value.filter(r => r.id !== id);
    if (roles.length === this.rolesSubject.value.length) {
      return throwError(() => new Error('Role not found'));
    }
    this.updateRoles(roles);
    return of(true).pipe(delay(300));
  }

  getAvailablePermissions(): Permission[] {
    return [
      {
        id: '1',
        name: 'Dashboard Access',
        type: 'page',
        code: 'dashboard',
        description: 'Access to dashboard page'
      },
      {
        id: '2',
        name: 'Users Access',
        type: 'page',
        code: 'users',
        description: 'Access to users page'
      },
      {
        id: '3',
        name: 'Roles Access',
        type: 'page',
        code: 'roles',
        description: 'Access to roles page'
      },
      {
        id: '4',
        name: 'Add User',
        type: 'feature',
        code: 'add-user',
        description: 'Can add new users'
      },
      {
        id: '5',
        name: 'Edit User',
        type: 'feature',
        code: 'edit-user',
        description: 'Can edit existing users'
      },
      {
        id: '6',
        name: 'Delete User',
        type: 'feature',
        code: 'delete-user',
        description: 'Can delete users'
      },
      {
        id: '7',
        name: 'Add Role',
        type: 'feature',
        code: 'add-role',
        description: 'Can add new roles'
      },
      {
        id: '8',
        name: 'Edit Role',
        type: 'feature',
        code: 'edit-role',
        description: 'Can edit existing roles'
      },
      {
        id: '9',
        name: 'Delete Role',
        type: 'feature',
        code: 'delete-role',
        description: 'Can delete roles'
      }
    ];
  }

  private initializeDefaultRoles(): void {
    const roles = this.rolesSubject.value;
    if (roles.length === 0) {
      const defaultRoles: Role[] = [
        {
          id: '1',
          name: 'Admin',
          description: 'System Administrator with full access',
          permissions: this.getAvailablePermissions(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          name: 'Manager',
          description: 'Can manage users but has limited role permissions',
          permissions: this.getAvailablePermissions().filter(p => 
            ['dashboard', 'users', 'add-user', 'edit-user'].includes(p.code)
          ),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '3',
          name: 'Viewer',
          description: 'Read-only access to dashboard and users',
          permissions: this.getAvailablePermissions().filter(p => 
            ['dashboard', 'users'].includes(p.code)
          ),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      this.updateRoles(defaultRoles);
    }
  }

  private updateRoles(roles: Role[]): void {
    this.rolesSubject.next(roles);
    this.saveRoles(roles);
  }

  private saveRoles(roles: Role[]): void {
    if (this.isBrowser) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(roles));
    }
  }

  private loadRoles(): Role[] {
    if (!this.isBrowser) {
      return [];
    }
    
    const rolesStr = localStorage.getItem(this.STORAGE_KEY);
    if (rolesStr) {
      try {
        return JSON.parse(rolesStr);
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

