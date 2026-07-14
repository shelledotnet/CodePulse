import { inject, Injectable, InputSignal, signal } from '@angular/core';
import { AddBlogPostRequestDto, BlogPostResponseDto, UpdateBlogPostRequest } from '../models/blogpost.model';
import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BlogPostService {
  private http = inject(HttpClient);
  //run ng generate environment at the root directory to generate environment files, then add apiBaseUrL in the environment files, then import environment in this service to use the apiBaseUrL
  //adding this file update angular.json file to include the environment files in the build options architect object, so that we can use the environment variables in our application
  //by using the ng serve command with the --configuration flag, we can specify which environment file to use, for example: ng serve --configuration=production will use the environment.ts file, and ng serve --configuration=development will use the environment.development.ts file
  //by running ng serve the angular will automatically use the environment.development.ts file because it is the default environment file, but when we run ng build --configuration=production it will automatically use the environment.ts file which is production.. because we have specified it in the build options of angular.json file
  private baseUrl = environment.apiBaseUrL;


  //this will return an observable of type BlogPost because we are not subscribing to the http call in the service,
  //we will subscribe to it in the component, and we will perform action based on the response of the observable in the component
  createBlogPost(data: AddBlogPostRequestDto): Observable<BlogPostResponseDto> {
    return this.http.post<BlogPostResponseDto>(`${this.baseUrl}/api/blogpost`, data, {
      withCredentials: true
    });
  }

  getAllBlogPosts(): HttpResourceRef<BlogPostResponseDto[] | undefined> { //this httpResource is only for GET requests and has signal inclusive WITH THE RESPONSE TYPE
    return httpResource<BlogPostResponseDto[]>(() => `${this.baseUrl}/api/BlogPost`);
  }

  getBlogPostById(id: InputSignal<string | undefined>):
    HttpResourceRef<BlogPostResponseDto | undefined> { //this httpResource is only for GET requests has signal inclusive WITH THE RESPONSE TYPE
    return httpResource<BlogPostResponseDto>(() => `${this.baseUrl}/api/BlogPost/${id()}`);
  }


  getBlogPostByUrlHandle(urlHandle: InputSignal<string | undefined>):
    HttpResourceRef<BlogPostResponseDto | undefined> { //this httpResource is only for GET requests has signal inclusive WITH THE RESPONSE TYPE
    return httpResource<BlogPostResponseDto>(() => `${this.baseUrl}/api/BlogPost/${urlHandle()}`);
  }



  //this will return an observable of type BlogPost because we are not subscribing to the http call in the service, we will subscribe to it in the component, and we will perform action based on the response of the observable in the component
  updateBlogPost(id: string, editBlogPost: UpdateBlogPostRequest): Observable<BlogPostResponseDto> {
    return this.http.put<BlogPostResponseDto>(`${this.baseUrl}/api/BlogPost/${id}`, editBlogPost, {
      withCredentials: true
    });
  }

  //here we have to return observable because we are not subscribing to the http call in the service, 
  // we will subscribe to it in the component, and we will perform action based on the response of 
  // the observable in the component
  deleteBlogPostById(id: string): Observable<BlogPostResponseDto> {
    return this.http.delete<BlogPostResponseDto>(`${this.baseUrl}/api/BlogPost/${id}`, {
      withCredentials: true
    });
  }
}
