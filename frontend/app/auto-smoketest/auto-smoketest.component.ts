import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoSmoketestSystemModel } from './auto-smoketest';
import { AutoSmoketestService } from './auto-smoketest.service';
import { EnvironmentsService } from '../environments/environments.service';

@Component({
    selector: 'auto-smoketest',
    templateUrl: 'app/auto-smoketest/auto-smoketest.component.html',
    styleUrls: ['app/auto-smoketest/auto-smoketest.component.css']
})
export class AutoTestComponent implements OnInit, OnDestroy {

    private subs = [];
    
    constructor(private route: ActivatedRoute,
                private router: Router,
                private autoSmoketestService: AutoSmoketestService,
                private environmentsService: EnvironmentsService) {
    }
    
    ngOnInit() {
      this.subs.push(this.route.params.subscribe(params => {
        let SYSTEM_ID = 'systemId';
        let sysId = params[SYSTEM_ID];
        
        if (sysId == null) {
          this.autoSmoketestService.loadSystems()
            .then(systemList => this.router.navigate([systemList[0].id]) );
        } else {
          let currSysId = this.autoSmoketestService.currSystem.id;
          
          if (currSysId == null || currSysId === '' || currSysId !== sysId) {
            this.autoSmoketestService.loadSystem(new AutoSmoketestSystemModel(sysId));
          }
        }
      }));
      
      this.subs.push(this.autoSmoketestService.currSystem$.subscribe(
        nextSystem => {
          if (nextSystem != null && nextSystem.id != null && nextSystem.id !== '') {
            if (this.autoSmoketestService.systems.length === 0) {
              this.autoSmoketestService.loadSystems(nextSystem.id).then(
                () => this.environmentsService.loadEnvs() );
            } else {
              this.environmentsService.loadEnvs();
            }
          }
        }
      ));
    }

    ngOnDestroy() {
      this.subs.forEach(sub => sub.unsubscribe());
    }
}
