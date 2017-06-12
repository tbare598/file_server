import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Http, RequestOptions, Headers, ResponseContentType } from '@angular/http';
import { environment } from '../../environments/environment';
import { StaticPathTypeGETResModel, StaticFileGETResModel, DirectoryListingGETResModel } from './api';
import { Auth } from '../auth/auth.service';
import 'rxjs/add/operator/map';

@Injectable()
export class APIService {
    private _host: string = environment.apiHost;


    constructor(private http: Http,
                private route: ActivatedRoute,
                private auth: Auth) {
    }

    get host(): string{
      return this._host;
    }

    getPathType(dirPath: string): Observable<StaticPathTypeGETResModel> {
      return this.jsonGetRequest('static/type' + dirPath);
    }

    getFile(filePath: string): Observable<StaticFileGETResModel> {
      return this.fileGetRequest('static/file' + filePath)
        .map((fileBlob: Blob) => ({ data : fileBlob }) );
    }

    getDirectoryListing(dirPath: string): Observable<DirectoryListingGETResModel> {
      return this.jsonGetRequest('static/directory' + dirPath);
    }

    private fileGetRequest(uri: string): Observable<Blob> {
      const authHeader: Headers = new Headers();
      authHeader.append('Authorization', 'Bearer ' + this.auth.accessToken + ' ' + this.auth.idToken);

      const reqOptions: RequestOptions = new RequestOptions({
        headers: authHeader,
        responseType: ResponseContentType.Blob
      });
      return this.http.get(this.host + '/' + uri, reqOptions)
        .map(resp => {
          const contentType = resp.headers.get('content-type');
          return new Blob([resp.blob()], { type: contentType });
        });
    }


    private jsonGetRequest(uri: string): Observable<any> {
      const authHeader: Headers = new Headers();
      authHeader.append('Authorization', 'Bearer ' + this.auth.accessToken + ' ' + this.auth.idToken);
      const reqOptions: RequestOptions = new RequestOptions({
        headers: authHeader
      });
      return this.http.get(this.host + '/' + uri, reqOptions)
        .map(resp => resp.json());
    }



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
