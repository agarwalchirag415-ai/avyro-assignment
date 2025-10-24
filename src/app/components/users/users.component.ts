import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, RoleService, AuthService, ToastService } from '../../services';
import { User, Role } from '../../models';
import { HasPermissionDirective } from '../../directives';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, HasPermissionDirective],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  // Expose Math to template
  Math = Math;
  
  users = signal<User[]>([]);
  roles = signal<Role[]>([]);
  isLoading = signal(false);
  showModal = signal(false);
  isEditMode = signal(false);
  selectedUser = signal<User | null>(null);
  
  // Search and Pagination
  searchQuery = signal('');
  currentPage = signal(1);
  itemsPerPage = signal(5);
  
  // Filtered users based on search
  filteredUsers = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const allUsers = this.users();
    
    if (!query) {
      return allUsers;
    }
    
    return allUsers.filter(user => 
      user.username.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.firstName.toLowerCase().includes(query) ||
      user.lastName.toLowerCase().includes(query)
    );
  });
  
  // Total pages
  totalPages = computed(() => {
    return Math.ceil(this.filteredUsers().length / this.itemsPerPage());
  });
  
  // Paginated users
  paginatedUsers = computed(() => {
    const filtered = this.filteredUsers();
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    return filtered.slice(start, end);
  });
  
  userForm = signal<Partial<User>>({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    roleId: '',
    isActive: true
  });

  errorMessage = signal('');

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.toastService.error('Failed to load users');
      }
    });
  }

  loadRoles(): void {
    this.roleService.getAllRoles().subscribe({
      next: (roles) => {
        this.roles.set(roles);
      }
    });
  }

  openAddModal(): void {
    this.isEditMode.set(false);
    this.selectedUser.set(null);
    this.userForm.set({
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      roleId: '',
      isActive: true
    });
    this.showModal.set(true);
  }

  openEditModal(user: User): void {
    this.isEditMode.set(true);
    this.selectedUser.set(user);
    this.userForm.set({
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roleId: user.roleId,
      isActive: user.isActive
    });
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.errorMessage.set('');
  }

  saveUser(): void {
    const form = this.userForm();
    
    if (!form.username || !form.email || !form.firstName || !form.lastName) {
      this.errorMessage.set('Please fill in all required fields');
      return;
    }

    const role = this.roles().find(r => r.id === form.roleId);
    
    if (this.isEditMode()) {
      const userId = this.selectedUser()?.id;
      if (!userId) return;

      this.userService.updateUser(userId, {
        ...form,
        role: role
      } as Partial<User>).subscribe({
        next: () => {
          this.toastService.success('User updated successfully');
          this.closeModal();
          this.loadUsers();
        },
        error: (error) => {
          this.errorMessage.set(error.message || 'Failed to update user');
        }
      });
    } else {
      this.userService.createUser({
        ...form,
        role: role
      } as Omit<User, 'id' | 'createdAt' | 'updatedAt'>).subscribe({
        next: () => {
          this.toastService.success('User created successfully');
          this.closeModal();
          this.loadUsers();
        },
        error: (error) => {
          this.errorMessage.set(error.message || 'Failed to create user');
        }
      });
    }
  }

  deleteUser(user: User): void {
    if (!confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
      return;
    }

    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.toastService.success('User deleted successfully');
        this.loadUsers();
      },
      error: (error) => {
        this.toastService.error(error.message || 'Failed to delete user');
      }
    });
  }

  hasPermission(permission: string): boolean {
    return this.authService.hasPermission(permission);
  }

  // Search functionality
  onSearchChange(query: string): void {
    this.searchQuery.set(query);
    this.currentPage.set(1); // Reset to first page on search
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.currentPage.set(1);
  }

  // Pagination methods
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
    }
  }

  changeItemsPerPage(items: number): void {
    this.itemsPerPage.set(items);
    this.currentPage.set(1); // Reset to first page
  }

  getPageNumbers(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];
    
    if (total <= 7) {
      // Show all pages if 7 or less
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (current > 3) {
        pages.push(-1); // Ellipsis
      }
      
      // Show pages around current
      for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
        pages.push(i);
      }
      
      if (current < total - 2) {
        pages.push(-1); // Ellipsis
      }
      
      // Always show last page
      pages.push(total);
    }
    
    return pages;
  }

}

