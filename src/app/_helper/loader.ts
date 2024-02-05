import { NgxSpinnerService } from 'ngx-spinner'
import { Injectable } from '@angular/core';
declare var $: any; // Declare jQuery

@Injectable({ providedIn: "root" })

export class LoaderService {

    constructor(private spinner: NgxSpinnerService) {

    }
    /**
     * show Loader
     */
    showLoader() {
        this.spinner.show();
    }
    /**
     * hide Loader
     */
    hideLoader() {
        this.spinner.hide();
    }

    /**
     * Modal Open
     * @param id id
     * @param Iscanvas  Iscanvas flag
     */
    ModalOpen(id: any, Iscanvas = false) {
        if (!Iscanvas) ($(`#${id}`) as any).modal('show');
        else ($(`#${id}`) as any).offcanvas('show');
    }
    /**
     * ModalClose
     * @param id  id
     * @param Iscanvas Iscanvas flag
     */
    ModalClose(id: any, Iscanvas = false) {
        if (!Iscanvas) ($(`#${id}`) as any).modal('hide');
        else ($(`#${id}`) as any).offcanvas('hide');
    }

    /**
     * Modal Open
     * @param id id
     * @param Iscanvas  Iscanvas flag
     */
    DisableModalOpen(id: any) {
        ($(`#${id}`) as any).modal({ backdrop: 'static', keyboard: false }, 'show');
    }
}