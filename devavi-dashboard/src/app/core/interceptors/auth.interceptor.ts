import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError, finalize } from 'rxjs';
import { LoaderService } from '../services/loader.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);

  // Show loader for each request
  loaderService.show();

  // Get token from localStorage
  const authToken = localStorage.getItem('token');

  // Clone and attach token if available
  const authReq = authToken
    ? req.clone({
        setHeaders: { Authorization: `Bearer ${authToken}` },
      })
    : req;

  // Handle response + errors + hide loader
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        // Optional: Redirect user to login page here
      }
      return throwError(() => error);
    }),
    finalize(() => {
      // Always hide loader after request ends
      loaderService.hide();
    })
  );
};
