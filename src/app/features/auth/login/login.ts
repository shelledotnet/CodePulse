import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  authService = inject(AuthService);

  
  loginFormGroup = new FormGroup({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required]
    })
  })

 get emailformControl(): FormControl<string> {
    return this.loginFormGroup.controls.email;
  }

  get passwordformControl(): FormControl<string> {
    return this.loginFormGroup.controls.password;
  }

  onSubmit(): void {
    const formRawValue = this.loginFormGroup.getRawValue();
    if (this.loginFormGroup.valid) {
      this.authService.login(formRawValue.email, formRawValue.password).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
        },
        error: (error) => {
          console.error('Login failed:', error);
        }
      });

    } else {
      console.log('Form is invalid');
    }
  }
}