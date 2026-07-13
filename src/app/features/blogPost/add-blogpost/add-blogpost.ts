import { Component, effect, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BlogPostService } from '../services/blog-post-service';
import { AddBlogPost } from '../models/blogpost.model';
import { Router } from '@angular/router';
import { MarkdownComponent } from 'ngx-markdown';
import { CategoryService } from '../../category/services/category-service';
import { ImageSelectorService } from '../../../shared/services/image-selector-service';
import { ImageSelector } from "../../../shared/components/image-selector/image-selector";

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
  imageSelectorService = inject(ImageSelectorService);

  private categoriesResourceRef = this.categoryService.getAllCategories();
  //all above are private properties only accessible within the AddBlogpost class. not in the html file. 
  // The blogPostService is used to interact with the backend service for creating blog posts, while the categoryService is used to fetch categories. The route property is used for navigation after successfully creating a blog post. The categoriesResourceRef is a reference to the resource that contains all categories, which can be used to populate a dropdown or selection list in the form.
  //we can use the isLoading, error and value signals in the template to show loading spinner, error message and the list of blog posts respectively
  isLoading = this.categoriesResourceRef.isLoading;
  isError = this.categoriesResourceRef.error;
  categoriesResponse = this.categoriesResourceRef.value;
  statusCode = this.categoriesResourceRef.statusCode;

  //we always reacto to change of signal using effect() in the component and not in the service, because the service should be responsible for managing the state and logic related to the data, and the component should be responsible for reacting to the changes in the state and updating the UI accordingly, so we should use effect() in the component to react to the changes in the signals that hold the data and update the form values or perform any other action based on the changes in the signals, and we should not use effect() in the service to react to the changes in the signals because it can lead to unexpected behavior and make it harder to manage the state and logic related to the data in a clear and predictable way.
  //i want to response to chenge of the signal that holds the selected image url in the image selector service 
  // and update the featuredImageUrl form control value with the selected image url whenever it changes, 
  // so that when the user selects an image from the image selector modal the featuredImageUrl form control value 
  // will be updated with the selected image url and we can use that url to update the blog post details when the form is submitted.
  selectedImageEffectRef = effect(() => {
    const selectedImageUrl = this.imageSelectorService.selectedImage();
    if (selectedImageUrl) {
      this.addBlogpostForm.patchValue({ featuredImageUrl: selectedImageUrl });
    }
  });

  addBlogpostForm = new FormGroup({  //this reactive form will be used to capture the input from the user when adding a new blog post. It includes form controls for title, short description, content, featured image URL, URL handle, and author, each with appropriate validators to ensure that the input meets certain criteria (e.g., required fields, minimum and maximum lengths, and specific patterns).
    title: new FormControl<string>('Iranian War', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10), Validators.maxLength(50)]
    }),
    shortDescription: new FormControl<string>('This was started by usa', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5), Validators.maxLength(70)]
    }),
    content: new FormControl<string>('Iranaian President was killed', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(20), Validators.maxLength(250)]
    }),
    featuredImageUrl: new FormControl<string>('https://example.com/featured-image.jpg', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(20), Validators.maxLength(250)]
    }),
    urlHandle: new FormControl<string>('https', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^[a-zA-Z0-9\-]*$/), Validators.maxLength(250)]
    }),
    author: new FormControl<string>('John Doe', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5), Validators.maxLength(30)]
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

  //the below getters are for validation and to access the form controls in the template, we are using addCategoryFormGroup.
  //controls to access the form controls and return the specific form control based on the name of the form control,
  //  and we are using these getters in the template to show validation errors for each form control when the form control is invalid and touched or dirty
  get titleFormControl() {
    return this.addBlogpostForm.controls.title;
  }
  get shortDescriptionFormControl() {
    return this.addBlogpostForm.controls.shortDescription;
  }
  get contentFormControl() {
    return this.addBlogpostForm.controls.content;
  }
  get featuredImageUrlFormControl() {
    return this.addBlogpostForm.controls.featuredImageUrl;
  }
  get urlHandleFormControl() {
    return this.addBlogpostForm.controls.urlHandle;
  }
  get authorFormControl() {
    return this.addBlogpostForm.controls.author;
  }
  get PublishedDateFormControl() {
    return this.addBlogpostForm.controls.PublishedDate;
  }
  get isVisibleFormControl() {
    return this.addBlogpostForm.controls.isVisible;
  }
  get categoriesFormControl() {
    return this.addBlogpostForm.controls.categories;
  }


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
