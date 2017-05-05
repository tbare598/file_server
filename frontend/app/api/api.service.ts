import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Http, RequestOptions, Headers } from '@angular/http';
import { config } from '../config/config';
import { AutoSmoketestService } from '../auto-smoketest/auto-smoketest.service';
import { DbEnvsGETResModel, TestRunPOSTReqModel , TestRunPOSTResModel , TestCyclePOSTResModel } from './api';

let host = config.apiHost;

@Injectable()
export class APIService {
    private _host: string = host;
    

    constructor(private autoSmoketestService: AutoSmoketestService,
                private http: Http,
                private route: ActivatedRoute) {
    }
    
    get host(): string{
      return this._host;
    }
    
    get systemId(): string{
      return this.autoSmoketestService.currSystem.id;
    }
    
    get getEnvs(): Observable<DbEnvsGETResModel>{
      return this.getRequest('test/envs');
    }
    
    get getSubmitTest(): string{
      return this.prefix() + 'test/submit';
    }
    
    get getViewTests(): any{
      return this.getRequest('test/stored');
    }
    
    public getTest(testId: string): any {//TODO:UPDATE any TO Observable
      return this.getRequest('test/stored/' + testId);
    }
    
    public runTest(env: string, req: TestRunPOSTReqModel): Observable<TestRunPOSTResModel> {
      return this.postRequest('test/run/' + env, req);
    }
    
    public runCycleByTestId(env, testId): Observable<TestCyclePOSTResModel> {
      return this.getRequest('test/cycle/run/' + env + '/' + testId);
    }
    
    getRequest(uri: string): Observable<any> {
      return this.http.get(this.prefix() + uri)
        .map(response => response.json());
    }
    
    postRequest(uri: string, obj: any): Observable<any> {
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post(this.prefix() + uri, JSON.stringify(obj), options)
        .map(response => response.json());
    }
    
    //TODO:RETURN PROMISE
    private prefix(): string {
      return this._host + '/' + this.systemId + '/';
    }
}
