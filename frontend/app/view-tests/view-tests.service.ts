import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { TestModel, ViewTestsModel, ViewTestsDataTableModel } from './view-tests';
import { QueryAreaService } from '../query-area/query-area';
import { QueryResultsService } from '../query-results/query-results';
import { APIService } from '../api/api.service';
import { EnvironmentsService, EnvironmentsModel } from '../environments/environments';

@Injectable()
export class ViewTestsService {

    private envModel: EnvironmentsModel;
    private _dataTableResults$: BehaviorSubject<ViewTestsDataTableModel>;
    private _currTest$: BehaviorSubject<TestModel>;
    private dataStore: {
      testData: ViewTestsDataTableModel,
      currTest: TestModel
    };

    constructor(private http: Http,
                private environmentsService: EnvironmentsService,
                private queryResultsService: QueryResultsService,
                private queryAreaService: QueryAreaService,
                private apiService: APIService) {
      
      this.environmentsService.envModel$.subscribe(newEnvModel => {
        this.envModel = newEnvModel;
      });
      this.dataStore = { testData: null, currTest: null };
      this._dataTableResults$ = <BehaviorSubject<ViewTestsDataTableModel>>new BehaviorSubject<ViewTestsDataTableModel>(null);
      this._currTest$ = <BehaviorSubject<TestModel>>new BehaviorSubject<TestModel>(null);
    }
    
    get dataTableResults$(): Observable<ViewTestsDataTableModel>{
      return this._dataTableResults$.asObservable();
    }
    
    get currTest$(): Observable<TestModel>{
      return this._currTest$.asObservable();
    }
    
    updateEnvs(envs: any[]) {
      this.dataStore.testData.updateEnvTests(envs);
    }
    
    runTest(context: any, testId: string) {
      context.envModel.envs.filter(env => env.checked).forEach(env => {
        context.dataStore.testData.updateTest(testId, env.id, 'RUNNING');
        
        return this.apiService.runCycleByTestId(env.id, testId)
          .subscribe(res => {
              context.dataStore.testData.updateTest(
                res.data.results[0].test_id.toString(),
                res.data.env,
                res.data.results[0].results.status_id);
          });
      });
    }
    
    loadResults(): Promise<any> {
      return new Promise((resolve, reject) => {
        this.dataStore.testData = new ViewTestsDataTableModel();
        
        this.apiService.getViewTests
          .subscribe(res => {
            this.dataStore.testData = this.convertToDataTable(res);
            this.updateEnvs(this.envModel.envs);
            this._dataTableResults$.next(this.dataStore.testData);
            resolve();
          });
      });
    }
    
    convertToDataTable(resultsObj: ViewTestsModel): ViewTestsDataTableModel {
      let context = this;
      return new ViewTestsDataTableModel(
        resultsObj,
        (testId, env) => context.runTest(context, testId),
        (testId) => context.loadTest(testId)
      );
    }
    
    loadTest(testId: string) {
      let context = this;
      context.dataStore.currTest = new TestModel();
      
      if (testId != null) {
        context.apiService.getTest(testId)
          .subscribe(res => {
              context.dataStore.currTest = res.test;
              if (context.dataStore.currTest.testType === 'QUERY') {
                context.queryAreaService.queryText = context.dataStore.currTest.testObj;
                context.queryResultsService.loadResults(null);
              }
              context._currTest$.next(context.dataStore.currTest);
          });
      } else {
        context._currTest$.next(context.dataStore.currTest);
      }
    }
}
