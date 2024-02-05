export class LoginUser {
    /**variable user for UserID */
    UserID: Number | any
    /**variable user for UserName */
    UserName: string| any
    /**variable user for Email */
    Email: string| any
    /**variable user for RoleId */
    RoleId: Number| any
    /**variable user for Name */
    Name: string| any
    /**variable user for MobileNo */
    MobileNo: string| any
    /**variable user for Token */
    Token: string| any
    /**variable user for Remember */
    Remember: boolean| any
}
export interface LoginSession {
    CompanyId: string;
    CompanyName: string;
    Email: string;
    EmployeeId: string;
    EmployeeName: string;
    MobileNo: string;
    OutletId: string;
    OutletName: string;
    RoleId: string;
    Status: string;
    UserName: string;
    RoleName: string;
    ProfileImage: string;
    Currancy: string;
    token: string;
}
export interface LoginResponse {
    data: any;
    message: string;
    status: string;
    token: string;
}
