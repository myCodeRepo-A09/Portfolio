import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginResponse } from '../../shared/interfaces/login.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url: string = environment.url; // Adjust the URL as needed
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  userLoggedIn$ = this.loggedInSubject.asObservable();
  constructor(private http: HttpClient) {
    const token = localStorage.getItem('accessToken');
    this.loggedInSubject.next(!!token);
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.url}/api/auth/login`, {
      email,
      password,
    });
  }

  signup(name: string, email: string, password: string) {
    return this.http.post(`${this.url}/api/auth/register`, {
      name,
      email,
      password,
    });
  }

  forgotPassword(email: string) {
    return this.http.post(`${this.url}/api/auth/forgot-password`, { email });
  }
  resetPassword(email: string, otp: string, newPassword: string) {
    return this.http.post(`${this.url}/api/auth/reset-password`, {
      email,
      otp,
      newPassword,
    });
  }
  isAuthenticated(): boolean {
    // Implement your logic to check if the user is authenticated
    return !!localStorage.getItem('accessToken');
  }

  setLoggedIn(value: boolean) {
    this.loggedInSubject.next(value);
  }
  logout() {
    // Implement your logout logic
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
  getCurrentUser() {
    // Implement your logic to get the current user
    return JSON.parse(localStorage.getItem('user') || '{}');
  }
  getCurrentUserId(): string {
    const user = this.getCurrentUser();
    return user ? user.userId || user.id || '' : '';
  }
  setCurrentUser(user: any) {
    // Implement your logic to set the current user
    localStorage.setItem('user', JSON.stringify(user));
  }
  updateUser(user: any) {
    // Implement your logic to update the user
    return this.http.put('/api/user', user);
  }
  changePassword(oldPassword: string, newPassword: string) {
    return this.http.post(`${this.url}` + '/api/change-password', {
      oldPassword,
      newPassword,
    });
  }
  getUserProfile() {
    return this.http.get(`${this.url}` + '/api/user/profile');
  }
  updateUserProfile(profile: any) {
    return this.http.put(`${this.url}` + '/api/user/profile', profile);
  }
  verifyEmail(token: string) {
    return this.http.get(`/api/verify-email?token=${token}`);
  }
  resendVerificationEmail(email: string) {
    return this.http.post(`${this.url}` + '/api/resend-verification-email', {
      email,
    });
  }
  requestPasswordReset(email: string) {
    return this.http.post(`${this.url}` + '/api/request-password-reset', {
      email,
    });
  }
  verifyPasswordResetToken(token: string) {
    return this.http.get(`/api/verify-password-reset-token?token=${token}`);
  }
  resetPasswordWithToken(token: string, newPassword: string) {
    return this.http.post(`${this.url}` + '/api/reset-password-with-token', {
      token,
      newPassword,
    });
  }
  getUserPermissions() {
    return this.http.get(`${this.url}` + '/api/user/permissions');
  }
  hasPermission(permission: string): boolean {
    const permissions = this.getCurrentUser().permissions || [];
    return permissions.includes(permission);
  }
  getUserRoles() {
    return this.http.get(`${this.url}` + '/api/user/roles');
  }
  hasRole(role: string): boolean {
    const roles = this.getCurrentUser().roles || [];
    return roles.includes(role);
  }
  getUserSettings() {
    return this.http.get(`${this.url}` + '/api/user/settings');
  }
  updateUserSettings(settings: any) {
    return this.http.put(`${this.url}` + '/api/user/settings', settings);
  }
}
