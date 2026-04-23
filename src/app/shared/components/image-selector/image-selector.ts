import { Component, inject, signal } from '@angular/core';
import { ImageSelectorService } from '../../services/image-selector-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BlogImageResponseDto, UploadImageRequest } from '../../models/image.models';

@Component({
  selector: 'app-image-selector',
  imports: [ReactiveFormsModule],
  templateUrl: './image-selector.html',
  styleUrl: './image-selector.css',
})
export class ImageSelector {
  private imageSelectorService = inject(ImageSelectorService);
  //above are private properties only accessible within the ImageSelector class. not in the html file.
  showImageSelector = this.imageSelectorService.showImageSelector.asReadonly();
  //i dont want the showImageSelector signal to be editable in the template that is why is asReadonly(). i only want to read the value
  //of the signal in the html to show or hide the image selector modal,
  refreshTrigger = signal(0);
  private imageRef = this.imageSelectorService.getAllImages(this.refreshTrigger);
  //this will return a HttpResourceRef which has the value signal that contains the list of images, and also has isLoading and error signals to show loading spinner and error message in the template respectively. we can use the value signal in the template to show the list of images in the image selector modal.
  //we can use the isLoading, error and value signals in the template to show loading spinner, error message and the list of blog posts respectively
  isLoading = this.imageRef.isLoading;
  isError = this.imageRef.error;
  imageResponse = this.imageRef.value;
  statusCode = this.imageRef.statusCode;

  imageSelectorUploadForm = new FormGroup({
    file: new FormControl<File | null | undefined>(null, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)]
    }),
    title: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)]
    }),
  })

  //this below method is to handle the file input change event and update the file form control value in the 
  // imageSelectorUploadForm reactive form, because we cannot use formControlName directive with file input type,
  //  so we have to handle the change event and update the form control value manually.
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }
    this.imageSelectorUploadForm.patchValue({ file: input.files[0] });

  }


  onSubmit() {
    if (this.imageSelectorUploadForm.valid) {
      const formRawValue = this.imageSelectorUploadForm.getRawValue();
      // Handle the file upload logic here, e.g., send the file to a server or process it as needed

      const uploadImageRequest: UploadImageRequest = {
        title: formRawValue.title,
        fileName: formRawValue.name,
        file: formRawValue.file!,

      };


      this.imageSelectorService.uploadImage(uploadImageRequest).subscribe({
        next: (response) => {
          console.info('Image uploaded successfully:', response);
          // this.id.set(response.Id); //this will trigger the httpResource to re-evaluate and make a new GET request to the server to get the updated list of images including the newly uploaded image, because the httpResource is dependent on the id signal.  
          this.refreshTrigger.update(x => x + 1); // 🔥 forces reload properly
          this.imageSelectorUploadForm.reset(); // this reset all the form controls to their initial values, which is null for file and empty string for name and title, and also marks the form as pristine and untouched, which means that the form is not dirty and not touched, so it will not show any validation errors until the user interacts with the form again.
        },
        error: (error) => {
          console.error('Error uploading image:', error);
        }
      });

      // After handling the upload, you can reset the form and hide the image selector
      // this.imageSelectorUploadForm.reset();
      // this.hideImageSelector();
    }
  }

  onSelectImage(image: BlogImageResponseDto) {
    // Handle the image selection logic here, e.g., pass the selected image URL to a parent component or use it in the current component
    this.imageSelectorService.selectImage(image.url); // Set the selected image URL in the service, which can be accessed by other components that inject the service

  }

  hideImageSelector() {
    this.imageSelectorService.hideImageSelector();
  }
}
