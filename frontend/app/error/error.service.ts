import { Injectable } from '@angular/core';
import { ErrorModel } from './error.model';
import { Router } from '@angular/router';

@Injectable()
export class ErrorService {

    constructor(private router: Router) { }

    Error(error: ErrorModel) {
        console.log('ERROR: ' + error.msg);
        this.router.navigate(error.redirect);
    }

}
