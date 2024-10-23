import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {NgIf} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {NotificationService} from '../service/notification.service'; // Adjust path as necessary

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [
    MatFormField,
    MatCard,
    MatCardContent,
    MatCardTitle,
    ReactiveFormsModule,
    MatInput,
    MatButton,
    NgIf,
    MatError,
    MatLabel,
    HttpClientModule
  ],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    this.authService.login(this.loginForm.value).subscribe(
        response => {
          localStorage.setItem('jwt', response.token);
          localStorage.setItem('userId', response.userId);
          console.log('jwt set', localStorage.getItem('jwt'))
          this.router.navigate(['/list']);
        },
        error => {
          this.errorMessage = 'Login failed. Please check your credentials.';
          console.error('Login error', error);
          this.notificationService.showError('Login error! ' + error.message)
          this.loading = false;
        }
      );
  }
}
