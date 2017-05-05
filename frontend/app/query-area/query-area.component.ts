import { Component, OnInit, OnDestroy } from '@angular/core';
import { QueryAreaService } from './query-area.service';
import { QueryResultsService } from '../query-results/query-results';

@Component({
    selector: 'query-area',
    templateUrl: 'app/query-area/query-area.component.html',
    styleUrls: ['app/query-area/query-area.component.css']
})

//TODO:FIX CTRL+Z AND CTRL+Y
export class QueryAreaComponent implements OnInit, OnDestroy {
    
    txtQueryId = 'txtQueryId';
    private queryText: string;
    private subs = [];
    
    constructor(private queryAreaService: QueryAreaService,
                private queryResultsService: QueryResultsService) {}
    
    setQueryText(newValue: string) {
      this.queryText = newValue;
      this.queryAreaService.queryText = newValue;
    }
    
    f5Pressed() {
      this.queryAreaService.runQuery();
    }
    
    printVal(val) {
      console.log(val);
    }
    
    ngOnInit() {
      this.subs.push(this.queryAreaService.queryText$
        .subscribe(newValue => this.queryText = newValue)
      );
    }

    ngOnDestroy() {
      this.subs.forEach(sub => sub.unsubscribe());
    }
}
