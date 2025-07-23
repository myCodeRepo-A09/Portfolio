import { Blog } from './blog.model';
import { Learn } from './learn.model';
import { News } from './news.model';
import { Project } from './project.model';
export interface DashboardSummary {
  blogs: Blog[];
  projects: Project[];
  news: News[];
  learn: Learn[];
}
