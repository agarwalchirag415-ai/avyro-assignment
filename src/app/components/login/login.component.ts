import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, ToastService } from '../../services';
import { LoginCredentials } from '../../models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  credentials: LoginCredentials = {
    username: '',
    password: ''
  };
  
  isLoading = signal(false);
  errorMessage = signal('');
  returnUrl: string = '/dashboard';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  onSubmit(): void {
    if (!this.credentials.username || !this.credentials.password) {
      this.errorMessage.set('Please enter username and password');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.toastService.success('Welcome back! Login successful.');
        this.router.navigate([this.returnUrl]);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.message || 'Login failed. Please try again.');
        this.toastService.error(error.message || 'Invalid credentials. Please try again.');
      }
    });
  }
}

