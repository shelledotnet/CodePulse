import { Component, effect, inject, input } from '@angular/core';
import { BlogPostService } from '../services/blog-post-service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UpdateBlogPostRequest } from '../models/blogpost.model';
import { MarkdownComponent } from 'ngx-markdown';
import { CategoryService } from '../../category/services/category-service';
import { ImageSelector } from '../../../shared/components/image-selector/image-selector';
import { ImageSelectorService } from '../../../shared/services/image-selector-service';

@Component({
  selector: 'app-edit-blogpost',
  imports: [ReactiveFormsModule, MarkdownComponent],
  templateUrl: './edit-blogpost.html',
  styleUrl: './edit-blogpost.css',
})
export class EditBlogpost {

  id = input<string>(); //this is the input signal that will receive the id parameter from the route, ensure the landing componet can recieve route parametr by adding  provideRouter(routes,withComponentInputBinding()), in app.config.ts
  private imageSelectorService = inject(ImageSelectorService);
  private blogPostService = inject(BlogPostService);
  private categoryService = inject(CategoryService);
  private route = inject(Router);
  private getBlogPostByIdRef = this.blogPostService.getBlogPostById(this.id);//we are passing the id input signal to the getCategoryById method here with out paranthesis but when calling signal we inclue the parathesis in the service to fetch the category details based on the id, and we are using the returned signal to get the category details and patch the form values with the category details, and also to know the loading and error state of the request to fetch category details based on id
  //above are private properties only accessible within the EditBlogpost class. not in the html file.
  isLoading = this.getBlogPostByIdRef.isLoading;
  isError = this.getBlogPostByIdRef.error;
  blogPostResponse = this.getBlogPostByIdRef.value;
  statusCode = this.getBlogPostByIdRef.statusCode;
  private categoriesResourceRef = this.categoryService.getAllCategories();
  categoriesResponse = this.categoriesResourceRef.value;
  isEditMode = true;


  // 1) import reactiveformsmodule.
  // 2) formgroup --> formcontrols
  editBlogPostForm = new FormGroup({  //this reactive form will be used to capture the input from the user when adding a new blog post. It includes form controls for title, short description, content, featured image URL, URL handle, and author, each with appropriate validators to ensure that the input meets certain criteria (e.g., required fields, minimum and maximum lengths, and specific patterns).
    title: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10), Validators.maxLength(100)]
    }),
    shortDescription: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5), Validators.maxLength(500)]
    }),
    content: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(20)]
    }),
    featuredImageUrl: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(250)]
    }),
    urlHandle: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^[a-zA-Z0-9\-]*$/), Validators.maxLength(250)]
    }),
    author: new FormControl<string>('', {
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


  //the below getters are for validation and to access the form controls in the template, we are using editCategoryFormGroup.controls to access the form controls and return the specific form control based on the name of the form control, and we are using these getters in the template to show validation errors for each form control when the form control is invalid and touched or dirty
  get titleFormControl() {
    return this.editBlogPostForm.controls.title;
  }
  get shortDescriptionFormControl() {
    return this.editBlogPostForm.controls.shortDescription;
  }
  get contentFormControl() {
    return this.editBlogPostForm.controls.content;
  }
  get featuredImageUrlFormControl() {
    return this.editBlogPostForm.controls.featuredImageUrl;
  }
  get authorFormControl() {
    return this.editBlogPostForm.controls.author;
  }
  get urlHandleFormControl() {
    return this.editBlogPostForm.controls.urlHandle;
  }

  get isVisibleFormControl() {
    return this.editBlogPostForm.controls.isVisible;
  }
  get categoriesFormControl() {
    return this.editBlogPostForm.controls.categories;
  }



  //effect() is part of Angular Signals. 
  //In this context, effect() is used to create a reactive effect that automatically runs 
  // whenever the signals it depends on change.e.g blogPostResponse()
  //In this case, the effect is used to patch the editBlogPostForm 
  //  values with the blogPostResponse() details 
  effectRef = effect(() => {
    if (this.isEditMode) {
      this.editBlogPostForm.get('PublishedDate')?.disable();
    }
    if (this.blogPostResponse()) {
      this.editBlogPostForm.patchValue({
        //patchValue enable us to update the values of the form controls in the 
        // editCategoryFormGroup with the values from the categoryResponse signal, and we 
        // are using optional chaining to ensure that we dont get an error when the categoryResponse signal is undefined or null, because when the component is first loaded the categoryResponse signal will be undefined until the http call to fetch category details based on id is completed and the value of the categoryResponse signal is updated with the fetched category details.
        //id is not included in the patchValue because we are not allowing the user to edit the id of the category, and also because the id is not part of the form controls in the editCategoryFormGroup, and we are using the id from the input signal to make the update category request in the updateCategory method when the form is submitted.
        // id: this.categoryResponse()?.id,
        title: this.blogPostResponse()?.title,
        urlHandle: this.blogPostResponse()?.urlHandle,
        content: this.blogPostResponse()?.content,
        shortDescription: this.blogPostResponse()?.shortDescription,
        author: this.blogPostResponse()?.author,
        featuredImageUrl: this.blogPostResponse()?.featuredImageUrl,
        PublishedDate: new Date(this.blogPostResponse()?.publishedDate!)
          .toISOString().split('T')[0],
        isVisible: this.blogPostResponse()?.isVisible,
        categories: this.blogPostResponse()?.categories.map(category => category.id)
        //we are mapping the categories array in the blogPostResponse to get an array of category
        // ids and patching it to the categories form control, because in the edit blog post form
        //  we will show a list of categories with checkboxes and the user can select multiple 
        // categories for the blog post, so we need to patch an array of category ids to the 
        // categories form control to show the selected categories in the form when the form is 
        // loaded with the blog post details based on id.

      });
    }
  });
  //we always reacto to change of signal using effect() in the component and not in the service, because the service should be responsible for managing the state and logic related to the data, and the component should be responsible for reacting to the changes in the state and updating the UI accordingly, so we should use effect() in the component to react to the changes in the signals that hold the data and update the form values or perform any other action based on the changes in the signals, and we should not use effect() in the service to react to the changes in the signals because it can lead to unexpected behavior and make it harder to manage the state and logic related to the data in a clear and predictable way.
  //i want to response to chenge of the signal that holds the selected image url in the image selector service 
  // and update the featuredImageUrl form control value with the selected image url whenever it changes, 
  // so that when the user selects an image from the image selector modal the featuredImageUrl form control value 
  // will be updated with the selected image url and we can use that url to update the blog post details when the form is submitted.
  selectedImageEffectRef = effect(() => {
    const selectedImageUrl = this.imageSelectorService.selectedImage();
    if (selectedImageUrl) {
      this.editBlogPostForm.patchValue({ featuredImageUrl: selectedImageUrl });
    }
  });


  OnSubmit() {
    const id = this.id();
    if (id && this.editBlogPostForm.valid) {
      const editBlogPostFormValue = this.editBlogPostForm.getRawValue();
      console.info(editBlogPostFormValue);
      const updateRequestDto: UpdateBlogPostRequest = {
        title: editBlogPostFormValue.title,
        urlHandle: editBlogPostFormValue.urlHandle,
        content: editBlogPostFormValue.content,
        shortDescription: editBlogPostFormValue.shortDescription,
        publishedDate: new Date(editBlogPostFormValue.PublishedDate),
        categories: editBlogPostFormValue.categories ?? [],
        isVisible: editBlogPostFormValue.isVisible,
        author: editBlogPostFormValue.author,
        featuredImageUrl: editBlogPostFormValue.featuredImageUrl

      }

      //here we subscribe to the returned observables(next: observer and error: observer)
      this.blogPostService.updateBlogPost(id, updateRequestDto).subscribe({
        next: (response) => {
          console.info('Blog post edited successfully:', response);
          this.route.navigate(['/admin/blogposts']);
        },
        error: (error) => {
          console.error('Error editing blog post:', error);
        }
      });

    }
    else if (!this.editBlogPostForm.valid || !id) {
      this.editBlogPostForm.markAllAsTouched();
      return;  //return from here and dont submit the form if the form is invalid or id is undefined, and we are marking all form controls as touched to show validation errors for all form controls in the template when the form is submitted with invalid values, and we are also checking if the id is undefined because we need the id to make the update category request, and if the id is undefined it means that there is an issue with fetching the category details based on id or with receiving the id parameter from the route, and in both cases we should not submit the form because we need the id to make the update category request.
    }
  }

  onDelete() {
    const id = this.id();
    if (id) {


      //this will now subcribe to the deleteBlogPostById observable and perform action based on the response 
      // of the observable in the component, which is to navigate to the blogpost list page if the 
      // delete request is successful, or log an error if the delete request fails.
      //because we are subcribing in the component we dont need signal or change the state of any signal 
      // in the service to know the status of the delete request, we can directly perform action based on 
      // the response of the observable in the component.
      //with this approach we have more control in the component to perform different action based on the 
      // response of the observable, for example we can show a success message or error message in the 
      // component based on the response of the observable, which is not possible if we are using signal in 
      // the service to know the status of the delete request.
      this.blogPostService.deleteBlogPostById(id)
        .subscribe({
          next: (response) => {
            console.info(`blog post deleted successfully ${response}`);
            this.route.navigate(['/admin/blogposts']);
            //eventually redirect to category list page
          },
          error: (error) => {
            console.error('Error deleting blogpost:', error);
          }
        });

    }
    console.error('category id is undefined');
    return;
  }
  openImageSelector() {
    this.imageSelectorService.displayImageSelector();
  }
}
