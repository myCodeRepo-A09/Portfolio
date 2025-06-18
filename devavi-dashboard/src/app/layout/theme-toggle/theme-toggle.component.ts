// theme-toggle.component.ts
import { Component, inject } from '@angular/core';
import { ThemeService } from '../../core/services/theme.service';
import { gsap } from 'gsap';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss']
})
export class ThemeToggleComponent {
  themeService=inject(ThemeService)
  isOpen = false;
constructor(
  private sanitizer: DomSanitizer,
  //private themeService: ThemeService
) {}
  // Theme icons mapping
  getThemeIcon(): string {
    const icons: Record<string, string> = {
      'light': '☀️',
      'dark': '🌙',
      'professional': '💼',
      'creative': '🎨',
      'terminal': '💻'
    };
    return icons[this.themeService.currentTheme()] || '🎨';
  }

  // Alternative using switch case (more readable for complex icons)
  getThemeIconAlt(): string {
    switch(this.themeService.currentTheme()) {
      case 'light': return '☀️';
      case 'dark': return '🌙';
      case 'professional': return '💼';
      case 'creative': return '🎨';
      case 'terminal': return '💻';
      default: return '🎨';
    }
  }

  // For SVG icons instead of emojis
  getThemeSvgIcon(): string {
    const svgIcons: Record<string, string> = {
      'light': 'assets/icons/sun.svg',
      'dark': 'assets/icons/moon.svg',
      'professional': 'assets/icons/briefcase.svg',
      'creative': 'assets/icons/palette.svg',
      'terminal': 'assets/icons/terminal.svg'
    };
    return svgIcons[this.themeService.currentTheme()];
  }

  toggleTheme() {
    this.themeService.cycleTheme();
    this.animateToggle();
  }

  setTheme(theme: string) {
    this.themeService.setTheme(theme as any);
    this.isOpen = false;
    this.animateDropdown();
  }

  private animateToggle() {
    gsap.from('.theme-icon', {
      duration: 0.3,
      y: -10,
      opacity: 0,
      stagger: 0.05,
      ease: 'back.out(1.7)'
    });
  }

  private animateDropdown() {
    if (this.isOpen) {
      gsap.to('.theme-dropdown', {
        duration: 0.3,
        height: 'auto',
        opacity: 1,
        ease: 'power2.out'
      });
    } else {
      gsap.to('.theme-dropdown', {
        duration: 0.2,
        height: 0,
        opacity: 0,
        ease: 'power2.in'
      });
    }
  }

  getThemeSvg(): SafeHtml {
  const svgs: Record<string, string> = {
    'light': `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,15.31L23.31,12L20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31Z"/></svg>`,
    'dark': `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12,18C11.11,18 10.26,17.8 9.5,17.45C11.56,16.5 13,14.42 13,12C13,9.58 11.56,7.5 9.5,6.55C10.26,6.2 11.11,6 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31L23.31,12L20,8.69Z"/></svg>`,
    'professional': `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M10,2H14A2,2 0 0,1 16,4V6H20A2,2 0 0,1 22,8V19A2,2 0 0,1 20,21H4C2.89,21 2,20.1 2,19V8C2,6.89 2.89,6 4,6H8V4C8,2.89 8.89,2 10,2M14,6V4H10V6H14Z"/></svg>`,
    'creative': `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M20.71,4.63L19.37,3.29C19,2.9 18.35,2.9 17.96,3.29L9,12.25L11.75,15L20.71,6.04C21.1,5.65 21.1,5 20.71,4.63M7,14A3,3 0 0,0 4,17C4,18.31 2.84,19 2,19C2.92,20.22 4.5,21 6,21A4,4 0 0,0 10,17A3,3 0 0,0 7,14Z"/></svg>`,
    'terminal': `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M20,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6A2,2 0 0,0 20,4M20,18H4V8H20V18M20,12H16V10H20V12M13,12L9,16V8L13,12Z"/></svg>`
  };
  
  return this.sanitizer.bypassSecurityTrustHtml(
    svgs[this.themeService.currentTheme()] || svgs['creative']
  );
}
}