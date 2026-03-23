import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BlogPostService } from '../services/blog-post-service';
import { AddBlogPost } from '../models/blogpost.model';
import { Router } from '@angular/router';
import { MarkdownComponent } from 'ngx-markdown';
import { CategoryService } from '../../category/services/category-service';

@Component({
  selector: 'app-add-blogpost',
  imports: [ReactiveFormsModule, MarkdownComponent],
  templateUrl: './add-blogpost.html',
  styleUrl: './add-blogpost.css',
})
export class AddBlogpost {
  private blogPostService = inject(BlogPostService);
  private categoryService = inject(CategoryService);
  private route = inject(Router);
  private categoriesResourceRef = this.categoryService.getAllCategories();
  //all above are private properties only accessible within the AddBlogpost class. not in the html file. 
  // The blogPostService is used to interact with the backend service for creating blog posts, while the categoryService is used to fetch categories. The route property is used for navigation after successfully creating a blog post. The categoriesResourceRef is a reference to the resource that contains all categories, which can be used to populate a dropdown or selection list in the form.
  //we can use the isLoading, error and value signals in the template to show loading spinner, error message and the list of blog posts respectively
  isLoading = this.categoriesResourceRef.isLoading;
  isError = this.categoriesResourceRef.error;
  categoriesResponse = this.categoriesResourceRef.value;
  statusCode = this.categoriesResourceRef.statusCode;

  addBlogpostForm = new FormGroup({  //this reactive form will be used to capture the input from the user when adding a new blog post. It includes form controls for title, short description, content, featured image URL, URL handle, and author, each with appropriate validators to ensure that the input meets certain criteria (e.g., required fields, minimum and maximum lengths, and specific patterns).
    title: new FormControl<string>('Iranian War', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10), Validators.maxLength(100)]
    }),
    shortDescription: new FormControl<string>('This was started by usa', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5), Validators.maxLength(250)]
    }),
    content: new FormControl<string>('Iranaian President was killed', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(20)]
    }),
    featuredImageUrl: new FormControl<string>('https://example.com/featured-image.jpg', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(250)]
    }),
    urlHandle: new FormControl<string>('https', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^[a-zA-Z0-9\-]*$/), Validators.maxLength(250)]
    }),
    author: new FormControl<string>('John Doe', {
      nonNullable: true,
      validators: [Validators.required]
    })
    ,
    PublishedDate: new FormControl<string>(new Date().toISOString().split('T')[0], {
      nonNullable: true,
      validators: [Validators.required]
    }),
    isVisible: new FormControl<boolean>(true, {
      nonNullable: true
    }),
    categories: new FormControl<string[]>([])
  });

  OnSubmit() {
    const formValue = this.addBlogpostForm.getRawValue();
    console.info('Form Value:', formValue);
    const addBlogPostRequest: AddBlogPost = {
      title: formValue.title,
      shortDescription: formValue.shortDescription,
      content: formValue.content,
      featuredImageUrl: formValue.featuredImageUrl,
      urlHandle: formValue.urlHandle,
      author: formValue.author,
      publishedDate: new Date(formValue.PublishedDate),
      isVisible: formValue.isVisible,
      categories: formValue.categories ?? []
    };
    this.blogPostService.createBlogPost(addBlogPostRequest).subscribe({
      next: (response) => {
        console.info('Blog post created successfully:', response);
        this.route.navigate(['/admin/blogposts']);
      },
      error: (error) => {
        console.error('Error creating blog post:', error);
      }
    });


  }
}
