import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../../core/services/blog.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../../core/services/content.service';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';
import { trigger, transition, style, animate } from '@angular/animations';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Component({
  selector: 'app-view-blog',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './view-blog.component.html',
  styleUrls: ['./view-blog.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '300ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
  ],
})
export class ViewBlogComponent implements OnInit {
  blog: any;
  comments: any[] = [];
  url: string = 'http://localhost:8080/';
  newComment = '';
  canEdit = false;
  public destroy$ = new Subject<void>();
  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private router: Router,
    private contentService: ContentService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const blogId = this.route.snapshot.paramMap.get('id');
    this.contentService.currentDashboardSummary
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (data) {
          this.blog = data.blogs.find((b: any) => b._id === blogId);

          this.blog.content = this.sanitizer.bypassSecurityTrustHtml(
            this.blog.content
          );

          this.comments = this.blog?.comments || [];
          this.canEdit = true; //this.blog.author_id === 'currentUserId'; // your user id logic
        }
      });
  }

  likeBlog() {
    this.blogService.likeBlog(this.blog._id).subscribe((updated) => {
      this.blog.likes.count = updated.likes.count;
    });
  }

  copyLink() {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied!');
  }

  editBlog() {
    this.router.navigate(['/blogs/edit', this.blog._id]);
  }

  deleteBlog() {
    if (confirm('Are you sure you want to delete this blog?')) {
      this.blogService
        .deleteBlog(this.blog._id)
        .subscribe(() => this.router.navigate(['/dashboard']));
    }
  }

  addComment() {
    if (!this.newComment.trim()) return;
    this.blogService
      .addComment(this.blog._id, this.newComment)
      .subscribe((updated) => {
        this.blog.comments = [...updated.comments];
        this.newComment = '';
      });
  }
}
