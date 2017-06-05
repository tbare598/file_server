import { Injectable } from '@angular/core';
import { FileListModel } from './file-list';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { APIService } from '../api/api.service';
import { DirectoryListingGETResModel } from '../api/api';

@Injectable()
export class FileListService {
  private _fileList: FileListModel = new FileListModel();
  private _fileList$: BehaviorSubject<FileListModel> = new BehaviorSubject(this._fileList);

  get fileList(): FileListModel {
    return this._fileList;
  }

  set fileList(newList: FileListModel) {
      this._fileList = newList;
      this._fileList$.next(this._fileList);
  }

  get fileList$(): Observable<FileListModel> {
      return this._fileList$.asObservable();
  }

  constructor(private apiService: APIService) {
      //TODO:REPLACE '' WITH CURRENT DIRECTORY PATH
      this.apiService.getDirectoryListing('/.').subscribe(
        (dirListModel: DirectoryListingGETResModel) => this.fileList = dirListModel.data
      );
  }
}
