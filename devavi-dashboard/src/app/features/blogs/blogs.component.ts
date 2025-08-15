// File: blogs.component.ts
import {
  Component,
  OnInit,
  inject,
  computed,
  effect,
  signal,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';

import { Blog } from '../../shared/interfaces/blog.model';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { BlogService } from '../../core/services/blog.service';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from '../../core/services/auth.service';
@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatTableModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatChipsModule,
  ],
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss'],
})
export class BlogsComponent implements OnInit {
  private router = inject(Router);
  private dialog = inject(MatDialog);

  blogs: WritableSignal<Blog[]> = signal([]);
  search = signal('');
  statusFilter = signal('all');
  currentPage = signal(1);
  pageSize = 20;
  totalPages = signal(1);
  sortColumn = signal('');
  sortDirection = signal<'asc' | 'desc'>('asc');
  displayedColumns = [
    'title',
    'author',
    'readTime',
    'status',
    'published',
    'actions',
  ];
  currentUserId: string = '';
  userRole: string = '';
  constructor(
    private blogService: BlogService,
    private authService: AuthService
  ) {
    effect(() => {
      const filtered = this.getFilteredSortedBlogs();
      this.totalPages.set(Math.ceil(filtered.length / this.pageSize));
    });
  }

  ngOnInit(): void {
    this.loadBlogs();
    this.currentUserId = this.authService.getCurrentUserId();
    this.userRole = this.authService.getCurrentUser().role || 'user';
  }

  loadBlogs() {
    this.blogService.getAllBlogs().subscribe((blogs: any) => {
      this.blogs.set(blogs.data || []);
      this.currentPage.set(1); // Reset to first page
    });
  }

  getFilteredSortedBlogs(): Blog[] {
    let filtered = [...this.blogs()];
    const searchTerm = this.search().toLowerCase();

    if (this.statusFilter() !== 'all') {
      filtered = filtered.filter((b) => b.status === this.statusFilter());
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(searchTerm) ||
          b.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
      );
    }

    if (this.sortColumn()) {
      const column = this.sortColumn();
      filtered = filtered.sort((a, b) => {
        const aVal = (a as any)[column];
        const bVal = (b as any)[column];
        return this.sortDirection() === 'asc'
          ? aVal > bVal
            ? 1
            : -1
          : aVal < bVal
          ? 1
          : -1;
      });
    }

    return filtered;
  }

  readonly filteredBlogs = computed(() => {
    const filtered = this.getFilteredSortedBlogs();
    const start = (this.currentPage() - 1) * this.pageSize;
    return filtered.slice(start, start + this.pageSize);
  });

  deleteBlog(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Delete Blog',
        message: 'Are you sure you want to delete this blog?',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.blogService.deleteBlog(id).subscribe(() => {
          this.loadBlogs();
        });
      }
    });
  }

  exportCSV() {
    const csvRows = [
      ['Title', 'ReadTime', 'Author', 'Status', 'Published At'],
      ...this.blogs().map((b) => [
        b.title,
        b.readTime,
        b.author_id,
        b.status,
        b.published_at,
      ]),
    ];
    const blob = new Blob([csvRows.map((e) => e.join(',')).join('\n')], {
      type: 'text/csv;charset=utf-8;',
    });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'blogs.csv';
    a.click();
  }

  changePage(offset: number) {
    const newPage = this.currentPage() + offset;
    if (newPage >= 1 && newPage <= this.totalPages()) {
      this.currentPage.set(newPage);
    }
  }

  sort(column: string) {
    if (this.sortColumn() === column) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
  }

  trackById(index: number, blog: Blog) {
    return blog._id;
  }
}
