import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../_helper/loader';
import { NavigationEnd, Router } from '@angular/router';
import { filter, first } from 'rxjs';
import { LoginResponse } from '../_models/login';
import * as SN from '../_services/Services';
import * as MS from '../_services/Message';
import { ApiService } from '../_services';
import { alertsService } from '../_helper/alert';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  fieldTextType: boolean = false;
  fieldTextType1: boolean = false;
  loginForm: FormGroup | any;
  submitted = false;
  LoginRemember: any = {};
  IsPage = 1;
  changePasswordForm: FormGroup | any;
  IsChangePasswordPage: boolean = false;
  LoginError: string | any;
  EmployeeId: any;
  OutletId: any;
  CompanyId: any;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private Loader: LoaderService,
    private router: Router,
    private alert: alertsService,
  ) {
    const queryData: any = this.apiService.GetQueryString();
    if (queryData?.fg) {
      this.IsPage = 2;
    } else if (queryData?.Session) {
      let Session = this.apiService.DecryptObject(decodeURIComponent(queryData?.Session));
      const providedDatetime = Session.ExpiredTime;
      const formattedDate = this.formatDateToYYYYMMDDHHmmss();

      if (providedDatetime < formattedDate) {
        console.log("URL has expired.");
        this.alert.showAlerts("URL has expired.", 'error');
        this.router.navigate(['/login'])
      } else {
        console.log("URL is still valid.");
        this.EmployeeId = Session.Id;
        this.OutletId = Session.OutletId;
        this.CompanyId = Session.CompanyId;
      }
      this.IsPage = 3;
    }
  }
  formatDateToYYYYMMDDHHmmss() {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    const formattedDate = `${year}${month}${day}${hours}${minutes}${seconds}`;
    return formattedDate;
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
    this.changePasswordForm = this.formBuilder.group({
      NewPassword: [null, [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)]],
      ConfirmPassword: [null, [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)]],
    });

    this.LoginRemember = typeof window !== 'undefined' ? localStorage.getItem('rein') : null
    // this.LoginRemember = localStorage.getItem('rein');
    if (this.LoginRemember) {
      const LoginData = JSON.parse(this.LoginRemember);
      this.loginForm.get('email')?.setValue(LoginData.username);
      this.loginForm.get('password')?.setValue(LoginData.password);
      this.loginForm.get('rememberMe')?.setValue(LoginData.remember);
    }
  }

  ngAfterViewInit() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      const queryData: any = this.apiService.GetQueryString();
      this.IsPage = 1;
      if (queryData?.fg) {
        this.IsPage = 2;
      } else if (queryData?.Session) {
        console.log(queryData?.Session);

        let Session = this.apiService.DecryptObject(JSON.stringify(queryData?.Session));
        console.log(Session);

        this.IsPage = 3;
      }
    });
  }

  /** For used Login user */
  login() {
    this.submitted = true;
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;
      const rememberMe = this.loginForm.value.rememberMe;
      const loginData: any = {
        username: email,
        password: password,
        remember: rememberMe,
      };

      if (rememberMe) {
        localStorage.setItem('rein', JSON.stringify(loginData));
      } else {
        localStorage.removeItem('rein');
      }

      this.apiService.Login(loginData).subscribe(
        (response: LoginResponse) => {
          console.log(response);

          if (response.status == '1') {
            this.alert.showAlerts(MS.Login, 'success');
            this.router.navigate(['/customer']);
          } else {
            this.LoginError = response.message;
          }
        },
        (error: any) => {
          console.log(error);
        }
      );
    }
  }

  ForgetEmail: string | any;
  ForgetSubmitted: boolean = false;
  /** For used forget password */
  ForgetPassword() {
    this.ForgetSubmitted = true;
    if (!this.ForgetEmail) {
      return;
    }
    this.Loader.showLoader();
    this.apiService.CallService(SN.ForgotPassword, { 'Email': this.ForgetEmail }).pipe(first()).subscribe((result: any) => {
      this.Loader.hideLoader();
      if (result.status === '1') {
        this.alert.showAlerts(result.message, 'success')
        this.ForgetEmail = "";
        this.ForgetSubmitted = false;
      } else {
        this.alert.showAlerts(result.message, 'error')
      }
    },
      (error: any) => {
        this.Loader.hideLoader();
      });
  }

  //Space Key is not Allowed when User Enter Passoword
  preventSpaces(event: KeyboardEvent): void {
    if (event.key === ' ') {
      event.preventDefault();
    }
  }

  changeForgotPassword() {
    try {
      this.submitted = true;

      if (this.changePasswordForm.valid) {
        const newPassword = this.changePasswordForm.value.NewPassword;
        const confirmPassword = this.changePasswordForm.value.ConfirmPassword;

        if (newPassword !== confirmPassword) {
          this.changePasswordForm.controls['ConfirmPassword'].setErrors({ matchingPasswords: true });
          return;
        } else {
          this.changePasswordForm.controls['ConfirmPassword'].setErrors(null);
          this.Loader.showLoader();
          const requestData = {
            NewPassword: newPassword,
            EmployeeId: this.EmployeeId,
            OutletId: this.OutletId,
            CompanyId: this.CompanyId,
          };

          this.apiService.CallService(SN.ChangeForgotPassword, requestData).pipe(first()).subscribe((result: any) => {
            this.Loader.hideLoader();

            if (result.status === '1') {
              this.changePasswordForm.reset();
              this.alert.showAlerts(result.message, 'success');
              this.router.navigate(['/login'])
            } else {
              this.alert.showAlerts(result.message, 'error');
            }
          }, (error: any) => {
            this.Loader.hideLoader();
            this.alert.showAlerts('Something went wrong', 'error');
          });
        }

      } else {
        this.changePasswordForm.markAllAsTouched();

      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  }
}
