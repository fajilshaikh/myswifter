import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable() export class ConfirmDialogService {
    /** For confirm data  */
    private subject = new Subject<any>();

    /**Store confirm value */
    confirmThis(message: string, yesFn: () => void, noFn: () => void): any {
        this.setConfirmation(message, yesFn, noFn);
    }

    /** Set confirmation data */
    setConfirmation(message: string, yesFn: () => void, noFn: () => void): any {
        const that = this;
        this.subject.next({
            type: 'confirm',
            text: message,
            yesFn(): any {
                that.subject.next(void 0); // This will close the modal  
                yesFn();
            },
            noFn(): any {
                that.subject.next(void 0);
                noFn();
            }
        });

    }

    /**For get message value */
    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
} 