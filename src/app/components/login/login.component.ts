import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthenticationService} from "../../services/authentication.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('')
  });

  failedLogin: boolean = false;

  returnUrl: string = '';

  constructor(
    private authentication: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(
      (params) => {
        this.returnUrl = params['returnUrl'] || '';
      });
    if (this.authentication.isAuthenticated()) {
      this.router.navigate([this.returnUrl]).then();
    }
  }

  login() {
    const username = this.loginForm.get('username')?.value;
    const password = this.loginForm.get('password')?.value;
    this.authentication
      .authenticate(username, password)
      .subscribe(
        {
          next:
            () => {
              this.router.navigate([this.returnUrl]).then();
            },
          error: () => { this.failedLogin = true; }
        }
      );
  }

}
