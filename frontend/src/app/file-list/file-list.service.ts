import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FileListModel } from './file-list';
import { APIService } from '../api/api.service';
import { DirectoryListingGETResModel } from '../api/api';

@Injectable()
export class FileListService {
  private _fileList: FileListModel = new FileListModel();
  private _fileList$: BehaviorSubject<FileListModel> = new BehaviorSubject(this._fileList);
  private _currDirPath: string;

  get currDirPath(): string {
    return this._currDirPath;
  }

  set currDirPath(newPath: string) {
    this._currDirPath = newPath;
    this.apiService.getDirectoryListing(newPath).subscribe(
      (dirListModel: DirectoryListingGETResModel) => {
        this.fileList = dirListModel.data;
        const newPathArr = dirListModel.data.path;
        if (newPathArr.length > 0) {
          let constructedPath = '';
          newPathArr.forEach((segment: string) => {
            constructedPath += '/' + segment;
          });
          this._currDirPath = constructedPath;
        } else if (newPathArr.length === 0) {
          this._currDirPath = '/';
        }
      }
    );
  }

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
    this.currDirPath = '/';
  }
}
