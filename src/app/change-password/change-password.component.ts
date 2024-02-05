import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../_services';
import { Router } from '@angular/router';
import { alertsService } from '../_helper/alert';
import { first } from 'rxjs';
import * as SN from '../_services/Services';
import * as MS from '../_services/Message';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  fieldTextType: boolean = false;
  fieldTextType1: boolean = false;
  fieldTextType2: boolean = false;
  ChangePasswordForm: FormGroup | any;

  constructor(
    private formbuilder: FormBuilder,
    private apiservice: ApiService,
    private router: Router,
    private alert: alertsService
  ) {

  }

  ngOnInit(): void {
    this.ChangePasswordForm = this.formbuilder.group({
      Oldpassword: [null, [Validators.required]],
      Newpassword: [null, [Validators.required, Validators.pattern(/^(?!.*\s)(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)]],
      Cnfpassword: [null, [Validators.required]],
    },
      {
        validators: [
          this.matchingPasswordsValidator('Newpassword', 'Cnfpassword'),
        ]
      }
    );
  }

  //FOR MATCHING PASSWORD
  matchingPasswordsValidator(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup) => {
      const password = group.controls[passwordKey];
      const confirmPassword = group.controls[confirmPasswordKey];
      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ matchingPasswords: true });
      } else {
        confirmPassword.setErrors(null);
      }
    };
  }

   //FOR SUBMIT FORM
   OnSubmitForm() {
    if (this.ChangePasswordForm.valid) {
      const formData = {
        EmplyOldPassword: this.ChangePasswordForm.get('Oldpassword')?.value,
        EmplyNewPassword: this.ChangePasswordForm.get('Newpassword')?.value,
        EmplyConfirmPassword: this.ChangePasswordForm.get('Cnfpassword')?.value,
      };
      this.apiservice.CallService(SN.UserChangePassword, formData).pipe(first()).subscribe((result: any) => {
        if (result.status == '1') {
          this.alert.showAlerts(MS.Changepassword, 'success');
          this.router.navigate(['/login']);
          localStorage.removeItem('lgusr');
          this.ChangePasswordForm.reset();
        } else {
          this.alert.showAlerts(MS.ChangepasswordError, 'error');
        }
      },
        (error: any) => {
          console.error('Error:', error);
        }
      );
    } else {
      this.ChangePasswordForm.markAllAsTouched();
      return;
    }
  }
}
