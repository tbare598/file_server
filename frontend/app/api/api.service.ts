import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Http, RequestOptions, Headers, ResponseContentType } from '@angular/http';
import { config } from '../config/config';
import { StaticFileGETResModel } from './api';
import { Auth } from '../auth/auth.service';
import 'rxjs/add/operator/map';

let host = config.apiHost;

@Injectable()
export class APIService {
    private _host: string = host;
    

    constructor(private http: Http,
                private route: ActivatedRoute,
                private auth: Auth) {
    }
    
    get host(): string{
      return this._host;
    }
    
    getFile(filePath: string): Observable<StaticFileGETResModel> {
      return this.fileGetRequest('static/file' + filePath)
        .map((fileBlob: Blob) => ({ data : fileBlob }) );
    }


    private fileGetRequest(uri: string): Observable<Blob> {
      let authHeader: Headers = new Headers();
      authHeader.append('Authorization', 'Bearer ' + this.auth.accessToken + ' ' + this.auth.idToken);

      let reqOptions: RequestOptions = new RequestOptions({
        headers: authHeader,
        responseType: ResponseContentType.Blob
      });
      return this.http.get(uri, reqOptions)
        .map(resp => {
          let contentType = resp.headers.get('content-type');
          return new Blob([resp.blob()], { type: contentType });
        });
    }

    
    // private jsonGetRequest(uri: string): Observable<any> {
    //   let authHeader: Headers = new Headers();
    //   authHeader.append('Authorization', 'Bearer ' + this.auth.accessToken + ' ' + this.auth.idToken);
    //   let reqOptions: RequestOptions = new RequestOptions({
    //     headers: authHeader
    //   });
    //   return this.http.get(uri, reqOptions)
    //     .map(resp => resp.json());
    // }


    
    // public runTest(env: string, req: TestRunPOSTReqModel): Observable<TestRunPOSTResModel> {
    //   return this.postRequest('test/run/' + env, req);
    // }
    
    // private postRequest(uri: string, obj: any): Observable<any> {
    //   let headers = new Headers({ 'Content-Type': 'application/json' });
    //   let options = new RequestOptions({ headers: headers });
    //   return this.http.post(uri, JSON.stringify(obj), options)
    //     .map(response => response.json());
    // }
}
