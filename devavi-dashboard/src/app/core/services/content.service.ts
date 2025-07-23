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

  // Similar methods for news, projects, etc.
}
