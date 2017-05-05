import { Component, Output, EventEmitter,
         trigger, state, style, transition, animate, keyframes } from '@angular/core';
import { TestSubmissionModel } from './test-submission';
//ANGULAR PROBLEM WITH IMPORTING INJECTABLES FROM ANOTHER EXPORTING FILE
//THAT'S WHY THIS IS SEPARATE FROM ABOVE
import { TestSubmissionService } from './test-submission.service';
import { QueryAreaService } from '../query-area/query-area';

@Component({
    selector: 'test-submission',
    templateUrl: 'app/test-submission/test-submission.component.html',
    styleUrls: ['app/test-submission/test-submission.component.css'],
    animations: [
      trigger('submissionSuccessMsg', [
        state('noTests', style({
          transform: 'translateX(-200%)',
          opacity: 0
        })),
        state('testPassed', style({
          transform: 'translateX(0%)',
          opacity: 1
        })),
        state('nextTest', style({
          transform: 'translateX(200%)',
          opacity: 0
        })),
        transition('* => nextTest', animate('50ms ease-out')),
        transition('* => testPassed', [
          animate(100, keyframes([
            style({ transform: 'translateX(-200%)', opacity: 0, offset: 0 }),
            style({ transform: 'translateX(0%)',    opacity: 1, offset: 1 })
          ]))
        ])
      ])
    ]
})
export class TestSubmissionComponent {

    @Output() outsideModalClick = new EventEmitter();
    
    private testModel: TestSubmissionModel;
    private _fileList: string;
    private submissionFail = 'noTests';
    
    set fileList(value: string){
      this._fileList = value;
      this.testModel.files = value.match(/\S+/g);
    }
    
    get fileList(): string{
      return this._fileList;
    }
    
    constructor(private testSubmissionService: TestSubmissionService,
                private queryAreaService: QueryAreaService) {
      this.testModel = new TestSubmissionModel();
      this.testModel.testType = 'QUERY';
      this.testModel.expectedResults = {
        metaData : [{ name: 'TEST' } ], rows: [[ 'PASS' ]]
      };
    }
    
    submitTest(submitEvent) {
      if (this.submissionFail === 'testPassed') {
        this.submissionFail = 'nextTest';
      }
      
      submitEvent.preventDefault();
      this.testModel.test = this.queryAreaService.queryText;
      this.testSubmissionService.submitTest(this.testModel).then(
        error => {
          if (error === '') {
            this.submissionFail = 'testPassed';
          }
      });
    }
    
    clickedOutsideModal() {
      this.outsideModalClick.emit(null);
    }
}
