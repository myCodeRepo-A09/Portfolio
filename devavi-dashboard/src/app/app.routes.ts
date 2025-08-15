import { Routes } from '@angular/router';

import { BlogResolver } from './core/guards/blog.resolver';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../app/features/home/home.component').then(
        (m) => m.HomeComponent
      ),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('../app/features/home/home.component').then(
        (m) => m.HomeComponent
      ),
  },
  {
    path: 'about',
    loadComponent: () =>
      import('../app/features/about-me/about-me.component').then(
        (m) => m.AboutMeComponent
      ),
  },

  {
    path: 'viewBlog/:id',
    loadComponent: () =>
      import('../app/features/blogs/view-blog/view-blog.component').then(
        (m) => m.ViewBlogComponent
      ),
  },
  {
    path: 'blogs',
    loadComponent: () =>
      import('../app/features/blogs/blogs.component').then(
        (m) => m.BlogsComponent
      ),
  },
  {
    path: 'projects',
    loadComponent: () =>
      import('../app/features/projects/projects.component').then(
        (m) => m.ProjectsComponent
      ),
  },
  {
    path: 'news',
    loadComponent: () =>
      import('../app/features/news/news.component').then(
        (m) => m.NewsComponent
      ),
  },
  {
    path: 'learn',
    loadComponent: () =>
      import('../app/features/learn-with-me/learn-with-me.component').then(
        (m) => m.LearnWithMeComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('../app/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('../app/auth/signup/signup.component').then(
        (m) => m.SignupComponent
      ),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('../app/auth/forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent
      ),
  },
  {
    path: 'createBlog',
    loadComponent: () =>
      import('./features/blogs/create-blog/create-blog.component').then(
        (m) => m.CreateBlogComponent
      ),
    canActivate: [AuthGuard],
  },

  {
    path: 'editBlog/:id',
    loadComponent: () =>
      import('./features/blogs/create-blog/create-blog.component').then(
        (m) => m.CreateBlogComponent
      ),
    resolve: { blog: BlogResolver },
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
