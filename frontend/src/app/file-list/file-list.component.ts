import { Component, OnInit, OnDestroy } from '@angular/core';
import { ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { APIService } from '../api/api.service';
import { StaticPathTypeGETResModel, StaticFileGETResModel } from '../api/api';
import { FileListService } from './file-list';
import { Subscription } from 'rxjs/Subscription';
import { FileListModel } from '../file-list/file-list';
import { apiConstants } from '../api/api.constants';
import { Auth } from '../auth/auth.service';
import { UserProfileModel } from '../auth/user-profile.model';


@Component({
    selector: 'app-file-list',
    templateUrl: './file-list.component.html',
    styleUrls: ['./file-list.component.css']
})
export class FileListComponent implements OnInit, OnDestroy {

  @ViewChild('downloadLink')
  downloadLink: ElementRef;

  subs: Subscription[] = [];
  fileListModel: FileListModel = new FileListModel();
  currFile: string;
  private _currUrl: UrlSegment[];

  private get filePathPrefix(): string {
    return apiConstants.filePathPrefix;
  }

  private get currDir(): string {
    return this.fileListService.currDirPath;
  }

  private set currDir(newPath) {
    this.fileListService.currDirPath = newPath;
  }

  constructor(private fileListService: FileListService,
              private route: ActivatedRoute,
              private router: Router,
              private apiService: APIService,
              private sanitizer: DomSanitizer,
              private auth: Auth) {}

  public sanitizeUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  public routeTo(path: string) {
    this.router.navigate([this.currDir, path]);
  }

  private loadDirectory() {
      if (this._currUrl.length > 0) {
        let pathToCheck = '';
        this._currUrl.forEach(
          (urlSeg: UrlSegment) => pathToCheck += '/' + urlSeg.path
        );

        this.currDir = pathToCheck;
      } else {
        this.currDir = '/';
      }
  }

  ngOnInit() {
    this.subs.push(this.fileListService.fileList$
      .subscribe((fileListModel: FileListModel) => this.fileListModel = fileListModel));

    this.route.url.subscribe((url: UrlSegment[]) => {
      this._currUrl = url;
      this.loadDirectory()
    });

    this.auth.userProfile$
      .subscribe((userModel: UserProfileModel) => this.loadDirectory());
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
