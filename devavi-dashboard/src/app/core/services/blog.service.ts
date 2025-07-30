import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private baseUrl = 'http://localhost:8080/blogs'; // Adjust to your backend URL

  constructor(private http: HttpClient) {}

  /** Get blog by ID */
  getBlogById(id: string | null): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  /** Get all blogs */
  getAllBlogs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  /** Create new blog */
  createBlog(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  /** Update existing blog */
  updateBlog(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  /** Delete a blog */
  deleteBlog(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  /** Like a blog */
  likeBlog(id: string, user: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/like`, { user });
  }

  /** Add a comment */
  addComment(id: string, user: string, comment: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/comment`, { user, comment });
  }
}
