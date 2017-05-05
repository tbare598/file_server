import { Component, OnInit, OnDestroy } from '@angular/core';
import { QueryResultsModel, QueryResultsService } from './query-results';

@Component({
  selector: 'query-results',
  templateUrl: 'app/query-results/query-results.component.html',
  styleUrls: ['app/query-results/query-results.component.css']
})
     
export class QueryResultsComponent implements OnInit, OnDestroy {
    
    private subs = [];
    private results: QueryResultsModel;
    private closed: { [ btnId: string ] : boolean };
    
    constructor(private queryResultsService: QueryResultsService) {
      this.results = new QueryResultsModel();
      this.closed = {};
    }
    
    ngOnInit() {
      this.subs.push(
        this.queryResultsService.queryResults$.subscribe(value => {
          this.results = value;
        })
      );
    }
    
    ngOnDestroy() {
      this.subs.forEach(sub => sub.unsubscribe());
    }
    
    getKeys(obj: any) {
      if (obj) {
        return Object.keys(obj);
      } else {
        return [];
      }
    }
}
