import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
//import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { HeaderComponent } from './layout/header/header.component';
import { RouterModule } from '@angular/router';
@Component({
   selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']  // ✅ fixed this line
})
export class AppComponent {
  title = 'devavi-dashboard';
}
