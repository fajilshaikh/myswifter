import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablePlaceholderComponent } from './table-placeholder/table-placeholder.component';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from './pagination/pagination.component';


@NgModule({
  declarations: [TablePlaceholderComponent, PaginationComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
   exports: [
    PaginationComponent,
    TablePlaceholderComponent
],
})
export class PageModule { }
