// content.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { DashboardSummary } from '../../shared/interfaces/dashboard.summary.model';
@Injectable({
  providedIn: 'root',
})
export class ContentService {
  private dashboardSummary = new BehaviorSubject<DashboardSummary | null>(null);
  currentDashboardSummary = this.dashboardSummary.asObservable();
  constructor(private http: HttpClient) {}
  private url = 'http://localhost:8080/dashboard/getDashboardSummary';
  getDashboardSummary() {
    return this.http.get<DashboardSummary>(this.url).pipe(
      tap((data) => this.dashboardSummary.next(data)),
      catchError((err) => {
        console.error('Error fetching dashboard summary:', err);
        this.dashboardSummary.next(null);
        return of(null); // Ensure observable completes even on error
      })
    );
  }

  getBlogById(id: string): Observable<any> {
    return this.http.get(`http://localhost:8080/blogs/getBlogById/${id}`).pipe(
      catchError((err) => {
        console.error('Error fetching blog by ID:', err);
        return of(null); // Return null or handle error as needed
      })
    );
  }

  getAboutMeInfo(): Observable<any> {
    return this.http.get('http://localhost:8080/dashboard/about-me').pipe(
      catchError((err) => {
        console.error('Error fetching about me info:', err);
        return of(null); // Return null or handle error as needed
      })
    );
  }

  createBlog(blogData: any): Observable<any> {
    return this.http
      .post('http://localhost:8080/blogs/createBlog', blogData)
      .pipe(
        catchError((err) => {
          console.error('Error creating blog:', err);
          return of(null); // Return null or handle error as needed
        })
      );
  }

  uploadFiles(files: File[]): Observable<any> {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    return this.http
      .post('http://localhost:8080/dashboard/uploadFiles', formData)
      .pipe(
        catchError((err) => {
          console.error('Error uploading files:', err);
          return of(null); // Return null or handle error as needed
        })
      );
  }

  // Similar methods for news, projects, etc.
}
