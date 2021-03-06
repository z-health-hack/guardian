import {ActivatedRoute, Router} from '@angular/router';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RETURN_URL_PARAM} from '../auth/auth.guard';
import {AuthService} from '../auth/auth.service';
import {SnackBarService} from '../snack-bar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  form: FormGroup;
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private snackBar: SnackBarService,
    private route: ActivatedRoute
  ) {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // router.navigate only permits known routes, so injecting another domain in the queryParam is not possible
    const desiredReturnUrl = this.route.snapshot.queryParams[RETURN_URL_PARAM];
    this.returnUrl = desiredReturnUrl || '/';
    document.querySelector('body').classList.add('login');
  }

  ngOnDestroy(): void {
    document.querySelector('body').classList.remove('login');
  }

  login(): void {
    const username = this.form.get('username').value;
    const password = this.form.get('password').value;
    this.loginDirectly(username, password);
  }

  loginDirectly(username: string, password: string): void {

    if (username && password) {
      this.authService.authenticate(username, password).subscribe(
        () => {
          this.router.navigate([this.returnUrl]);
        },
        error => {
          if (error.status === 400 || error.status === 401) {
            this.snackBar.warn('Invalid login');
          }
        }
      );
    }
  }
}
