import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { BlogImageResponseDto, UploadImageRequest } from '../models/image.models';
import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ImageSelectorService {
  private http = inject(HttpClient);
  //run ng generate environment at the root directory to generate environment files, then add apiBaseUrL in the environment files, then import environment in this service to use the apiBaseUrL
  //adding this file update angular.json file to include the environment files in the build options architect object, so that we can use the environment variables in our application
  //by using the ng serve command with the --configuration flag, we can specify which environment file to use, for example: ng serve --configuration=production will use the environment.ts file, and ng serve --configuration=development will use the environment.development.ts file
  //by running ng serve the angular will automatically use the environment.development.ts file because it is the default environment file, but when we run ng build --configuration=production it will automatically use the environment.ts file which is production.. because we have specified it in the build options of angular.json file
  private baseUrl = environment.apiBaseUrL;

  showImageSelector = signal<boolean>(false);
  selectedImage = signal<string | null>(null);

  displayImageSelector() {
    this.showImageSelector.set(true);
  }
  hideImageSelector() {
    this.showImageSelector.set(false);
  }
  uploadImage(data: UploadImageRequest): Observable<BlogImageResponseDto> {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('fileName', data.fileName);
    formData.append('title', data.title);

    return this.http.post<BlogImageResponseDto>(`${this.baseUrl}/api/Images`, formData);
  }
  getAllImages(trigger: WritableSignal<number>): HttpResourceRef<BlogImageResponseDto[] | undefined> { //this httpResource is only for GET requests and has signal inclusive WITH THE RESPONSE TYPE
    return httpResource<BlogImageResponseDto[]>(() => {
      trigger(); // dependency //this is to make the httpResource dependent on the id signal, so that when the id signal changes, the httpResource will be re-evaluated and will make a new GET request to the server with the new id value
      return `${this.baseUrl}/api/Images`;
    })
  }
  selectImage(imageUrl: string) {
    this.selectedImage.set(imageUrl); 
    this.hideImageSelector(); // Hide the image selector after selecting an image
  }
} 
