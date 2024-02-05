import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../_services';
import { Router } from '@angular/router';
import { alertsService } from '../_helper/alert';
import { LoaderService } from '../_helper/loader';
import * as SN from '../_services/Services';
import * as MS from '../_services/Message';
import { first } from 'rxjs';
import { LoginSession } from '../_models/login';


@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrl: './myprofile.component.css'
})
export class MyprofileComponent {
  MyprofileForm: FormGroup | any;
  selectedFile: File | null = null;
  selectedpncode: any;
  pncodes: any;
  imagePreviewStyle: string | any;
  UserLogin: any;

  constructor(
    private formbuilder: FormBuilder,
    private apiservice: ApiService,
    private router: Router,
    private alert: alertsService,
    private loader: LoaderService,
  ) {

  }

  ngOnInit(): void {
    this.UserLogin = this.apiservice.UserSession;
    if (this.UserLogin.ProfileImage) {
      this.imagePreviewStyle = `url(${this.UserLogin.ProfileImage})`;
    } else {
      this.imagePreviewStyle = "url('../../assets/images/profile-pic.png')";
    }
    console.log(this.UserLogin);

    this.MyprofileForm = this.formbuilder.group({
      Name: [this.UserLogin.EmployeeName, [Validators.required, Validators.pattern("^[a-zA-Z][ a-zA-Z ]*$")]],
      Mobile: [this.UserLogin.MobileNo, [Validators.required, Validators.pattern("^[0-9]{7,12}$")]],
      selectedpncode: ['101', Validators.required],
      Email: [this.UserLogin.Email, [Validators.required, Validators.email]],
      Address: [this.UserLogin.Address, Validators.required],
      ZipCode: [this.UserLogin.ZipCode, [Validators.required, Validators.pattern("^[0-9]{6}$")]],
      files: [null,]
    })
    this.Phonecodelist();
  }

  // SELECT IMAGE
  onFileSelected(event: any): void {
    const selectedFile = event.target.files && event.target.files[0];
    if (selectedFile) {
      const fileType = selectedFile.type;
      // File type is an image
      if (fileType.match(/^image\//)) {
        this.selectedFile = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreviewStyle = `url(${e.target.result})`;
        };
        reader.readAsDataURL(selectedFile);
      } else {
        // File type is not an image
        this.alert.showAlerts(MS.ImageType, 'error');
      }
    }
  }

  Phonecodelist() {
    this.apiservice.CallService(SN.GetCountryList).pipe(first()).subscribe((result: any) => {
      this.pncodes = result.data.CountryList;
    })
  }

  onselectedpncode() {
    this.selectedpncode = this.MyprofileForm.get('selectedpncode')?.value
  }

  // ENTER ONLY NUMBER
  PressNumber(evt: any) {
    evt = evt || window.event;
    var charCode = evt.which || evt.keyCode;
    if (charCode < 48 || charCode > 57) {
      return false;
    }
    return true;
  }

  OnSubmit() {
    if (this.MyprofileForm.valid) {
      this.loader.showLoader();
      const MyProfileformData = {
        ProfileImage: this.selectedFile === null ? this.imagePreviewStyle : this.selectedFile,
        EmplyName: this.MyprofileForm.get('Name')?.value,
        EmplyContactNo: this.MyprofileForm.get('Mobile')?.value,
        EmplyEmailId: this.MyprofileForm.get('Email')?.value,
        EmplyAddress: this.MyprofileForm.get('Address')?.value,
        EmplyZipcode: this.MyprofileForm.get('ZipCode')?.value
      };
      const formdata = new FormData()
      formdata.append("ProfileImage", this.selectedFile === null ? this.imagePreviewStyle : this.selectedFile);

      this.apiservice.FileUpload(SN.UpdateUserProfile, MyProfileformData, formdata).pipe(first()).subscribe((result: any) => {
        this.loader.hideLoader();
        if (result.status == '1') {
          this.alert.showAlerts(result.message, 'success');
          const data = result.data;
          localStorage.removeItem('lgusr');
          const UserSession: LoginSession = {
            ...data.UpdatedProfileData,
            'Token': result.token,
          }
          localStorage.setItem('lgusr', this.apiservice.EncryptObject(UserSession));
          this.MyprofileForm.reset();
          this.router.navigate(['/company']);
        } else {
          this.alert.showAlerts(result.message, 'error');
          console.warn('Error response')
        }
      },
        (error: any) => {
          this.loader.hideLoader();
          console.error('Error:', error);
        }
      );
    } else {
      this.loader.hideLoader();
      this.MyprofileForm.markAllAsTouched();
      return;
    }
  }
}