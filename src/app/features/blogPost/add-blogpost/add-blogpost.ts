import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-blogpost',
  imports: [ReactiveFormsModule],
  templateUrl: './add-blogpost.html',
  styleUrl: './add-blogpost.css',
})
export class AddBlogpost {
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
    })
  });

  OnSubmit() {
    const formValue = this.addBlogpostForm.getRawValue();
    console.info(formValue);

  }
}
