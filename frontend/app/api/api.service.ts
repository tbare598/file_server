import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Http, RequestOptions, Headers } from '@angular/http';
import { config } from '../config/config';
import { DbEnvsGETResModel, TestRunPOSTReqModel , TestRunPOSTResModel , TestCyclePOSTResModel } from './api';
import 'rxjs/add/operator/map';

let host = config.apiHost;

@Injectable()
export class APIService {
    private _host: string = host;
    

    constructor(private http: Http,
                private route: ActivatedRoute) {
    }
    
    get host(): string{
      return this._host;
    }
    
    get getEnvs(): Observable<DbEnvsGETResModel>{
      return this.getRequest('test/envs');
    }
    
    get getViewTests(): any{
      return this.getRequest('test/stored');
    }
    
    public runTest(env: string, req: TestRunPOSTReqModel): Observable<TestRunPOSTResModel> {
      return this.postRequest('test/run/' + env, req);
    }
    
    public runCycleByTestId(env, testId): Observable<TestCyclePOSTResModel> {
      return this.getRequest('test/cycle/run/' + env + '/' + testId);
    }
    
    getRequest(uri: string): Observable<any> {
      return this.http.get(uri)
        .map(response => response.json());
    }
    
    postRequest(uri: string, obj: any): Observable<any> {
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post(uri, JSON.stringify(obj), options)
        .map(response => response.json());
    }
}
