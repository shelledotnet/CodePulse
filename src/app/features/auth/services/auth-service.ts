import { HttpClient, httpResource, HttpResourceRef, HttpResourceRequest } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { LoadUser, LoginResponse } from '../models/auth.model';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  user = signal<LoadUser | null>(null);
  router = inject(Router);
  //run ng generate environment at the root directory to generate environment files, then add apiBaseUrL in the environment files, then import environment in this service to use the apiBaseUrL
  //adding this file update angular.json file to include the environment files in the build options architect object, so that we can use the environment variables in our application
  //by using the ng serve command with the --configuration flag, we can specify which environment file to use, for example: ng serve --configuration=production will use the environment.ts file, and ng serve --configuration=development will use the environment.development.ts file
  //by running ng serve the angular will automatically use the environment.development.ts file because it is the default environment file, but when we run ng build --configuration=production it will automatically use the environment.ts file which is production.. because we have specified it in the build options of angular.json file
  private baseUrl = environment.apiBaseUrL;

  //here we have to return observable because we are not subscribing to the http call in the service, 
  // we will subscribe to it in the component, and we will perform action based on the response of 
  // the observable in the component
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/api/auth/login`, { email, password }, {
      withCredentials: true  //why do we have to set withCredentials to true? because we are using cookies 
      // for authentication, and by default, the browser does not send cookies in cross-origin requests, so we have to set withCredentials to true to tell the browser to include cookies in the request, and also the server has to set the Access-Control-Allow-Credentials header to true to allow the browser to send cookies in cross-origin requests
    }).pipe(
      // here we are using tap operator to perform side effect of setting the user signal with the response of the login api call, so that we can use the user signal in other parts of the application to check if the user is logged in or not, and to get the user details like email and roles
      tap((response) => {
        if (response.isSucceeded) {
          this.user.set({
            email: response.email,
            roles: response.roles
          });
        }
      })
    );
  }


  loadUser(): HttpResourceRef<LoadUser | undefined> {
    return httpResource<LoadUser | undefined>(() => {
      const request: HttpResourceRequest = {
        url: `${this.baseUrl}/api/auth/loaduser`,
        withCredentials: true
        //we are sending the cookies that has the credential wichi is the token back 
        // to the authorize endpoint loaduser
      }
      return request
    });
  }

  logout() {
    this.http.post<void>(`${this.baseUrl}/api/auth/logout`, {}, {
      withCredentials: true
    }).subscribe({
      next: () => {
        this.user.set(null);
        this.router.navigate([""]);
      },
      error: (err) => {
        console.error('Logout failed', err);
      }
    }
    );
  }
}
