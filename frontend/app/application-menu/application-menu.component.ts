import { Component }  from '@angular/core';
import { Auth } from '../auth/auth.service';

@Component({
    selector: 'application-menu',
    templateUrl: 'app/application-menu/application-menu.component.html',
    styleUrls: ['app/application-menu/application-menu.component.css']
})
export class ApplicationMenuComponent {
    constructor(private auth: Auth) {}
}
