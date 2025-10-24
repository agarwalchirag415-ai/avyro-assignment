import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoleService, AuthService, ToastService } from '../../services';
import { Role, Permission } from '../../models';
import { HasPermissionDirective } from '../../directives';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, FormsModule, HasPermissionDirective],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})
export class RolesComponent implements OnInit {
  roles = signal<Role[]>([]);
  availablePermissions = signal<Permission[]>([]);
  isLoading = signal(false);
  showModal = signal(false);
  isEditMode = signal(false);
  selectedRole = signal<Role | null>(null);
  
  roleForm = signal<{
    name: string;
    description: string;
    permissions: Permission[];
  }>({
    name: '',
    description: '',
    permissions: []
  });

  errorMessage = signal('');

  constructor(
    private roleService: RoleService,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadRoles();
    this.loadAvailablePermissions();
  }

  loadRoles(): void {
    this.isLoading.set(true);
    this.roleService.getAllRoles().subscribe({
      next: (roles) => {
        this.roles.set(roles);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.toastService.error('Failed to load roles');
      }
    });
  }

  loadAvailablePermissions(): void {
    this.availablePermissions.set(this.roleService.getAvailablePermissions());
  }

  openAddModal(): void {
    this.isEditMode.set(false);
    this.selectedRole.set(null);
    this.roleForm.set({
      name: '',
      description: '',
      permissions: []
    });
    this.showModal.set(true);
  }

  openEditModal(role: Role): void {
    this.isEditMode.set(true);
    this.selectedRole.set(role);
    this.roleForm.set({
      name: role.name,
      description: role.description || '',
      permissions: [...role.permissions]
    });
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.errorMessage.set('');
  }

  togglePermission(permission: Permission): void {
    const currentForm = this.roleForm();
    const permissions = [...currentForm.permissions];
    const index = permissions.findIndex(p => p.id === permission.id);
    
    if (index > -1) {
      permissions.splice(index, 1);
    } else {
      permissions.push(permission);
    }
    
    this.roleForm.set({
      ...currentForm,
      permissions
    });
  }

  isPermissionSelected(permission: Permission): boolean {
    return this.roleForm().permissions.some(p => p.id === permission.id);
  }

  saveRole(): void {
    const form = this.roleForm();
    
    if (!form.name) {
      this.errorMessage.set('Please enter a role name');
      return;
    }

    if (this.isEditMode()) {
      const roleId = this.selectedRole()?.id;
      if (!roleId) return;

      this.roleService.updateRole(roleId, {
        name: form.name,
        description: form.description,
        permissions: form.permissions
      }).subscribe({
        next: () => {
          this.toastService.success('Role updated successfully');
          this.closeModal();
          this.loadRoles();
        },
        error: (error) => {
          this.errorMessage.set(error.message || 'Failed to update role');
        }
      });
    } else {
      this.roleService.createRole({
        name: form.name,
        description: form.description,
        permissions: form.permissions
      }).subscribe({
        next: () => {
          this.toastService.success('Role created successfully');
          this.closeModal();
          this.loadRoles();
        },
        error: (error) => {
          this.errorMessage.set(error.message || 'Failed to create role');
        }
      });
    }
  }

  deleteRole(role: Role): void {
    if (!confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
      return;
    }

    this.roleService.deleteRole(role.id).subscribe({
      next: () => {
        this.toastService.success('Role deleted successfully');
        this.loadRoles();
      },
      error: (error) => {
        this.toastService.error(error.message || 'Failed to delete role');
      }
    });
  }

  getPermissionsByType(type: 'page' | 'feature'): Permission[] {
    return this.availablePermissions().filter(p => p.type === type);
  }

  hasPermission(permission: string): boolean {
    return this.authService.hasPermission(permission);
  }

}

