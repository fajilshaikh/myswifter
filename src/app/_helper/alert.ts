import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import { take } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class alertsService {
    /** variable use for style  */
    style = 'material';
    /** variable use for title  */
    title = 'Snotify title!';
    /** variable use for body  */
    body = 'Lorem ipsum dolor sit amet!';
    /** variable use for timeout  */
    timeout = 2000;
    /** variable use for progressBar  */
    progressBar = true;
    /** variable use for closeClick  */
    closeClick = true;
    /** variable use for newTop  */
    newTop = true;
    /** variable use for filterDuplicates  */
    filterDuplicates = false;
    /** variable use for backdrop  */
    backdrop = -1;
    /** variable use for dockMax  */
    dockMax = 8;
    /** variable use for blockMax  */
    blockMax = 6;
    /** variable use for pauseHover  */
    pauseHover = true;
    /** variable use for titleMaxLength  */
    titleMaxLength = 15;
    /** variable use for bodyMaxLength  */
    bodyMaxLength = 80;

    constructor(private toastr: ToastrService) {
    }

    /** Custom options */
    options: any = {
        timeOut: 3000,
        closeButton: true,
    }

    /**
     * Common function for alert message
     * @param message this message show for alert information
     * @param type info/error/success/warning
     */
    showAlerts(message: string, type: string): void {
        if (type == 'info')
            this.toastr.info(message, '', this.options);
        else if (type == 'error')
            this.toastr.error(message, '', this.options);
        else if (type == 'success')
            this.toastr.success(message, '', this.options);
        else if (type == 'warning')
            this.toastr.warning(message, '', this.options);
        else
            this.toastr.info(message, '', this.options);
    }

    /**
     * show Notification 
     * @param message Notification message
     * @param title Notification title
     * @param url Notification url
     */
    showNotification(message: string, title: string, url: string) {
        this.options.positionClass = 'toast-top-full-width';
        // this.options.disableTimeOut = true;
        this.toastr.success(message, title, this.options).onTap.pipe(take(1)).subscribe(() =>
            this.toasterClickedHandler(url)
        );
    }

    /**
     * toaster Clicked Handler
     * @param url  location href 
     */
    toasterClickedHandler(url: string) {
        location.href = `${url}`;
    }

    /**
     * Common function for alert message
     * @param message this message show for alert information
     * @param type info/error/success/warning
     */
    sweetAlert(message: string, type: string): void {
        if (type == 'info')
            this.toastr.info(message, '', this.options);
        else if (type == 'error') {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: message
            });
        }
        else if (type == 'success')
            this.toastr.success(message, '', this.options);
        else if (type == 'warning')
            this.toastr.warning(message, '', this.options);
        else
            this.toastr.info(message, '', this.options);
    }
}