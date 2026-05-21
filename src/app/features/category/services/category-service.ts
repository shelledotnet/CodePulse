import { HttpClient, HttpParams, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Injectable, InputSignal, Signal, signal } from '@angular/core';
import { CategoryRequest, CategoryResponse, DeleteCategoryResponse, UpdateCategoryRequest } from '../models/category.model';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

//this enble category service to be injected in any component or service in the application without having 
// to register it in the providers array of the module, because we have provided it in the root injector of the application using providedIn: 'root'
@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  //ensure provideHttpClient() is register in app.config.ts before using inject(HttpClient) in the service, otherwise it will throw an error because HttpClient is not registered in the dependency injection system
  private http = inject(HttpClient);

  //run ng generate environment at the root directory to generate environment files, then add apiBaseUrL in the environment files, then import environment in this service to use the apiBaseUrL
  //adding this file update angular.json file to include the environment files in the build options architect object, so that we can use the environment variables in our application
  //by using the ng serve command with the --configuration flag, we can specify which environment file to use, for example: ng serve --configuration=production will use the environment.ts file, and ng serve --configuration=development will use the environment.development.ts file
  //by running ng serve the angular will automatically use the environment.development.ts file because it is the default environment file, but when we run ng build --configuration=production it will automatically use the environment.ts file which is production.. because we have specified it in the build options of angular.json file
  private baseUrl = environment.apiBaseUrL;

  //signals help us to know the status of an external call  has ended or not ..and if they are successful or failed
  //its a good practise for signal to be in the service
  addCategoryStatusSignal = signal<'idle' | 'loading' | 'success' | 'error'>('idle');
  updateCategoryStatusSignal = signal<'idle' | 'loading' | 'success' | 'error'>('idle');

  addCategory(category: CategoryRequest) {  //this is observable because we are not subscribing to the http call in the service, we will subscribe to it in the component, and we will perform action based on the response of the observable in the component
    this.addCategoryStatusSignal.set('loading');
    this.http.post<void>(`${this.baseUrl}/api/Categories`, category, {
      withCredentials: true
    }).subscribe({//this is RXJS subscription, it has next and error callback, next callback will be called when the http call is successful and error callback will be called when the http call fails
      next: (response) => {
        this.addCategoryStatusSignal.set('success');
        // console.log(response);
      },
      error: (error) => {
        this.addCategoryStatusSignal.set('error');
        // console.log(error);
      }
    })
  }

  //here u dont need to return observale because you have actually subcribed to the http call and you are using 
  // signal to know the status of the request, so you can perform action based on the value of the signal 
  // in the component without having to subscribe to an observable in the component
  updateCategory(id: string, editcategory: UpdateCategoryRequest) {
    this.updateCategoryStatusSignal.set('loading');
    this.http.put<void>(`${this.baseUrl}/api/Categories/${id}`, editcategory, {
      withCredentials: true
    }).subscribe({
      next: (response) => {
        this.updateCategoryStatusSignal.set('success');
        // console.info(response);
      },
      error: (error) => {
        this.updateCategoryStatusSignal.set('error');
        // console.log(error);
      }
    })
  }

  getAllCategories(
    name: Signal<string | undefined> = signal(undefined),
    sortBy: Signal<string | undefined> = signal(undefined),
    sortDirection: Signal<string | undefined> = signal(undefined),
    pageSize: Signal<number | undefined> = signal(5),
    pageNumber: Signal<number | undefined> = signal(1)
  ): HttpResourceRef<CategoryResponse[] | undefined> {

    return httpResource<CategoryResponse[]>(() => {

      let params = new HttpParams();
      //Angular tracks signals only when they are read inside reactive functions.
      const nameValue = name();
      const sortByValue = sortBy();
      const sortDirectionValue = sortDirection();
      const pageSizeValue = pageSize();
      const pageNumberValue = pageNumber();

      if (nameValue) {
        params = params.set('name', nameValue);
      }

      if (sortByValue) {
        params = params.set('sortBy', sortByValue);
      }

      if (sortDirectionValue) {
        params = params.set('sortDirection', sortDirectionValue);
      }
      if (pageNumberValue) {
        params = params.set('pageNumber', pageNumberValue.toString());
      }
      if (pageSizeValue) {
        params = params.set('pageSize', pageSizeValue.toString());
      }

      return {
        url: `${this.baseUrl}/api/Categories`,
        method: 'GET',
        params,
        withCredentials: true
      };
    });
  }

  getCategoryById(id: InputSignal<string | undefined>):
    HttpResourceRef<CategoryResponse | undefined> { //this httpResourceRef is only for GET requests has signal inclusive WITH THE RESPONSE TYPE
    return httpResource<CategoryResponse>(() => `${this.baseUrl}/api/Categories/${id()}`);
  }

  getCategoryCount():
    Observable<number> { 
      console.log('Request fsetching category count from API...');
    return this.http.get<number>(`${this.baseUrl}/api/Categories/Count`);
  }

  //here we have to return observable because we are not subscribing to the http call in the service, 
  // we will subscribe to it in the component, and we will perform action based on the response of 
  // the observable in the component
  deleteCategoryById(id: string): Observable<DeleteCategoryResponse> {
    return this.http.delete<DeleteCategoryResponse>(`${this.baseUrl}/api/Categories/${id}`, {
      withCredentials: true
    });
  }
}
