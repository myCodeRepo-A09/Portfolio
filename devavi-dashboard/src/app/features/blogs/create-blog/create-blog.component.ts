import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill';
import { BlogService } from '../../../core/services/blog.service';
import { ContentService } from '../../../core/services/content.service';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { Blog } from '../../../shared/interfaces/blog.model';
import { AuthService } from '../../../core/services/auth.service';
@Component({
  selector: 'app-create-blog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, QuillModule],
  templateUrl: './create-blog.component.html',
  styleUrls: ['./create-blog.component.scss'],
})
export class CreateBlogComponent implements OnInit {
  blogForm: FormGroup;
  blogToEdit: Blog | null = null;
  isEditMode = false;
  selectedFiles: File[] = [];
  selectedThumbnail: any = [];
  userName: string = '';
  userRole: string = '';
  existingAttachments: any[] = [];
  allAttachments: any[] = [];
  attachmentsToRemove: any[] = [];
  existingThumbnail: any[] = [];
  newAttachments: File[] = [];
  modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService,
    private contentService: ContentService,
    private snackbarService: SnackbarService,
    private authService: AuthService
  ) {
    this.blogForm = this.fb.group({
      title: [''],
      excerpt: [''],
      slug: [''],
      tags: [''],
      readTime: [''],
      content: [''],
      status: ['draft'],
      author_id: [''],
      attachments: [''],
      images: [''],
    });
  }

  ngOnInit(): void {
    const userStr = localStorage.getItem('user');
    this.userRole = this.authService.getCurrentUser().role || 'user';
    this.userName = userStr ? JSON.parse(userStr).name : '';
    this.blogForm.patchValue({ author_id: this.userName });

    this.blogToEdit = this.route.snapshot.data['blog'];
    if (this.blogToEdit) {
      this.isEditMode = true;
      this.blogForm.patchValue(this.blogToEdit);
      this.existingAttachments = this.blogToEdit.attachments || [];
      this.allAttachments = [...this.existingAttachments];
      this.existingThumbnail = this.blogToEdit.images || [];
    }
  }

  onFileSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files);
    this.allAttachments = [...this.selectedFiles, ...this.existingAttachments];
  }

  onThumbnailSelected(event: any) {
    this.selectedThumbnail = event.target.files
      ? Array.from(event.target.files)
      : [];

    this.existingThumbnail = [...this.selectedThumbnail];
  }
  removeExistingFile(file: any) {
    this.existingAttachments = this.existingAttachments.filter(
      (f) => f.url !== file.url
    );
    this.attachmentsToRemove.push(file);
  }
  removeExistingThumbnail(file: any) {
    this.selectedThumbnail = this.selectedThumbnail.filter(
      (f: any) => f !== file
    );
  }
  removeSelectedFiles(file: any) {
    this.selectedFiles = this.selectedFiles.filter((f: any) => f !== file);
  }

  async uploadFiles(files: File[]): Promise<any[]> {
    return new Promise((resolve) => {
      if (!files.length) return resolve([]);
      this.contentService.uploadFiles(files).subscribe({
        next: (res) => resolve(res.files || []),
        error: () => resolve([]),
      });
    });
  }

  async deleteFiles(files: string[]): Promise<any[]> {
    return new Promise((resolve) => {
      if (!files.length) return resolve([]);
      this.contentService.deleteFiles(files).subscribe({
        next: (res) => resolve(res.files || []),
        error: () => resolve([]),
      });
    });
  }

  async submitBlog() {
    const blogData = this.blogForm.value;
    blogData.author_id = this.userName;

    // Upload files
    if (this.selectedFiles.length) {
      blogData.attachments = await this.uploadFiles(this.selectedFiles);
    }

    if (this.selectedThumbnail.length) {
      const thumbnail = await this.uploadFiles(this.selectedThumbnail);
      blogData.images = [thumbnail[0]?.url];
    }

    // Save or Update
    if (this.isEditMode && this.blogToEdit?._id) {
      blogData.attachments = [
        ...this.existingAttachments,
        ...blogData.attachments,
      ];

      console.log(blogData.attachments);
      this.blogService.updateBlog(this.blogToEdit._id, blogData).subscribe({
        next: () => {
          this.snackbarService.success('Blog updated successfully');
          this.router.navigate(['/blogs', this.blogToEdit?._id]);
        },
        error: () => this.snackbarService.error('Update failed'),
      });
    } else {
      this.blogService.createBlog(blogData).subscribe({
        next: (res) => this.router.navigate(['/blogs', res.data._id]),
        error: () => {
          const attachments = [
            ...this.selectedFiles.map((file) => file.name || ''),
            //...this.selectedThumbnail.map(thumb => thumb.name ||'')
          ];

          this.deleteFiles(attachments);
          this.snackbarService.error('Update failed');
        },
      });
    }
  }
}
