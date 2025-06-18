import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../core/services/search.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  searchQuery = '';

  constructor(private searchService: SearchService) {}

  search() {
    if (this.searchQuery.trim()) {
      this.searchService.changeSearch(this.searchQuery);
    }
  }

  clearSearch() {
    this.searchQuery = '';
    this.searchService.changeSearch('');
  }
}