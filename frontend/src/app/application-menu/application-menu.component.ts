import { Component } from '@angular/core';
import { Auth } from '../auth/auth.service';

@Component({
    selector: 'app-menu',
    templateUrl: './application-menu.component.html',
    styleUrls: ['./application-menu.component.css']
})
export class ApplicationMenuComponent {
    constructor(private auth: Auth) {}
}
