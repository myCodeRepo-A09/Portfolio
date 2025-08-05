// blog.resolver.ts
import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { BlogService } from '../../core/services/blog.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class BlogResolver implements Resolve<any> {
  constructor(private blogService: BlogService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    const blogId = route.paramMap.get('id');
    if (!blogId) return of(null);
    return this.blogService.getBlogById(blogId).pipe(
      map((res) => res.data),
      catchError(() => of(null))
    );
  }
}
