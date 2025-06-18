// content.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  constructor(private http: HttpClient) {}

  getBlogs(limit = 2): Observable<any[]> {
    // return this.http.get<any[]>('/api/blogs', {
    //   params: { limit }
    // });
    return of([{
         id: '1',
  title: 'First Blog',
  excerpt: 'test',
  content: 'Hi this is test blog1',
  image: 'asset',
  date: new Date(),
  tags: ['tech','rnd'],
  readTime: '15',
    },
{
         id: '2',
  title: 'Second Blog',
  excerpt: 'test',
  content: 'Hi this is test blog2',
  image: 'asset',
  date: new Date(),
  tags: ['tech','rnd'],
  readTime: '15',
    },
{
         id: '3',
  title: 'Second Blog',
  excerpt: 'test',
  content: 'Hi this is test blog2',
  image: 'asset',
  date: new Date(),
  tags: ['tech','rnd'],
  readTime: '15',
    }])
  }

  // Similar methods for news, projects, etc.
}