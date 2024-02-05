import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TablePlaceholderComponent } from './table-placeholder.component';

const routes: Routes = [{ path: '', component: TablePlaceholderComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TablePlaceholderRoutingModule { }
