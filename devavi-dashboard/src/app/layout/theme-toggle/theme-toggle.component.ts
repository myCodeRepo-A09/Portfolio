import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-theme-toggle',
  standalone:true,
  imports:[MatIconModule],
  templateUrl:'./theme-toggle.component.html'
})
export class ThemeToggleComponent {
  isDark = false;

  toggleTheme() {
    this.isDark = !this.isDark;
    document.body.classList.toggle('dark-theme', this.isDark);
  }
}
