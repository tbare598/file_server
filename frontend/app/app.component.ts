import { Component, OnInit } from '@angular/core';
import { Auth } from './auth/auth.service';

@Component({
  selector: 'file-server-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [ Auth ]
})
     
export class AppComponent implements OnInit {
    constructor(private auth: Auth) {}

    ngOnInit() {
        console.log('loading AppComponent...');
    }
}
