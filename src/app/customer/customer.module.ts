import { NgModule } from '@angular/core';
import { CommonModule,NgFor } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerComponent } from './customer.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { PageModule } from '../common_module/page.module';
import { NgSelectModule } from '@ng-select/ng-select';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmDialogModule } from "../common_module/confirm-dialog/confirm-dialog.module";


@NgModule({
    declarations: [
        CustomerComponent,
    ],
    imports: [
        CommonModule,
        CustomerRoutingModule,
        PageModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        ConfirmDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule
    ]
})
export class CustomerModule { }
