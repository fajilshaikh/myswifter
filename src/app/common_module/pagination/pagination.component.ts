import { Component,Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  @Input() CurrentPage: number | any;
  @Input() TotalPage: number | any ;
  @Input() TotalRecord: number | any; // New input property
  @Input() PerPage: number | any;

  @Output() onPageChanges = new EventEmitter<string>();
  @Output() PerPageSet = new EventEmitter<string>();

  constructor() { }

  OnPagenation(type: string): void {
    this.onPageChanges.emit(type);
  }

  calculateRange(): string {
    const start = (this.CurrentPage - 1) * this.PerPage + 1;
    const end = Math.min(this.CurrentPage * this.PerPage, this.TotalRecord);
    return `${start}-${end}`;
  }

  PerPageValueSet(value: any): void {
    this.PerPageSet.emit(value);
  }
}
