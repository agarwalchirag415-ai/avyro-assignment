import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService, UserService, RoleService } from '../../services';
import { User, Role } from '../../models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  currentUser = this.authService.currentUserSignal;
  totalUsers = signal(0);
  totalRoles = signal(0);
  activeUsers = signal(0);
  recentUsers = signal<User[]>([]);

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.userService.getAllUsers().subscribe(users => {
      this.totalUsers.set(users.length);
      this.activeUsers.set(users.filter(u => u.isActive).length);
      this.recentUsers.set(users.slice(-5).reverse());
    });

    this.roleService.getAllRoles().subscribe(roles => {
      this.totalRoles.set(roles.length);
    });
  }

  hasPermission(permission: string): boolean {
    return this.authService.hasPermission(permission);
  }
}

