import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-projects-carousel',
  standalone: true,
  templateUrl: './projects-carousel.component.html',
  styleUrls: ['./projects-carousel.component.scss']
})
export class ProjectsCarouselComponent {
  @Input() projects: any[] = [];
  currentIndex = 0;

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.projects.length;
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.projects.length) % this.projects.length;
  }
}