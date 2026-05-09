import { Component, effect, inject, input } from '@angular/core';
import { CategoryService } from '../services/category-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UpdateCategoryRequest } from '../models/category.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-category',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-category.html',
  styleUrl: './edit-category.css',
})
export class EditCategory {
  constructor() {
    //i will use effect signal to loop through the signal ensure is always inside a constructor
    //effect() is part of Angular Signals.
    //In this context, effect() is used to create a reactive effect that automatically runs whenever the signals it depends on change.
    //In this case, the effect is used to check the status of the updateCategoryStatusSignal and perform actions based on its value (i.e., when the update category request is successful or fails).

    effect(() => {
      if (this.categoryService.updateCategoryStatusSignal() === 'success') {
        console.info('success');
        this.categoryService.updateCategoryStatusSignal.set('idle');//reset the signal to idle after handling the success case, so that it can be used again for future update category requests without being stuck in the success state.
        this.route.navigate(['/admin/categories']);
        //eventually redirect to category list page
      }
      if (this.categoryService.updateCategoryStatusSignal() === 'error') {
        this.categoryService.updateCategoryStatusSignal.set('idle');//reset the signal to idle after handling the error case, so that it can be used again for future update category requests without being stuck in the error state.
        console.error('Update category request fail');
      }
    });
  }
  id = input<string>(); //this is the input signal that will receive the id parameter from the route, ensure the landing componet can recieve route parametr by adding  provideRouter(routes,withComponentInputBinding()), in app.config.ts
  private categoryService = inject(CategoryService);
  private route = inject(Router);
  private getCategoryByIdRef = this.categoryService.getCategoryById(this.id);//we are passing the id input signal to the getCategoryById method here with out paranthesis but when calling signal we inclue the parathesis in the service to fetch the category details based on the id, and we are using the returned signal to get the category details and patch the form values with the category details, and also to know the loading and error state of the request to fetch category details based on id
  //above are private properties only accessible within the EditCategory class. not in the html file.
  isLoading = this.getCategoryByIdRef.isLoading;
  isError = this.getCategoryByIdRef.error;
  categoryResponse = this.getCategoryByIdRef.value;





  // 1) import reactiveformsmodule.
  // 2) formgroup --> formcontrols
  editCategoryFormGroup = new FormGroup({
    //'' is the default value of the 2 form controls name and urlhandle, nonNullable is set to true to ensure that the form control value is never null, and we have added validators to the form controls to ensure that the name and urlHandle are required and have a maximum length of 30 characters.
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(30)]
    }),
    urlHandle: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(30)]
    }),
  })

  //the below getters are for validation and to access the form controls in the template, we are using editCategoryFormGroup.controls to access the form controls and return the specific form control based on the name of the form control, and we are using these getters in the template to show validation errors for each form control when the form control is invalid and touched or dirty
  get nameFormControl() {
    return this.editCategoryFormGroup.controls.name;
  }
  get urlHandleFormControl() {
    return this.editCategoryFormGroup.controls.urlHandle;
  }


  //effect() is part of Angular Signals.
  //In this context, effect() is used to create a reactive effect that automatically runs whenever the signals it depends on change.
  //In this case, the effect is used to patch the form values with the category details whenever the categoryResponse signal changes (i.e., when the category details are fetched from the server).
  //so here u dont need to put the effect in a constructor because we are not checking for the status of any request, we are just patching the form values with the category details whenever the categoryResponse signal changes, and this will ensure that the form values are updated with the fetched category details as soon as they are available, without having to manually trigger any function to update the form values after fetching the category details based on id.
  effectRef = effect(() => {
    if (this.categoryResponse()) {
      this.editCategoryFormGroup.patchValue({ //patchValue enable us to update the values of the form controls in the editCategoryFormGroup with the values from the categoryResponse signal, and we are using optional chaining to ensure that we dont get an error when the categoryResponse signal is undefined or null, because when the component is first loaded the categoryResponse signal will be undefined until the http call to fetch category details based on id is completed and the value of the categoryResponse signal is updated with the fetched category details.
        //id is not included in the patchValue because we are not allowing the user to edit the id of the category, and also because the id is not part of the form controls in the editCategoryFormGroup, and we are using the id from the input signal to make the update category request in the updateCategory method when the form is submitted.
        // id: this.categoryResponse()?.id,
        name: this.categoryResponse()?.name,
        urlHandle: this.categoryResponse()?.urlHandle
      });
    }
  });

  OnSubmit() {

    const id = this.id();
    if (!this.editCategoryFormGroup.valid || !id) {
      this.editCategoryFormGroup.markAllAsTouched();
      return;  //return from here and dont submit the form if the form is invalid or id is undefined, and we are marking all form controls as touched to show validation errors for all form controls in the template when the form is submitted with invalid values, and we are also checking if the id is undefined because we need the id to make the update category request, and if the id is undefined it means that there is an issue with fetching the category details based on id or with receiving the id parameter from the route, and in both cases we should not submit the form because we need the id to make the update category request.
    }

    const editCategoryFormGroupValue = this.editCategoryFormGroup.getRawValue();
    const updateRequestDto: UpdateCategoryRequest = {
      name: editCategoryFormGroupValue.name,
      urlHandle: editCategoryFormGroupValue.urlHandle
    }

    this.categoryService.updateCategory(id, updateRequestDto);

  }

  deleteCategory() {
    const id = this.id();
    if (!id) {
      console.error('category id is undefined');
      return;
    }

    //this will now subcribe to the deleteCategoryById observable and perform action based on the response 
    // of the observable in the component, which is to navigate to the category list page if the 
    // delete request is successful, or log an error if the delete request fails.
    //because we are subcribing in the component we dont need signal or change the state of any signal 
    // in the service to know the status of the delete request, we can directly perform action based on 
    // the response of the observable in the component.
    //with this approach we have more control in the component to perform different action based on the 
    // response of the observable, for example we can show a success message or error message in the 
    // component based on the response of the observable, which is not possible if we are using signal in 
    // the service to know the status of the delete request.
    this.categoryService.deleteCategoryById(id).subscribe({
      next: (response) => {
        console.log(response);
        this.route.navigate(['/admin/categories']);
        //eventually redirect to category list page
      },
      error: (error) => {
        console.error('Error deleting category:', error);
      }
    });
  }
}
