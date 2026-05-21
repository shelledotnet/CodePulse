import { Component, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../services/category-service';

@Component({
  selector: 'app-category-list',
  imports: [RouterLink],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
})
export class CategoryList {
  private categoryService = inject(CategoryService);
  name = signal('');
  sortBy = signal('');
  sortDirection = signal('');
  pageSize = signal(5);
  pageNumber = signal(1);
  totalCount = 0;
  list: number[] = [];
  private getAllCategoryByRef = this.categoryService.getAllCategories(this.name, this.sortBy,
    this.sortDirection, this.pageSize, this.pageNumber);//we are passing the name input signal to the getAllCategories method here with out paranthesis but when calling signal we inclue the parathesis in the service to fetch the category details based on the name, and we are using the returned signal to get the category details and patch the form values with the category details, and also to know the loading and error state of the request to fetch category details based on name
  //above are private properties only accessible within the CategoryList class. not in the html file.
  isLoading = this.getAllCategoryByRef.isLoading;
  isError = this.getAllCategoryByRef.error;
  value = this.getAllCategoryByRef.value;
  constructor() {
    this.categoryService.getCategoryCount().subscribe({
      next: (result) => {
        this.totalCount = result;
        this.list = new Array(Math.ceil(this.totalCount / this.pageSize()));
        console.log('Total categories count:', result);
      },
      error: (error) => {
        console.error('Error loading category count:', error);
      }
    });
  }
  onSearch(queryText: string): void {
    // Implement search functionality here
    // console.log('Search term:', this.searchTerm);
    if (queryText.trim() === '') {
      alert('Please enter a search term.');
      return;
    }
    this.name.set(queryText);
    // we are using signal to set the search text and the getAllCategories method in the service will automatically
    //fetch the categories based on the search text because we are passing the name signal to the getAllCategories 
    // method in the service, and we are using the returned signal to get the category details and patch the form 
    // values with the category details, and also to know the loading and error state of the request to fetch category details based on name, so we dont need to subscribe to an observable in the component to fetch categories based on search text, we can just use signal to know when the categories are fetched and perform action based on that in the template without having to subscribe to an observable in the component, which is a good practice because it keeps our component clean and free from subscription management code.
  }
  onSort(sortBy: string, sortDirection: string): void {
    // Implement sort functionality here
    // console.log('Sort by:', column);
    // console.log('Sort order:', order);
    this.sortBy.set(sortBy);
    this.sortDirection.set(sortDirection);
  }
  getPage(pageNumber: number): void {
    // Implement pagination functionality here
    // console.log('Page number:', pageNumber);
    // console.log('Page size:', pageSize);
    this.pageNumber.set(pageNumber);
    this.pageSize.set(this.pageSize());
  }
  getPreviousPage(): void {
    if (this.pageNumber() > 1) {
      this.pageNumber.set(this.pageNumber() - 1);
    }
    return; // we are not setting the page number signal here because we are already setting it in the getPage 
    // method when the user clicks on the page number, and we are using the page number signal to fetch the 
    // categories based on the page number, so we dont need to set it again here, we can just return from this
    //  method if the user clicks on the previous button without having to set the page number signal again, which is
    //  a good practice because it keeps our component clean and free from unnecessary code.
  }

  getNextPage(): void {
    if (this.pageNumber() < this.list.length) {
      this.pageNumber.set(this.pageNumber() + 1);
    }
    return; // we are not setting the page number signal here because we are already setting it in the getPage 
    // method when the user clicks on the page number, and we are using the page number signal to fetch the 
    // categories based on the page number, so we dont need to set it again here, we can just return from this
    //  method if the user clicks on the next button without having to set the page number signal again, which is
    //  a good practice because it keeps our component clean and free from unnecessary code.
  }
}
