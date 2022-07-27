import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.generateFormLogin();
  }

  generateFormLogin() {
    this.loginForm = this.fb.group({
      email: ['test1@test.com', [Validators.required, Validators.email]],
      password: ['123456', [Validators.required, Validators.minLength(6)]],
    });
  }

  login() {
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe((response) => {
      if (response.success === true) {
        this.router.navigate(['/dashboard']);
      } else {
        Swal.fire('Error', response.msg, 'error');
      }
    });
  }
}
