export interface Blog {
  _id: string;
  title: string;
  readTime: string;
  images: string[];
  videoPaths: string[];
  content: string;
  excerpt: string;
  slug: string;
  tags: string[];
  status: string;
  published_at: string;
  updatedAt: string;
  comments: string[];
  likes: { user: string[]; count: number };
  views: number;
  attachments: string[];
  author_id: string;
  __v: string;
}
