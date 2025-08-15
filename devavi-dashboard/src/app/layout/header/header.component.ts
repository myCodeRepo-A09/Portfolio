import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { SearchService } from '../../core/services/search.service';
import { AuthService } from '../../core/services/auth.service';
import { SearchComponent } from '../search/search.component';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

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
export class HeaderComponent implements OnInit, OnDestroy {
  isUserLoggedIn = false;
  dropdownOpen = false;
  isMenuOpen = false;
  isScrolled = false;
  searchQuery = '';

  private subs: Subscription[] = [];

  // <-- typed menuItems with optional `exact` property
  menuItems: { path: string; label: string; exact?: boolean }[] = [
    { path: '/', label: 'Dashboard', exact: true }, // root route needs exact
    { path: '/about', label: 'About DevAvi' },
    { path: '/blogs', label: 'Blogs' },
    { path: 'createBlog', label: 'Create Blog' },
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
    this.subs.push(
      this.searchService.currentSearch.subscribe((q) => {
        this.searchQuery = q || '';
      })
    );

    this.subs.push(
      this.authService.userLoggedIn$.subscribe((loggedIn) => {
        this.isUserLoggedIn = !!loggedIn;
      })
    );
  }

  performSearch() {
    this.searchService.changeSearch(this.searchQuery);
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
  }

  closeMenu() {
    this.isMenuOpen = false;
    document.body.style.overflow = '';
  }

  logout() {
    this.dropdownOpen = false;
    this.authService.logout();
    this.isUserLoggedIn = false;
    this.closeMenu();
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
    document.body.style.overflow = '';
  }
}
