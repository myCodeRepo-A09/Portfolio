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
import { FloatingChatComponent } from '../../shared/components/floating-chat/floating-chat.component';
import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
//import { ProjectsCarouselComponent } from '../../shared/components/projects-carousel/projects-carousel.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    TypewriterDirective,
    SkillsChartComponent,
    FloatingChatComponent,
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
  // Sample data - in real app this would come from a service
  //  image= 'assets/images/blog-node.jpg';
  // blogs = [
  //   {
  //     id: '1',
  //     title: 'Angular 16 New Features',
  //     excerpt: 'Explore the latest features in Angular 16 including signals and hydration improvements',
  //     image: 'assets/images/blog-angular.jpg',
  //     readTime: 5,
  //     tags: ['Angular', 'Frontend']
  //   },
  //   {
  //     id: '2',
  //     title: 'Building Microservices with Node.js',
  //     excerpt: 'Learn how to architect scalable microservices using Node.js and Docker',
  //     image: 'assets/images/blog-node.jpg',
  //     readTime: 8,
  //     tags: ['Node.js', 'Backend']
  //   }
  // ];

  // news = [
  //   {
  //     id: '1',
  //     title: 'Google Announces AI Breakthrough',
  //     excerpt: 'New AI model achieves human-level performance on complex tasks',
  //     date: new Date('2023-06-15'),
  //     source: 'TechCrunch',
  //     sourceUrl: '#'
  //   },
  //   {
  //     id: '2',
  //     title: 'WebAssembly 2.0 Draft Released',
  //     excerpt: 'Next generation of WebAssembly promises major performance improvements',
  //     date: new Date('2023-06-10'),
  //     source: 'W3C',
  //     sourceUrl: '#'
  //   }
  // ];

  // projects = [
  //   {
  //     id: '1',
  //     name: 'E-Commerce Platform',
  //     description: 'Full-featured e-commerce solution with payment integration and inventory management',
  //     technologies: ['Angular', 'Node.js', 'MongoDB'],
  //     logo: 'assets/images/project-ecommerce.png',
  //     demoUrl: '#',
  //     codeUrl: '#'
  //   },
  //   {
  //     id: '2',
  //     name: 'AI Content Generator',
  //     description: 'AI-powered tool for generating marketing content and blog posts',
  //     technologies: ['React', 'Python', 'TensorFlow'],
  //     logo: 'assets/images/project-ai.png',
  //     demoUrl: '#',
  //     codeUrl: '#'
  //   },
  //    {
  //     id: '3',
  //     name: 'AI Content Generator',
  //     description: 'AI-powered tool for generating marketing content and blog posts',
  //     technologies: ['React', 'Python', 'TensorFlow'],
  //     logo: 'assets/images/project-ai.png',
  //     demoUrl: '#',
  //     codeUrl: '#'
  //   }
  // ];
  summary: DashboardSummary = {
    blogs: [],
    projects: [],
    news: [],
    learn: [],
  };

  url: string = 'http://localhost:8080/';
  private destroy$ = new Subject<void>();
  constructor(
    private router: Router,
    private contentService: ContentService,
    private sanitizer: DomSanitizer
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
