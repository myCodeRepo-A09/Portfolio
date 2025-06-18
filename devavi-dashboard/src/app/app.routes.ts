import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { AboutComponent } from './features/about/about.component';
import { BlogsComponent } from './features/blogs/blogs.component';
import { ProjectsComponent } from './features/projects/projects.component';
import { NewsComponent } from './features/news/news.component';
import { LearnWithMeComponent } from './features/learn-with-me/learn-with-me.component';

export const routes: Routes = [

    {
    path: '',
    loadComponent:()=>import('../app/features/home/home.component').then(m=>m.HomeComponent)
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'about',
    component:AboutComponent
  },
  {
    path: 'blogs',
    component: BlogsComponent
  },
  {
    path: 'projects',
    component: ProjectsComponent
  },
  {
    path: 'news',
    component:NewsComponent,
  },
  {
    path: 'learn',
    component: LearnWithMeComponent,
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch:'full'
  },
];
