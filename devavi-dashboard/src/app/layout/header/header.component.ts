import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../core/services/search.service';
import { SearchComponent } from '../search/search.component';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SearchComponent,ThemeToggleComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;
  isScrolled = false;
  searchQuery = '';
  menuItems = [
    { path: '/about', label: 'About DevAvi' },
    { path: '/blogs', label: 'Blogs' },
    { path: '/news', label: 'News' },
    { path: '/projects', label: 'Projects' },
    { path: '/learn', label: 'Learn With Me' },
    { path: '/profile', label: 'Sign In' }
  ];

  constructor(private searchService: SearchService) {}

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  ngOnInit() {
    this.searchService.currentSearch.subscribe(query => {
      this.searchQuery = query;
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
  }

  performSearch() {
    this.searchService.changeSearch(this.searchQuery);
  }

  closeMenu() {
    this.isMenuOpen = false;
    document.body.style.overflow = '';
  }
}