import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  authService = inject(AuthService);
  router = inject(Router);

  loginFormGroup = new FormGroup({
    email: new FormControl<string>('admin@codepulse.com', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),
    password: new FormControl<string>('Admin@123', {
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
          // console.log('Login successful:', response);
          this.router.navigate(['']);
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