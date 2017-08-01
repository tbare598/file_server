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
              private sanitizer: DomSanitizer) {}

  public sanitizeUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  public routeTo(path: string) {
    this.router.navigate([this.currDir, path]);
  }

  ngOnInit() {
    this.subs.push(this.fileListService.fileList$.subscribe(
        (fileListModel: FileListModel) => this.fileListModel = fileListModel
    ));

    this.route.url.subscribe((url: UrlSegment[]) => {
      if (url.length > 0) {
        let pathToCheck = '';
        url.forEach((urlSeg: UrlSegment) => pathToCheck += '/' + urlSeg.path);

        this.currDir = pathToCheck;
      } else {
        this.currDir = '/';
      }
    });
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
