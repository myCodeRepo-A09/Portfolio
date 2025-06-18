// src/app/models/blog.model.ts
export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: Date;
  tags: string[];
  readTime: number;
}