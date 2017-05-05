import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule }   from '@angular/forms';
import { routes } from './app.routes';

import { AppComponent } from './app.component';
import { QueryAreaComponent } from './query-area/query-area';
import { ViewTestsComponent } from './view-tests/view-tests';
import { ApplicationMenuComponent } from './application-menu/application-menu';
import { AutoTestComponent } from './auto-smoketest/auto-smoketest';
import { TestSubmissionComponent } from './test-submission/test-submission';
import { QueryResultsComponent } from './query-results/query-results';
import { DataTableComponent } from './data-table/data-table';
import { DataTableCellItemComponent } from './data-table/data-table-cell-item/data-table-cell-item';
import { CodeMirrorComponent } from './code-mirror/code-mirror.component';
import { DropDownComponent } from './drop-down/drop-down.component';

import { IsUndefinedPipe } from './pipes/custom-pipes';

import { ClickOutsideDirective } from './click-outside.directive/click-outside.directive';
import { APIService } from './api/api.service';
import { EnvironmentsService } from './environments/environments';
import { QueryAreaService } from './query-area/query-area';
import { QueryResultsService } from './query-results/query-results';
import { TestSubmissionService } from './test-submission/test-submission.service';
import { AutoSmoketestService } from './auto-smoketest/auto-smoketest.service';
import { AutoSmoketestSystemResolve } from './auto-smoketest/auto-smoketest-system.resolve';


@NgModule({
    imports: [
    HttpModule,
    BrowserModule,
    FormsModule,
    routes ],
  declarations: [
    AppComponent,
    QueryAreaComponent,
    ViewTestsComponent,
    ApplicationMenuComponent,
    AutoTestComponent,
    TestSubmissionComponent,
    QueryResultsComponent,
    DataTableComponent,
    DataTableCellItemComponent,
    CodeMirrorComponent,
    DropDownComponent,
    ClickOutsideDirective,
    IsUndefinedPipe
  ],
  providers: [
    AutoSmoketestService,
    AutoSmoketestSystemResolve,
    APIService,
    EnvironmentsService,
    QueryAreaService,
    QueryResultsService,
    TestSubmissionService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
