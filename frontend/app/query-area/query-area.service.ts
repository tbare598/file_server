import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { EnvironmentsService, EnvironmentsModel } from '../environments/environments';
import { QueryResultsService, QueryModel } from '../query-results/query-results';
//TODO:ADD METHOD FOR SWITCHING BETWEEN APPLICATIONS
import { INITIAL_QUERY_TEXT } from './initial-query-text/initial-query-text.dm.mock';

@Injectable()
export class QueryAreaService {

    private _queryText$: BehaviorSubject<string>;
    private envModel: EnvironmentsModel;

    constructor(private queryResultsService: QueryResultsService,
                private environmentsService: EnvironmentsService) {
      this.environmentsService.envModel$.subscribe(
        newEnvModel => this.envModel = newEnvModel
      );
      this._queryText$ = <BehaviorSubject<string>>new BehaviorSubject<string>('');
      this._queryText$.next(INITIAL_QUERY_TEXT);
    }
    
    get queryText$(): Observable<string>{
      return this._queryText$.asObservable();
    }
    
    get queryText(): string {
      return this._queryText$.getValue();
    }
    

    set queryText(newQueryText: string) {
      //TODO:FIX THE DOUBLE SET QUERY TEXT
      // console.log('set queryText');
      this._queryText$.next(newQueryText);
    }

    runQuery() {
      let queryModel = new QueryModel(
        this.queryText,
        this.envModel.envs.filter(env => env.checked).map(env => env.id)
      );
      this.queryResultsService.loadQuery(queryModel);
    }
}
