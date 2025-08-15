import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../../core/services/loader.service';
@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent {
  isLoading = signal(false);
  constructor(private loaderService: LoaderService) {}
  // This will be bound from LoaderService
  ngOnInit() {
    this.isLoading = this.loaderService.loading;
  }
}
