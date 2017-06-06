import { Component, OnInit, OnDestroy } from '@angular/core';
import { ElementRef, ViewChild }  from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { APIService } from '../api/api.service';
import { StaticFileGETResModel } from '../api/api';
import { FileListService } from './file-list';
import { Subscription } from 'rxjs/Subscription';
import { FileListModel } from '../file-list/file-list';


@Component({
    selector: 'file-list',
    templateUrl: 'app/file-list/file-list.component.html',
    styleUrls: ['app/file-list/file-list.component.css']
})
export class FileListComponent implements OnInit, OnDestroy {

  @ViewChild('downloadLink')
  downloadLink: ElementRef;

  subs: Subscription[] = [];
  fileListModel: FileListModel = new FileListModel();
  downloadingFile: string;

  get currDir(): string {
    return this.fileListService.currDirPath;
  }

  set currDir(newPath) {
    this.fileListService.currDirPath = newPath;
  }

  constructor(private fileListService: FileListService,
              private route: ActivatedRoute,
              private apiService: APIService,
              private sanitizer: DomSanitizer) {}

  public sanitizeUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  public downloadFile(filename: string) {
    let fileToGet = this.currDir === '/' ? '/' + filename : this.currDir + '/' + filename;
    this.downloadingFile = filename;

    this.apiService.getFile(fileToGet)
      .subscribe((fileBlob: StaticFileGETResModel) => {
        let downloadUrl: string = URL.createObjectURL(fileBlob.data);
        this.downloadLink.nativeElement.href = downloadUrl;
        this.downloadLink.nativeElement.click();
        window.URL.revokeObjectURL(downloadUrl);
      });
  }

  ngOnInit() {
    this.subs.push(this.fileListService.fileList$.subscribe(
        (fileListModel: FileListModel) => this.fileListModel = fileListModel
    ));

    this.route.url.subscribe((url: UrlSegment[]) => console.log(url));
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

}
