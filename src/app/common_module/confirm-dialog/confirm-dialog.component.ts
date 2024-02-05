import { Component, Input, OnInit } from '@angular/core';
import { ConfirmDialogService } from './confirm-dialog.service';

@Component({
    selector: 'app-confirm-dialog',
    templateUrl: 'confirm-dialog.component.html',
    styleUrls: ['confirm-dialog.component.css']
})

export class ConfirmDialogComponent implements OnInit {
    /**For message data  */
    message: any;
    constructor(
        private confirmDialogService: ConfirmDialogService
    ) { }

    /**
     * It is invoked only once when the directive is instantiated.
     */
    ngOnInit(): any {
        /** 
         *   This function waits for a message from alert service, it gets 
         *   triggered when we call this from any other component 
         */
        this.confirmDialogService.getMessage().subscribe(message => {
            this.message = message;
        });
    }
} 