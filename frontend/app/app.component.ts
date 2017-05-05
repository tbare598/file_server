import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'smoketest-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css']
})
     
export class AppComponent implements OnInit {
    ngOnInit() {
        console.log('loading AppComponent...');
    }
}
