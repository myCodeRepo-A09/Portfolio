import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { trigger, style, animate, transition } from '@angular/animations';
import { ContentService } from '../../core/services/content.service';
@Component({
  selector: 'app-about-me',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.scss'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(40px)' }),
        animate(
          '800ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
  ],
})
export class AboutMeComponent implements OnInit {
  profile: any;

  constructor(
    private http: HttpClient,
    private contentService: ContentService
  ) {}

  ngOnInit(): void {
    this.contentService.getAboutMeInfo().subscribe((data) => {
      this.profile = data;
    });
  }
}
