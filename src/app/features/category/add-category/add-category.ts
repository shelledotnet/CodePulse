import { Component, effect, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddCategoryRequest } from '../models/category.model';
import { CategoryService } from '../services/category-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-category',
  imports: [ReactiveFormsModule],
  templateUrl: './add-category.html',
  styleUrl: './add-category.css',
})
export class AddCategory {
  private categoryService = inject(CategoryService);
  private route = inject(Router);
  //above are private properties only accessible within the AddCategory class. not in the html file.
  constructor() {
    //i will use effect signal to loop through the signal details, ensure effect() is always inside a constructor
    //why do we always have effect signal inside constructor? because we want to ensure that the effect is created 
    // when the component is created, and also because we want to avoid creating multiple effects when the component
    // is re-rendered, because if we put the effect outside the constructor it will be created every time the component
    // is re-rendered, and this will cause performance issues and memory leaks, but when we put the effect inside 
    // the constructor it will be created only once when the component is created, and it will be automatically
    //  destroyed when the component is destroyed, so this is a good practice to ensure that we dont create multiple
    //  effects and we dont have memory leaks in our application. 
    effect(() => {
      if (this.categoryService.addCategoryStatusSignal() === 'success') {
        console.info('success');
        this.categoryService.addCategoryStatusSignal.set('idle');//reset the signal to idle after handling the success case, so that it can be used again for future add category requests without being stuck in the success state.
        this.route.navigate(['/admin/categories']);
        //eventually redirect to category list page
      }
      else if (this.categoryService.addCategoryStatusSignal() === 'error') {
        this.categoryService.addCategoryStatusSignal.set('idle');//reset the signal to idle after handling the error case, so that it can be used again for future add category requests without being stuck in the error state.
        console.error('Add category request fail');
      }
    });
  }

  // 1) import reactiveformsmodule.
  // 2) formgroup --> formcontrols
  addCategoryFormGroup = new FormGroup({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(30)]
    }),
    urlHandle: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(30)]
    }),
  })

  //the below getters are for validation and to access the form controls in the template, we are using addCategoryFormGroup.controls to access the form controls and return the specific form control based on the name of the form control, and we are using these getters in the template to show validation errors for each form control when the form control is invalid and touched or dirty
  get nameFormControl() {
    return this.addCategoryFormGroup.controls.name;
  }
  get urlHandleFormControl() {
    return this.addCategoryFormGroup.controls.urlHandle;
  }


  OnSubmit() {
    const addCategoryFormGroupValue = this.addCategoryFormGroup.getRawValue();
    const addCategoryRequestDto: AddCategoryRequest = {
      name: addCategoryFormGroupValue.name,
      urlHandle: addCategoryFormGroupValue.urlHandle
    }
    this.categoryService.addCategory(addCategoryRequestDto);


  }
}
