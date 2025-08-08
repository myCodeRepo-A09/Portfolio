import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../core/services/search.service';
import { SearchComponent } from '../search/search.component';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { AuthService } from '../../core/services/auth.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SearchComponent,
    ThemeToggleComponent,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isUserLoggedIn: boolean = false;
  dropdownOpen = false;
  isMenuOpen = false;
  isScrolled = false;
  searchQuery = '';
  menuItems = [
    { path: '/about', label: 'About DevAvi' },
    { path: '/blogs', label: 'Blogs' },
    { path: '/news', label: 'News' },
    { path: '/projects', label: 'Projects' },
    { path: '/learn', label: 'Learn With Me' },
    { path: '/login', label: 'Sign In' },
  ];

  constructor(
    private searchService: SearchService,
    private authService: AuthService
  ) {}

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  ngOnInit() {
    this.searchService.currentSearch.subscribe((query) => {
      this.searchQuery = query;
    });

    this.authService.userLoggedIn$.subscribe((isLoggedIn) => {
      this.isUserLoggedIn = isLoggedIn;
    });
  }
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
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
  logout() {
    this.dropdownOpen = false;
    this.authService.logout();
    this.authService.setLoggedIn(false);
    this.isUserLoggedIn = false;
    this.closeMenu();
    // Optionally redirect to home or login page
    // this.router.navigate(['/']);
  }
}
