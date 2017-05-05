import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

import { QueryResultsModel,
         QueryResultDataTableModel,
         QueryModel,
         TestResultModel } from './query-results';
import { DataTableModel } from '../data-table/data-table';
import { DataTableCellItemModel } from '../data-table/data-table-cell-item/data-table-cell-item';
import { TestRunPOSTResModel } from '../api/api';
import { APIService } from '../api/api.service';

@Injectable()
export class QueryResultsService {
    private _queryResults$: BehaviorSubject<QueryResultsModel>;
    private _results: QueryResultsModel;

    constructor(private apiService: APIService) {
      this._results = null;
      this._queryResults$ = <BehaviorSubject<QueryResultsModel>>
        new BehaviorSubject<QueryResultsModel>(this._results);
    }
    
    get queryResults$(): Observable<QueryResultsModel>{
      return this._queryResults$.asObservable();
    }
    
    loadResults(newResults: QueryResultsModel) {
      this._results = newResults;
      this._queryResults$.next(this._results);
    }
    
    loadQuery(queryModel: QueryModel) {
      let requests = queryModel.envs.map(env => {
        return {
          env: env,
          req: {
            id: env + '_1',
            data: {
              testObj:  queryModel.query,
              testType: 'QUERY'
            }
          }
        };
      });
      
      this._results = new QueryResultsModel();
      
      this.setEnvsToRunning(requests);
      requests.forEach(request => {
        this.apiService.runTest(request.env, request.req)
            .subscribe(res => this.loadQueryResult(res));
      });
    }
    
    setEnvsToRunning(reqs: any[]) {
      reqs.forEach(reqObj => {
        let newTestRes = new TestResultModel();
        newTestRes.queryId = reqObj.req.id;
        newTestRes.env = reqObj.env;
        newTestRes.result = 'RUNNING';
        this._results.testResults.push(newTestRes);
      });
       
      this._queryResults$.next(this._results);
    }
    
    
    loadQueryResult(resModel: TestRunPOSTResModel) {
      this._results.testResults = this._results.testResults.filter(
        testObj => testObj.queryId !== resModel.id);
      
      if (resModel.data.results.status_id !== 'ERROR') {
        let newTestResult = this.convertToTestResult(resModel);
        this._results.testResults.push(newTestResult);
      } else {
        let newDataTable = this.convertToDataTable(resModel);
        this._results.dataTables[newDataTable.queryId] = newDataTable;
      }
      
      this._queryResults$.next(this._results);
    }
    
    convertToDataTable(resModel: TestRunPOSTResModel): QueryResultDataTableModel {
      if (resModel.data.env == null
      || resModel.id == null) {
        return new QueryResultDataTableModel();
      }
      
      let resultsObj = resModel.data.results.run_status;
      let newDataTable = new DataTableModel();
      newDataTable.headerRow.sortCol = resultsObj.metaData[0].name;
      newDataTable.headerRow.sortDir = 'asc';
      
      newDataTable.headerRow.cells = resultsObj.metaData.map(result => {
        return {
          id: result.name,
          items: [ new DataTableCellItemModel('', result.name) ],
          cssClass: ''
        };
      });
      
      newDataTable.dataRows = resultsObj.rows.map(result => {
        return {
          id: '',
          cells: result.map(col => {
            return {
              id: null,
              items: [ new DataTableCellItemModel('', col) ],
              cssClass: ''
            };
          }),
          cssClass: ''
        };
      });
      
      return new QueryResultDataTableModel(resModel.id, resModel.data.env, newDataTable);
    }
    
    convertToTestResult(resultsObj: TestRunPOSTResModel): TestResultModel {
      let newTestRes = new TestResultModel();
      newTestRes.queryId = resultsObj.id;
      newTestRes.env = resultsObj.data.env;
      newTestRes.result = resultsObj.data.results.status_id;
      return newTestRes;
    }
    

}
