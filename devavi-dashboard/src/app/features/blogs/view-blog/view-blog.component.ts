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
import { AuthService } from '../../../core/services/auth.service';
import { SnackbarService } from '../../../core/services/snackbar.service';

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
  isLoggedIn = false;
  userName: string = '';
  public destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private router: Router,
    private contentService: ContentService,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    const blogId = this.route.snapshot.paramMap.get('id');
    this.userName = this.authService.getCurrentUser().name;
    this.contentService.getBlogById(blogId as string).subscribe((blog) => {
      if (blog && blog.data) {
        this.blog = blog.data;
        this.comments = blog.data.comments || [];
        this.blog.content = this.sanitizer.bypassSecurityTrustHtml(
          blog.data.content
        );
        this.canEdit =
          this.authService.getCurrentUser().email === blog.data.author;
      } else {
        console.error('Blog not found');
        this.router.navigate(['/dashboardSummary']);
      }
    });

    this.authService.userLoggedIn$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoggedIn: boolean) => {
        this.isLoggedIn = isLoggedIn;
      });
  }

  likeBlog() {
    if (!this.isLoggedIn) {
      this.snackbar.warn('You must be logged in to like a blog.');
      return;
    }
    if (this.blog.likes.user.includes(this.userName)) {
      this.snackbar.warn('You have already liked this blog.');
      return;
    }
    this.blogService
      .likeBlog(this.blog._id, this.userName)
      .subscribe((updated) => {
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

    let userName = this.authService.getCurrentUser().name || 'Anonymous';

    this.blogService
      .addComment(this.blog._id, userName, this.newComment)
      .subscribe((updated) => {
        this.blog.comments = updated.comments;
        this.comments = this.blog.comments;
        this.newComment = '';
      });
  }
}
