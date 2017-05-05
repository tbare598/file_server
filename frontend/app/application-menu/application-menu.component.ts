import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { QueryAreaService } from '../query-area/query-area.service';
import { applicationMenuAnimations, FlyoutMenuItemModel } from './application-menu';
import { AutoSmoketestSystemModel } from '../auto-smoketest/auto-smoketest';
import { AutoSmoketestService } from '../auto-smoketest/auto-smoketest.service';
import { EnvironmentsService } from '../environments/environments';

@Component({
    selector: 'application-menu',
    templateUrl: 'app/application-menu/application-menu.component.html',
    styleUrls: ['app/application-menu/application-menu.component.css'],
    animations: applicationMenuAnimations
})
export class ApplicationMenuComponent implements OnInit, OnDestroy {

    private subs = [];
    private envFlyoutItems: FlyoutMenuItemModel[];
    private hoverOptions = {
      runTest:    { state: 'off' },
      submitTest: { state: 'off', selected: 'off', closing: false },
      viewTests:  { state: 'off', selected: 'off' },
      envs:       { state: 'off', selected: 'off', closing: false } };
    private systems: AutoSmoketestSystemModel[];
    private currSys: AutoSmoketestSystemModel;
    
    
    constructor(private router: Router,
                private environmentsService: EnvironmentsService,
                private autoSmoketestService: AutoSmoketestService,
                private queryAreaService: QueryAreaService,
                private route: ActivatedRoute) {
      if (this.router.url.indexOf('/viewtests') !== -1) {
        this.hoverOptions.viewTests.selected = 'on';
      }
    }
    
    clickViewTests() {
      this.hoverOptions.viewTests.selected = this.hoverOptions.viewTests.selected === 'on' ? 'off' : 'on';
      if (this.hoverOptions.viewTests.selected === 'on') {
        this.router.navigate([ this.currSys.id, 'viewtests' ]);
      } else {
        this.router.navigate([ this.currSys.id ]);
      }
    }
    
    runTest() {
      this.queryAreaService.runQuery();
    }
    
    testSubmssionClick() {
      this.hoverOptions.submitTest.selected = this.hoverOptions.submitTest.selected === 'on' ? 'off' : 'on';
      this.hoverOptions.submitTest.closing = true;
    }
    
    testSubmssionFlyoutClickOutside() {
      if (!this.hoverOptions.submitTest.closing) {
        this.hoverOptions.submitTest.selected = 'off';
      }
      
      this.hoverOptions.submitTest.closing = false;
    }
    
    trackByEnvs(index: number, env: any) {
      return env.id;
    }
    
    trackByAppIds(index: number, system: AutoSmoketestSystemModel) {
      return system.id;
    }
    
    envsClick() {
      this.hoverOptions.envs.selected = this.hoverOptions.envs.selected === 'on' ? 'off' : 'on';
      this.hoverOptions.envs.closing = true;
    }
    
    envsFlyoutClickOutside() {
      if (!this.hoverOptions.envs.closing) {
        this.hoverOptions.envs.selected = 'off';
      }
      
      this.hoverOptions.envs.closing = false;
    }
    
    envModelChange() {
      this.environmentsService.envModel = {
        envs:
          this.envFlyoutItems.map(env => {
            return {
              id:       env.id,
              name:     env.name,
              checked:  env.value };
          })
      };
    }

    ngOnInit() {
      this.subs.push(this.environmentsService.envModel$.subscribe(
        envModel => {
          this.envFlyoutItems = envModel.envs.map(env => {
           return {
              id:       env.id,
              name:     env.name,
              value:    env.checked };
          });
        }
      ));
      this.subs.push(this.autoSmoketestService.currSystem$.subscribe(
        newSys => this.currSys = newSys)
      );
      this.systems = this.autoSmoketestService.systems;
    }

    ngOnDestroy() {
      this.subs.forEach(sub => sub.unsubscribe());
    }
    
    changeCurrSystem(newSysId) {
      let currSysId = this.currSys.id;
      if (newSysId !== currSysId) {
        let reSysUrl = new RegExp('(^/' + currSysId + ')(/)|(^/' + currSysId + '$)');
        let newURL = this.router.url.replace(reSysUrl, newSysId + '$2');
        this.router.navigate([ newURL ]);
      }
    }
}
