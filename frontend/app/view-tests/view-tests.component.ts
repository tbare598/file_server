import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViewTestsDataTableModel, TestModel } from './view-tests';
import { QueryAreaService } from '../query-area/query-area.service';
import { AutoSmoketestService } from '../auto-smoketest/auto-smoketest.service';
import { ViewTestsService } from './view-tests.service';
import { EnvironmentsService, EnvironmentsModel } from '../environments/environments';

@Component({
  selector: 'view-tests',
  templateUrl: 'app/view-tests/view-tests.component.html',
  styleUrls: ['app/view-tests/view-tests.component.css'],
  providers: [ ViewTestsService ]
})
     
export class ViewTestsComponent implements OnInit, OnDestroy {
    
    private subs = [];
    private results: ViewTestsDataTableModel;
    private currTest: TestModel;
    private envModel: EnvironmentsModel;
    private loading: boolean;
    
    constructor(private viewTestsService: ViewTestsService,
                private environmentsService: EnvironmentsService,
                private route: ActivatedRoute,
                private queryAreaService: QueryAreaService,
                private autoSmoketestService: AutoSmoketestService) {}
    
    hasTest() {
      return this.currTest && this.currTest.testId != null && this.currTest.testId !== '';
    }
    
    ngOnInit() {
      this.subs.push(
        this.viewTestsService.dataTableResults$.subscribe(value => {
          //null or undefined
          if (value != null) {
            this.results = value;
          }
        })
      );
      
      this.subs.push(
        this.viewTestsService.currTest$.subscribe(newTest => {
          //null or undefined
          if (newTest != null) {
            this.currTest = newTest;
          }
      }));
      
      this.subs.push(this.route.params.subscribe(params => {
        const TEST_ID = 'testId';
        if (params[TEST_ID] != null && params[TEST_ID] !== '') {
          this.loadTest(params[TEST_ID]);
        }
      }));
      
      this.subs.push(this.autoSmoketestService.currSystem$.subscribe(currSys => {
        this.loading = true;
        this.viewTestsService.loadResults().then(() => {
          this.loading = false;
        });
      }));
      
      this.environmentsService.envModel$.subscribe(newEnvModel => {
        let changedEnvs = newEnvModel.envs;
        if (this.envModel != null) {
          changedEnvs = newEnvModel.envs.filter(env => {
            for (let i = 0; i < this.envModel.envs.length; i++) {
              let oldEnv = this.envModel.envs[i];
              if (oldEnv.id === env.id) {
                return env.checked !== oldEnv.checked;
              }
            }
          });
        }
        this.viewTestsService.updateEnvs(changedEnvs);
        this.envModel = newEnvModel;
      });
    }
    
    ngOnDestroy() {
      this.envModel = null;
      this.subs.forEach(sub => sub.unsubscribe());
    }
    
    private loadTest(testId: string) {
      this.viewTestsService.loadTest(testId);
    }
}
