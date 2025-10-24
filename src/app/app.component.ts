import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService, ToastService } from './services';
import { HasPermissionDirective } from './directives';
import { ToastComponent } from './components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, HasPermissionDirective, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'RBAC System';
  isAuthenticated = this.authService.isAuthenticated;
  currentUser = this.authService.currentUserSignal;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  logout(): void {
    this.toastService.info('You have been logged out successfully');
    this.authService.logout();
  }

  hasPermission(permission: string): boolean {
    return this.authService.hasPermission(permission);
  }
}
