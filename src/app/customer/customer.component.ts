import { Component } from '@angular/core';
import { CustomerFilter } from '../_models/MasterModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../_helper/loader';
import { ApiService } from '../_services';
import { first } from 'rxjs';
import * as SN from '../_services/Services';
import { alertsService } from '../_helper/alert';
import { ConfirmDialogService } from '../common_module/confirm-dialog/confirm-dialog.service';


@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css'
})
export class CustomerComponent {
  CountyList: any = [];
  StateList: any = [];
  CityList: any = [];
  GetCustomerList: any = [];
  FormHeading: string = 'Add';
  FormButton: string = 'Save';

  CustomerForm: FormGroup | any;
  AddressDetailsForm: FormGroup | any;
  AddressFromdata: any = [];

  UpdateCustomerId: any;

  FilterData: CustomerFilter = new CustomerFilter();
  PerPage: number = 15;
  CurrentPage: number = 1;
  TotalPage: number | any;
  TotalRecord: number | any;
  IsPageFullyLoad: boolean = false;
  addressData: any = [];
  isEdit: boolean = false;
  Address: any = [];
  data: any;
  onselectaddress: any = [];
  countryName: any;
  countryid: any;
  stateName: any;
  stateid: any;
  cityName: any;
  cityid: any;
  editaddressData: any = [];
  CustomerFormData: any = [];
  nextId: number = 1;


  customertype = [
    { id: 1, name: 'Vendor' },
    { id: 2, name: 'Supplier' },
    { id: 3, name: 'Customer' },
  ];
  Customeraddress: any = [];
  constructor(
    private formBuilder: FormBuilder,
    private Apiservice: ApiService,
    private loader: LoaderService,
    private alert: alertsService,
    private confirmDialogService: ConfirmDialogService
    
  ) {}

  async ngOnInit() {
    this.CustomerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      lastName: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      customerType: ['', Validators.required],
      emailid: ['', [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]],
      countryCode: ['91', [Validators.required]],
      mobileNo: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      gstNo: [''],
      panNo: [''],
      Status: [true],
    });
    this.AddressDetailsForm = this.formBuilder.group({
      isPrime: [true],
      countryid: [''],
      stateid: [''],
      cityid: [''],
      selectedCountry: ['', Validators.required],
      selectedState: ['', Validators.required],
      selectedCity: ['', Validators.required],
      Address: ['', Validators.required],
      ZipCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });
    console.log(this.customertype);

    await this.GetCountry();
    await this.GetCustomerData();
  }
  // COUNT FILTER
  CountAppliedFilters(): number {
    return Object.values(this.FilterData).filter(value => value !== '').length;
  }
  OnPagenation(Type: string) {
    switch (Type) {
      case 'First':
        this.CurrentPage = 1;
        break;
      case 'Last':
        this.CurrentPage = this.TotalPage;
        break;
      case 'Previous':
        if (this.CurrentPage > 1) this.CurrentPage = this.CurrentPage - 1;
        break;
      case 'Next':
        if (this.TotalPage > this.CurrentPage)
          this.CurrentPage = this.CurrentPage + 1;
        break;

      default:
        break;
    }
    this.GetCustomerData();
  }
  async editAddressData(data: any, id: any) {
    this.isEdit = true;
    this.editaddressData = data
    await this.GetCountry()
    await this.oncountry(data.CountryId)
    await this.onState(data.StateId)

    console.log("country....", data);
    if (data.IsPrimary == '1') {
      this.AddressDetailsForm.get('isPrime')?.patchValue(true);
    }
    if (data.IsPrimary == '0') {
      this.AddressDetailsForm.get('isPrime')?.patchValue(false);
    }
    console.log('dataadrees', data);

    this.data = id;

    this.AddressDetailsForm.patchValue({
      countryid: data.CountryId,
      stateid: data.StateId,
      cityid: data.CityId,
      selectedCountry: data.CountryName,
      selectedState: data.StateName,
      selectedCity: data.CityName,
      Address: data.Address,
      ZipCode: data.ZipCode,

    });
    this.onselectaddress = this.AddressDetailsForm.value;
  }

  async updateTableRow(id: number, newData: any) {
    console.log(id);

    const index = this.addressData.findIndex(
      (item: any) => item.CountryId === id
    );
    console.log(index);

    if (index !== -1) {
      this.addressData[index] = { ...this.addressData[index], ...newData };
      console.log('edi data', this.addressData);
      await this.ResetAddress()
    }
  }
  Save() {
    if (this.AddressDetailsForm.valid) {
      this.isEdit = false

      this.Address = this.AddressDetailsForm.value;
      //get country name

      console.log(this.Address);
      debugger;
      if (
        this.onselectaddress.selectedCountry !== this.Address.selectedCountry
      ) {
        let item: any;
        item = this.CountyList.filter((data: any) => {
          if (data.CountryId === this.Address.selectedCountry) {
            item = data.CountryName;
            return item;
          }
        });

        this.countryName = item[0].CountryName;
        this.countryid = this.Address.selectedCountry;
      } else {
        this.countryName = this.onselectaddress.selectedCountry;
        this.countryid = this.onselectaddress.countryid;
      }

      //get State name
      if (this.onselectaddress.selectedState !== this.Address.selectedState) {
        let sname: any;
        sname = this.StateList.filter((data: any) => {
          if (data.StateId === this.Address.selectedState) {
            sname = data.StateName;
            return sname;
          }
        });
        this.stateName = sname[0].StateName;
        this.stateid = this.Address.selectedState;
      } else {
        this.stateName = this.onselectaddress.selectedState;
        this.stateid = this.Address.stateid;
      }

      //get city name
      if (this.onselectaddress.selectedCity !== this.Address.selectedCity) {
        let cname: any;
        cname = this.CityList.filter((data: any) => {
          if (data.CityId === this.Address.selectedCity) {
            cname = data.CityName;
            return cname;
          }
        });
        this.cityName = cname[0].CityName;
        this.cityid = this.Address.selectedCity;
      } else {
        this.cityName = this.onselectaddress.selectedCity;
        this.cityid = this.Address.cityid;
      }

      const Status = this.AddressDetailsForm.get('isPrime');
      const Isprime = Status?.value ? 1 : 0;
      if (Isprime) {
        this.addressData.forEach((account: any) => (account.IsPrimary = 0));
      }
      const formData = {
        CountryName: this.countryName,
        CountryId: this.countryid,
        StateName: this.stateName,
        StateId: this.stateid,
        CityName: this.cityName,
        CityId: this.cityid,
        Address: this.Address.Address,
        ZipCode: this.Address.ZipCode,
        IsPrimary: Isprime,
      };
      this.updateTableRow(this.data, formData);
    } else {
      this.AddressDetailsForm.markAllAsTouched();
      return;
    }
  }
  /**customer data get  */
  async GetCustomerData() {
    this.loader.showLoader();
    let RequestData = {
      ...this.FilterData,
      PerPage: this.PerPage,
      PageNo: this.CurrentPage,
    };
    await this.Apiservice.CallService(SN.GetCustomerList, RequestData)
      .pipe(first())
      .subscribe(
        (resp: any) => {
          console.log(resp);
          this.GetCustomerList = resp.data.CustomerList;
          this.TotalPage = resp.data.TotalPage;
          this.TotalRecord = resp.data.TotalRecord;
          this.IsPageFullyLoad = true;

          this.loader.hideLoader();
        },
        (error: any) => {
          this.IsPageFullyLoad = true;

          this.loader.hideLoader();
          this.alert.showAlerts('Something went wrong', 'error')

        }
      );
  }
  async AddAddress() {
    // this.isEdit=false
    if (this.AddressDetailsForm.valid) {
      const Status = this.AddressDetailsForm.get('isPrime');
      const Isprime = Status?.value ? 1 : 0;
      this.AddressFromdata = this.AddressDetailsForm.value;
      if (this.isEdit) {
        this.deleteAddressData(this.editaddressData);
      }

      //get country name

      let item: any;
      item = this.CountyList.filter((data: any) => {
        if (data.CountryId === this.AddressFromdata.selectedCountry) {
          item = data.CountryName;
          return item;
        }
      });
      let countryName = item[0].CountryName;

      //get State name

      let sname: any;
      sname = this.StateList.filter((data: any) => {
        if (data.StateId === this.AddressFromdata.selectedState) {
          sname = data.StateName;
          return sname;
        }
      });
      let stateName = sname[0].StateName;

      //get city name

      let cname: any;
      cname = this.CityList.filter((data: any) => {
        if (data.CityId === this.AddressFromdata.selectedCity) {
          cname = data.CityName;
          return cname;
        }
      });
      let cityName = cname[0].CityName;
      const formData = {
        CountryName: countryName,
        CountryId: this.AddressFromdata.selectedCountry,
        StateName: stateName,
        StateId: this.AddressFromdata.selectedState,
        CityName: cityName,
        CityId: this.AddressFromdata.selectedCity,
        Address: this.AddressFromdata.Address,
        ZipCode: this.AddressFromdata.ZipCode,
        IsPrimary: Isprime,
      };
      console.log(formData);
      if (Isprime) {
        this.addressData.forEach((account: any) => (account.IsPrimary = 0));
      }

      this.addressData.push(formData);
      this.ResetAddress();

      console.log('address id ', this.addressData);

      // console.log("",formData.Country);
    } else {
      console.log('hiral');

      this.AddressDetailsForm.markAllAsTouched();
      return;
    }
  }
  async ResetAddress() {
    const initialFormValues = {
      countryid: null,
      stateid: null,
      cityid: null,
      selectedCountry: null,
      selectedState: null,
      selectedCity: null,
      Address: null,
      ZipCode: null,
    };
    this.AddressDetailsForm.reset(initialFormValues);
    this.data = ''
    this.isEdit = false

  }
  async EditDialog(data: any) {
    // console.log("edit.......delete",address);
    await this.GetCustomerData();
    
    const item = {
      selectedCountry: null,
      selectedState: null,
      selectedCity: null,
      Address: null,
      ZipCode: null,
    };
    this.AddressDetailsForm.reset(item);
    this.addressData=[]
    this.Customeraddress = [];
    // console.log('address', address);

    this.FormHeading = 'Update';
    this.FormButton = 'Update';

    this.UpdateCustomerId = parseInt(data.CustomerId);
    // this.addressData = [...address];
    // console.log("edit delete",this.addressData);
    

    this.CustomerForm.controls['firstName'].setValue(data.FirstName);
    this.CustomerForm.controls['lastName'].setValue(data.LastName);
    this.CustomerForm.controls['customerType'].setValue(data.CustomerType);
    this.CustomerForm.controls['emailid'].setValue(data.Email);
    this.CustomerForm.controls['countryCode'].setValue(data.MobileCode);
    this.CustomerForm.controls['mobileNo'].setValue(data.MobileNo);
    this.CustomerForm.controls['gstNo'].setValue(data.GSTIN);
    this.CustomerForm.controls['panNo'].setValue(data.PANNO);
    this.CustomerForm.controls['panNo'].setValue(data.PANNO);
    this.CustomerForm.controls['Status'].setValue(parseInt(data.Status));

    if (data.Address.length > 0) {
      // console.log('addressData', address);
      this.addressData = data.Address;
    }

    if (data.Status == '0')
      this.CustomerForm.controls['Status'].setValue(false);
    if (data.IsPrimary == '0')
      this.CustomerForm.controls['isPrime'].setValue(false);
  }
  PerPageValueSet(target: any) {
    this.CurrentPage = 1;
    this.PerPage = target.value;
    this.GetCustomerData();
  }
  DeleteCustomer(id: number): void {
    this.confirmDialogService.confirmThis(
      'Are you sure to delete selected Party?',
      () => {
        try {
          this.loader.showLoader();
          let req = { UpdateCustomerId: id };
          this.Apiservice.CallService(SN.DeleteCustomer, req)
            .pipe(first())
            .subscribe(
              (result: any) => {
                this.loader.hideLoader();
                this.GetCustomerData();
                this.alert.showAlerts(result.message, 'success');
              },
              (error: any) => {
                this.loader.hideLoader();
                this.alert.showAlerts(error.message, 'error');
              }
            );
        } catch (error) {
          console.error('An unexpected error occurred:', error);
        }
      },
      () => {}
    );
  }
  async oncountry(Id: any) {
    let fromdata = {
      CountryId: Id,
    };
    await this.Apiservice.CallService(SN.GetStateList, fromdata)
      .pipe(first())
      .subscribe(
        async (resp: any) => {
          this.StateList = resp.data.StateList;

          console.log('State', resp);
        },
        (error: any) => {}
      );
  }
  /**get city list */
  async onState(Id: any) {
    let fromdata = {
      StateId: Id,
    };
    await this.Apiservice.CallService(SN.GetCityList, fromdata)
      .pipe(first())
      .subscribe(
        async (resp: any) => {
          this.CityList = resp.data.CityList;

          console.log('State', resp);
        },
        (error: any) => {}
      );
  }
  async ClearFilter() {
    this.FilterData = new CustomerFilter();
    await this.GetCustomerData();

  }
  async closemodel() {
    this.ResetForm();
  }
  async ResetForm() {
    const initialFormValues = {
      firstName: null,
      lastName: null,
      emailid: null,
      mobileNo: null,
      gstNo: null,
      panNo: null,

    };
    (this.FormButton = 'Save'), (this.FormHeading = 'Add');
    this.CustomerForm.reset(initialFormValues);
    this.CustomerForm.get('countryCode')?.patchValue('91'),
      this.CustomerForm.get('Status')?.patchValue(true)
    this.AddressDetailsForm.reset();
    this.addressData = [];
    this.UpdateCustomerId = '';
    this.isEdit = false

  }
  async GetCountry() {
    await this.Apiservice.CallService(SN.GetCountryList)
      .pipe(first())
      .subscribe(
        async (resp: any) => {
          this.CountyList = resp.data.CountryList;
          // console.log("country",resp.data.CountryList);
        },
        (error: any) => {}
      );
  }
  /**get state list */
  async oncountryselect(Id: any) {
    let fromdata = {
      CountryId: Id,
    };
    await this.Apiservice.CallService(SN.GetStateList, fromdata)
      .pipe(first())
      .subscribe(
        async (resp: any) => {
          this.StateList = resp.data.StateList;
          this.AddressDetailsForm.get('selectedState')?.patchValue('');
          this.AddressDetailsForm.get('selectedCity')?.patchValue('');
          console.log('State', resp);
        },
        (error: any) => {}
      );
  }
  /**get city list */
  async onStateselect(Id: any) {
    let fromdata = {
      StateId: Id,
    };
    await this.Apiservice.CallService(SN.GetCityList, fromdata)
      .pipe(first())
      .subscribe(
        async (resp: any) => {
          this.CityList = resp.data.CityList;
          this.AddressDetailsForm.get('selectedCity')?.patchValue('');
          console.log('State', resp);
        },
        (error: any) => {}
      );
  }
  deleteAddressData(data: any) {
    const index = this.addressData.indexOf(data);
    if (index !== -1) {
      this.addressData.splice(index, 1);
    }
    console.log(index);


    console.log(this.addressData);

  }
  // ENTER NUMBER ONLY
  PressNumber(evt: any) {
    evt = evt ? evt : window.event;
    var charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode != 43 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  /**add Customer Data */
  OnSubmit() {
    console.log(this.CustomerForm.value);
    if (this.CustomerForm.valid && this.addressData.length > 0) {
      this.loader.showLoader();
      this.CustomerFormData = this.CustomerForm.value;
      this.CustomerForm.value.UpdateCustomerId =
        this.CustomerForm.value.UpdateCustomerId == undefined ||
          this.CustomerForm.value.UpdateCustomerId == ''
          ? '0'
          : this.CustomerForm.value.UpdateCustomerId;

      const data = this.CustomerForm.get('Status');
      console.log('value', this.CustomerForm.value);
      if (data) {
        const Status = data?.value ? 1 : 0;
        const formData = {
          UpdateCustomerId: this.UpdateCustomerId,
          FirstName: this.CustomerFormData.firstName,
          LastName: this.CustomerFormData.lastName,
          CustomerType: this.CustomerFormData.customerType,
          Email: this.CustomerFormData.emailid,
          MobileCode: this.CustomerFormData.countryCode,
          MobileNo: this.CustomerFormData.mobileNo,
          Status: Status,
          GSTIN: this.CustomerFormData.gstNo,
          PANNO: this.CustomerFormData.panNo,
          Address: this.addressData,
        };
        console.log('form data', formData);

        this.Apiservice.CallService(SN.AddCustomer, formData)
          .pipe(first())
          .subscribe(
            async (resp: any) => {

              this.UpdateCustomerId = '';

              if (resp.status == '1') {
                this.loader.hideLoader();
                await this.GetCustomerData();
                this.ResetForm();
                this.closemodel();
                this.nextId = 1;
                this.loader.ModalClose('addnew');
                this.alert.showAlerts(resp.message, 'success');
              } else {
                this.loader.hideLoader();
                this.alert.showAlerts(resp.message, 'warning');
              }
            },
            (error: any) => {
              this.loader.hideLoader();
              this.alert.showAlerts(error.message, 'error');
            }
          );
      }
    } else {
      this.CustomerForm.markAllAsTouched();
      if (this.addressData.length == 0) {
        this.AddressDetailsForm.markAllAsTouched();
      }
      return;
    }
  }
  selectedcomtpe: any = '';

  comtpes = [
    { id: 1, name: 'Surat' },
    { id: 2, name: 'Ahmedabad' },
    { id: 3, name: 'Rajkot' },
    { id: 4, name: 'Navsari' },
  ];

  selectedcenfup: any = '';

  cenfups = [
    { id: 1, name: 'Surat' },
    { id: 2, name: 'Ahmedabad' },
    { id: 3, name: 'Rajkot' },
    { id: 4, name: 'Navsari' },
  ];

  selectedstate: any = '';

  states = [
    { id: 1, name: 'Surat' },
    { id: 2, name: 'Ahmedabad' },
    { id: 3, name: 'Rajkot' },
    { id: 4, name: 'Navsari' },
  ];

  selectedcity: any = '';

  citys = [
    { id: 1, name: 'Surat' },
    { id: 2, name: 'Ahmedabad' },
    { id: 3, name: 'Rajkot' },
    { id: 4, name: 'Navsari' },
  ];

  selectedstatus: any = '';

  statuss = [
    { id: 1, name: 'Surat' },
    { id: 2, name: 'Ahmedabad' },
    { id: 3, name: 'Rajkot' },
    { id: 4, name: 'Navsari' },
  ];

  selectedctrtyp: any = '';

 

  selectedmono: any = '+91';

  monos = [
    { id: 1, name: '+91' },
    { id: 2, name: '+92' },
    { id: 3, name: '+93' },
    { id: 4, name: '+94' },
  ];
}
