import { Component, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  isOtpSent = signal(false);
  showPassword = signal(false);
  showConfirmPassword = signal(false);
  isLoading = signal(false);

  forgotForm: ReturnType<FormBuilder['group']>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: [''],
      newPassword: [''],
      confirmPassword: [''],
    });
  }

  sendOtp() {
    if (this.forgotForm.controls['email'].invalid) {
      this.forgotForm.controls['email'].markAsTouched();
      return;
    }

    this.isLoading.set(true);

    // Simulate API call
    setTimeout(() => {
      this.isOtpSent.set(true);
      this.isLoading.set(false);

      // Add validators after OTP is sent
      this.forgotForm.controls['otp'].setValidators([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
      ]);
      this.forgotForm.controls['newPassword'].setValidators([
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        ),
      ]);
      this.forgotForm.controls['confirmPassword'].setValidators([
        Validators.required,
      ]);

      this.forgotForm.updateValueAndValidity();

      this.snackBar.open('OTP sent to your email', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar'],
      });
    }, 1500);
  }

  resetPassword() {
    if (this.forgotForm.invalid || !this.passwordsMatch) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    // Simulate API call
    setTimeout(() => {
      this.isLoading.set(false);
      this.snackBar.open('Password reset successfully', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar'],
      });
      this.router.navigate(['/login']);
    }, 1500);
  }

  get passwordsMatch(): boolean {
    return (
      this.forgotForm.get('newPassword')?.value ===
      this.forgotForm.get('confirmPassword')?.value
    );
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
