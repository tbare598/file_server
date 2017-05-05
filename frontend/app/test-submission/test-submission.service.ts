import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Http } from '@angular/http';

import { APIService } from '../api/api.service';
import { TestSubmissionModel } from './test-submission';

@Injectable()
export class TestSubmissionService {

    constructor(private http: Http,
                private apiService: APIService) {}
    
    submitTest(testSubmission: TestSubmissionModel): Promise<string> {
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      
      return this.http.post(this.apiService.getSubmitTest, JSON.stringify(testSubmission), options)
             .toPromise()
             .then(res => res.json().error);
    }
}
