export class apiResponse {
    data: any;
    message: string | any;
    status: string | any;
    token: string | any;
}

export class Data<t>
{
    /**variable use for Data */
    Data: Array<t> | any;
}