// home.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { TypewriterDirective } from '../../core/directives/typewriter.directive';
import { SkillsChartComponent } from '../../shared/components/skills-chart/skills-chart.component';
import { DashboardSummary } from '../../shared/interfaces/dashboard.summary.model';
import { ContentService } from '../../core/services/content.service';
import { Subject, takeUntil } from 'rxjs';

import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../core/environments/environment';
//import { ProjectsCarouselComponent } from '../../shared/components/projects-carousel/projects-carousel.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    TypewriterDirective,
    SkillsChartComponent,
    RouterModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],

  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '0.5s cubic-bezier(0.35, 0, 0.25, 1)',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
  ],
})
export class HomeComponent implements OnInit {
  //env
  learnWithMeSection: boolean = environment.learnWithMeSection;

  isUserLoggedIn: boolean = false;
  summary: DashboardSummary = {
    blogs: [],
    projects: [],
    news: [],
    learn: [],
  };

  url: string = 'http://13.223.184.233/';
  private destroy$ = new Subject<void>();
  constructor(
    private router: Router,
    private contentService: ContentService,
    private sanitizer: DomSanitizer,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.contentService
      .getDashboardSummary()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.summary = res;
          // Sanitize blogs
          this.summary.blogs.forEach((blog: any) => {
            blog.content = this.sanitizer.bypassSecurityTrustHtml(blog.content);
          });
          console.log('this.summary', this.summary);
        },
        error: (err: any) => {
          console.error('Error fetching dashboard summary:', err);
        },
      });

    this.authService.userLoggedIn$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoggedIn) => {
        this.isUserLoggedIn = isLoggedIn;
      });
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
function next(value: any[]): void {
  throw new Error('Function not implemented.');
}
