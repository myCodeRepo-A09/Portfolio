import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';
@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class SignupComponent {
  hide = true;
  hideConfirm = true;
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  onSignup() {
    if (this.signupForm.valid) {
      const { name, email, password, confirmPassword } = this.signupForm.value;
      if (password !== confirmPassword) {
        this.signupForm.get('confirmPassword')?.setErrors({ mismatch: true });
        return;
      }
      // TODO: connect with backend
      console.log('Sign up:', this.signupForm.value);
      this.authService.signup(name, email, password).subscribe({
        next: (response) => {
          console.log('Signup successful', response);
          // Handle successful signup, e.g., store token, redirect
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Signup failed', error);
          // Handle signup error, e.g., show error message
        },
      });
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
