import { Component, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
//import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { HeaderComponent } from './layout/header/header.component';
import { RouterModule } from '@angular/router';
import { SnackbarComponent } from './shared/components/snackbar/snackbar.component';
import { FloatingChatComponent } from './shared/components/floating-chat/floating-chat.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    RouterModule,
    SnackbarComponent,
    FloatingChatComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'], // ✅ fixed this line
})
export class AppComponent {
  title = 'devavi-dashboard';
}
