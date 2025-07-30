import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Get token from localStorage
  const authToken = localStorage.getItem('token');

  // Clone and attach token if available
  const authReq = authToken
    ? req.clone({
        setHeaders: { Authorization: `Bearer ${authToken}` },
      })
    : req;

  // Handle errors globally
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        // You may need to inject Router and navigate here if required
      }
      return throwError(() => error);
    })
  );
};
