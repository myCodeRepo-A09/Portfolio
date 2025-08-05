import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { BlogsComponent } from './features/blogs/blogs.component';
import { ProjectsComponent } from './features/projects/projects.component';
import { NewsComponent } from './features/news/news.component';
import { LearnWithMeComponent } from './features/learn-with-me/learn-with-me.component';
import { ViewBlogComponent } from './features/blogs/view-blog/view-blog.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { AboutMeComponent } from './features/about-me/about-me.component';
import { BlogResolver } from './core/guards/blog.resolver';

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
    component: HomeComponent,
  },
  {
    path: 'about',
    component: AboutMeComponent,
  },
  { path: 'blogs/:id', component: ViewBlogComponent },
  { path: 'blogs', component: BlogsComponent },
  {
    path: 'projects',
    component: ProjectsComponent,
  },
  {
    path: 'news',
    component: NewsComponent,
  },
  {
    path: 'learn',
    component: LearnWithMeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'blogs/create',
    loadComponent: () =>
      import('./features/blogs/create-blog/create-blog.component').then(
        (m) => m.CreateBlogComponent
      ),
  },

  {
    path: 'blogs/edit/:id',
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
