import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environments';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import * as CryptoJS from 'crypto-js';
import { LoginUser } from '../_models/login';
import { Observable } from 'rxjs';
import { alertsService } from '../_helper/alert';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  percentDone: any = "";
  public currentUser: Observable<LoginUser> | any;
  pipe = new DatePipe('en-US');
  Headers = {
    'id': 'GITIGNORE',
    'password': 'Y4vYeF>lg955_yvd1N',
    'secret':  'rvEDFrqRzbMLnB7em37krR35b16M5z1x0z/O9EoAmOw='
  };
  constructor(
    private http: HttpClient,
    private alert: alertsService,
    private route: ActivatedRoute,
  ) { 
    let loginUser: any;
    if (typeof localStorage !== 'undefined') {
      loginUser = localStorage.getItem('loginUser');
    }
  }
  
    /**Get User Session data */
    get UserSession() {
      debugger
      if (typeof window !== 'undefined' && window.localStorage) {
        const LoginData = localStorage.getItem('lgusr');
        if (LoginData) {
          let userdata = this.DecryptObject(LoginData);
  
          if (userdata == 0) {
            localStorage.removeItem('loginUser');
            window.location.href = '/';
          } else {
            return userdata;
          }
        } else {
          localStorage.removeItem('loginUser');
          window.location.href = '/';
        }
      }
      debugger
      localStorage.removeItem('loginUser');
      window.location.href = '/';
    }

     /**
   * CallService
   * @param ServiceName ServiceName
   * @param ReqBody ReqBody
   * @param isForm isForm
   * @returns response
   */
  CallService(ServiceName: string, ReqBody: any = {}) {

    try {

      const allServiceName = ['/ForgotPassword', '/ChangeForgotPassword'];


      let Header = {};

      if (!allServiceName.includes(ServiceName)) {

        Header = {
          ...this.Headers,
          secret: this.UserSession.Token
        }
        ReqBody.Token = this.UserSession.Token;
        ReqBody.OutletId = this.UserSession.OutletId;
        ReqBody.EmployeeId = this.UserSession.EmployeeId;
        ReqBody.CompanyId = this.UserSession.CompanyId;
      } else {
        const Token = 'rvEDFrqRzbMLnB7em37krR35b16M5z1x0z/O9EoAmOw=';
        Header = {
          ...this.Headers,
          secret: Token
        }
        ReqBody.Token = Token;
      }

      const headers = new HttpHeaders(Header);

      // ReqBody.append('RoleID', user_info['RoleID']);
      let EncryptBody = { 'Request': this.EncryptObject(ReqBody) }
      // let EncryptBody = ReqBody

      return this.http.post<any>(environment.apiUrl + environment.Version + ServiceName, EncryptBody, { headers: headers })
        .pipe(map(
          data => {
            // console.log(data);
            const ApiResponce = this.DecryptObject(data['Response']);
            if (ApiResponce?.status == "2") {
              this.alert.sweetAlert(ApiResponce['message'], "error");
              setTimeout(() => {
                localStorage.removeItem('loginUser');
                window.location.href = '/';
              }, 1000);
            }
            return ApiResponce;
          }));
    }
    catch (error) {
      return error;
    }
  }

  
  /**
   * CallService
   * @param ServiceName ServiceName
   * @param ReqBody ReqBody
   * @param isForm isForm
   * @returns response
   */
  FileUpload(ServiceName: string, ReqBody: any = {}, FormReqBody: any = {}) {
    try {
      // Add necessary headers, including the secret token from user session
      const Header = {
        ...this.Headers,
        secret: this.UserSession.Token
      }
      const headers = new HttpHeaders(Header);



      // Add common properties to the request body
      ReqBody.Token = this.UserSession.Token;
      ReqBody.OutletId = this.UserSession.OutletId;
      ReqBody.EmployeeId = this.UserSession.EmployeeId;
      ReqBody.CompanyId = this.UserSession.CompanyId;

      // If FormReqBody is not empty, append encrypted ReqBody to it
      FormReqBody.append('Request', this.EncryptObject(ReqBody));
      // Make the POST request using HttpClient
      return this.http.post<any>(
        environment.apiUrl + environment.Version + ServiceName,
        FormReqBody,
        { headers: headers }
      ).pipe(
        map(data => {
          // Decrypt the response data
          const ApiResponse = this.DecryptObject(data['Response']);

          // Check if the status is not "1" and handle accordingly
          if (ApiResponse?.status !== "1") {
            // Handle error (e.g., show alerts, redirect, etc.)
          }

          return ApiResponse;
        })
      );
    } catch (error) {
      return error;
    }
  }

  /**
   * parameter master value
   * @param ServiceName ServiceName
   * @param ReqBody ReqBody
   * @param isForm isForm
   * @returns response
   */
  GetMasterData(MasterID: any) {
    try {

      const Headers = {
        ...this.Headers,
        secret: this.UserSession.Token
      }
      const headers = new HttpHeaders(Headers);
      let ReqBody: any = {};
      ReqBody.Token = this.UserSession.Token;
      ReqBody.OutletId = this.UserSession.OutletId;
      ReqBody.EmployeeId = this.UserSession.EmployeeId;
      ReqBody.CompanyId = this.UserSession.CompanyId;
      ReqBody.ParameterTypeId = MasterID;

      // ReqBody.append('RoleID', user_info['RoleID']);
      let EncryptBody = { 'Request': this.EncryptObject(ReqBody) }
      // let EncryptBody = ReqBody
      console.log(ReqBody);


      return this.http.post<any>(environment.apiUrl + environment.Version + '/GetParameterTypeValueList', EncryptBody, { headers: headers })
        .pipe(map(
          data => {
            // console.log(data);
            const ApiResponce = this.DecryptObject(data['Response']);
            return ApiResponce;
          }));
    }
    catch (error) {
      return error;
    }
  }
  /**
     * Login page
     * @param username inputed username
     * @param password inputed password
     * @param source inputed source
     * @param ip inputed ip
     * @param remember inputed remember flag
     * @param logintype inputed login type
     * @returns 
     */
  Login(ReqBody: any = {}) {
    try {

      const UserName = ReqBody.username;
      const remember = ReqBody.remember;
      const password = ReqBody.password;
      const ip = ReqBody.ip;
      const Token = 'rvEDFrqRzbMLnB7em37krR35b16M5z1x0z/O9EoAmOw=';
      

      // Define your headers
      const Headers = {
        ...this.Headers,
        secret: Token
      }
      const headers = new HttpHeaders(Headers);

      const body = {
        EmployeeEmailId: UserName,
        EmployeePassword: password,
        Ip: ip,
        remember: remember,
        Token: Token
      };
      //   console.log(body)
      let EncryptBody = { 'Request': this.EncryptObject(body) }
      return this.http.post<any>(environment.apiUrl + environment.Version + '/UserLogin', EncryptBody, { headers: headers })
        .pipe(map(data => {
          const LoginResponce = this.DecryptObject(data['Response']);
          console.log(LoginResponce);
          if (LoginResponce?.status == "1") {
            const LoginData = LoginResponce?.data?.EmployeeDetails;
            const Token = LoginResponce?.token;
            const localStore = {
              ...LoginData,
              "Token": Token
            }
            localStorage.setItem('lgusr', this.EncryptObject(localStore));
          }
          return LoginResponce;
        }));
    }
    catch (error) {
      console.log(error);
      return error;
    }
  }


  ForgerPasswordChange(ReqBody: any = {}) {
    try {

      const OutletId = ReqBody.OutletId;
      const EmployeeId = ReqBody.EmployeeId;
      const CompanyId = ReqBody.CompanyId;
      const NewPassword = ReqBody.NewPassword;
      const Token = 'rvEDFrqRzbMLnB7em37krR35b16M5z1x0z/O9EoAmOw=';

      // Define your headers
      const Headers = {
        ...this.Headers,
        secret: Token
      }
      const headers = new HttpHeaders(Headers);

      const body = {
        OutletId: OutletId,
        EmployeeId: EmployeeId,
        CompanyId: CompanyId,
        NewPassword: NewPassword,
        Token: Token
      };
      //   console.log(body)
      let EncryptBody = { 'Request': this.EncryptObject(body) }
      return this.http.post<any>(environment.apiUrl + environment.Version + '/ChangeForgotPassword', EncryptBody, { headers: headers })
        .pipe(map(data => {
          const LoginResponce = this.DecryptObject(data['Response']);
          console.log(LoginResponce);
          if (LoginResponce?.status == "1") {
            const LoginData = LoginResponce?.data?.EmployeeDetails;
            const Token = LoginResponce?.token;
            const localStore = {
              ...LoginData,
              "Token": Token
            }
            localStorage.setItem('lgusr', this.EncryptObject(localStore));
          }
          return LoginResponce;
        }));
    }
    catch (error) {
      console.log(error);
      return error;
    }
  }

  /**
   * Set date Format
   * @param Date Date
   * @param Format date Format
   * @returns format date
   */
  SetFormat(Date: any, Format = 'YYYY-MM-dd') {
    return this.pipe.transform(Date, Format);
  }

  /**
   * get Encrypt Object  data
   * @param Object Object data
   * @returns Encrypt Object
   */
  EncryptObject(Object: any) {
    let key = CryptoJS.enc.Utf8.parse(environment.SECRET_KEY);
    var IV_KEY = CryptoJS.enc.Utf8.parse(environment.IV_KEY);
    var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(JSON.stringify(Object).toString()), key, {
      keySize: 256,
      iv: IV_KEY,
      mode: CryptoJS.mode.CBC
    });
    return encrypted.toString();
  }

  /**
   * Get Decrypt Object data
   * @param EncryptObject  Object data
   * @returns  Decrypt Object
   */
  DecryptObject(EncryptObject: string) {
    try {
      let key = CryptoJS.enc.Utf8.parse(environment.SECRET_KEY);
      var IV_KEY = CryptoJS.enc.Utf8.parse(environment.IV_KEY);
      var decrypted = CryptoJS.AES.decrypt(EncryptObject, key, {
        keySize: 256,
        iv: IV_KEY,
        mode: CryptoJS.mode.CBC
      });
      return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
    } catch (error) {
      console.log("err======================", error);
      return 0;
    }
  }
  /**
   * Get QueryString data
   * @returns QString
   */
  GetQueryString() {
    let QString = {};
    this.route.queryParams.subscribe(params => { QString = params; });
    return QString;
  }
}
