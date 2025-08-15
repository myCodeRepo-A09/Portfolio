import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private url: string = environment.url;

  constructor(private http: HttpClient) {}

  /** Get blog by ID */
  getBlogById(id: string | null): Observable<any> {
    return this.http.get(`${this.url}` + `/blogs/getBlogById/${id}`);
  }

  /** Get all blogs */
  getAllBlogs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}` + `/blogs/getAllBlogs`);
  }

  /** Create new blog */
  createBlog(blogData: any): Observable<any> {
    return this.http.post(`${this.url}` + '/createBlog', blogData).pipe(
      catchError((err) => {
        console.error('Error creating blog:', err);
        return of(null); // Return null or handle error as needed
      })
    );
  }

  /** Update existing blog */
  updateBlog(id: string, data: any): Observable<any> {
    return this.http.post(`${this.url}` + `/blogs/updateBlog/${id}`, data);
  }

  /** Delete a blog */
  deleteBlog(id: string): Observable<any> {
    return this.http.delete(`${this.url}` + `/blogs/deleteBlog/${id}`);
  }

  /** Like a blog */
  likeBlog(id: string, user: string): Observable<any> {
    return this.http.post(`${this.url}` + `/blogs/${id}/like`, { user });
  }

  /** Add a comment */
  addComment(id: string, user: string, comment: string): Observable<any> {
    return this.http.post(`${this.url}` + `/blogs/${id}/comment`, {
      user,
      comment,
    });
  }
}
