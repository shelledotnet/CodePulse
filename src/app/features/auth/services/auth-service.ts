import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { LoginResponse } from '../models/auth.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
    private http = inject(HttpClient);
  //run ng generate environment at the root directory to generate environment files, then add apiBaseUrL in the environment files, then import environment in this service to use the apiBaseUrL
  //adding this file update angular.json file to include the environment files in the build options architect object, so that we can use the environment variables in our application
  //by using the ng serve command with the --configuration flag, we can specify which environment file to use, for example: ng serve --configuration=production will use the environment.ts file, and ng serve --configuration=development will use the environment.development.ts file
  //by running ng serve the angular will automatically use the environment.development.ts file because it is the default environment file, but when we run ng build --configuration=production it will automatically use the environment.ts file which is production.. because we have specified it in the build options of angular.json file
  private baseUrl = environment.apiBaseUrL;

  //here we have to return observable because we are not subscribing to the http call in the service, 
  // we will subscribe to it in the component, and we will perform action based on the response of 
  // the observable in the component
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/api/auth/login`, { email, password });
  }
}
