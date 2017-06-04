import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule }   from '@angular/forms';
import { routes } from './app.routes';

import { AppComponent } from './app.component';
import { ApplicationMenuComponent } from './application-menu/application-menu';
import { FileServerComponent } from './file-server/file-server';
import { FileListComponent } from './file-list/file-list';
import { DataTableComponent } from './data-table/data-table';
import { DataTableCellItemComponent } from './data-table/data-table-cell-item/data-table-cell-item';
import { DropDownComponent } from './drop-down/drop-down.component';

import { IsUndefinedPipe } from './pipes/custom-pipes';

import { ClickOutsideDirective } from './click-outside.directive/click-outside.directive';
import { APIService } from './api/api.service';
import { FileServerService } from './file-server/file-server.service';
import { FileListService } from './file-list/file-list.service';


@NgModule({
  imports: [
    HttpModule,
    BrowserModule,
    FormsModule,
    routes ],
  declarations: [
    AppComponent,
    ApplicationMenuComponent,
    FileServerComponent,
    FileListComponent,
    DataTableComponent,
    DataTableCellItemComponent,
    DropDownComponent,
    ClickOutsideDirective,
    IsUndefinedPipe
  ],
  providers: [
    FileServerService,
    FileListService,
    APIService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
