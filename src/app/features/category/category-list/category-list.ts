import { Component, inject } from '@angular/core';
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
  private getAllCategoryByRef = this.categoryService.getAllCategories();
  //above are private properties only accessible within the CategoryList class. not in the html file.
  isLoading = this.getAllCategoryByRef.isLoading;
  isError = this.getAllCategoryByRef.error;
  value = this.getAllCategoryByRef.value;

  // deleteCategory(categoryId: string) {

  // }
}
