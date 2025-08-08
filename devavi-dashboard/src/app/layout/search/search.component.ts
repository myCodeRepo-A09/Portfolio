import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../core/services/search.service';
import { SnackbarService } from '../../core/services/snackbar.service';
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  searchQuery = '';

  constructor(
    private searchService: SearchService,
    private snackBar: SnackbarService
  ) {}

  search() {
    this.snackBar.warn('Search functionality is not implemented yet.');
    // if (this.searchQuery.trim()) {
    //   this.searchService.changeSearch(this.searchQuery);
    // }
  }

  clearSearch() {
    this.searchQuery = '';
    this.searchService.changeSearch('');
  }
}
