import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FileListService } from './file-list';
import { Subscription } from 'rxjs/Subscription';
import { FileListModel } from '../file-list/file-list';


//TODO: REMOVE
import { Http, Headers, ResponseContentType, RequestOptions }  from '@angular/http';
import { ElementRef, ViewChild }  from '@angular/core';
import { Auth } from '../auth/auth.service';


@Component({
    selector: 'file-list',
    templateUrl: 'app/file-list/file-list.component.html',
    styleUrls: ['app/file-list/file-list.component.css']
})
export class FileListComponent implements OnInit, OnDestroy {
  subs: Subscription[] = [];
  fileListModel: FileListModel = new FileListModel();

  //TODO: REMOVE 
  @ViewChild('downloadLink') downloadLink: ElementRef;
  fileToGet: string = 'caffeine.zip';
  downloadUrl: string = '';


  constructor(private fileListService: FileListService,
              private http: Http,
              //TODO: REMOVE 
              private auth: Auth,
              private sanitizer: DomSanitizer) {}


  public sanitizeUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  public checkAPI() {
    let authHeader: Headers = new Headers();
    let reqOptions: RequestOptions = new RequestOptions({
      headers: authHeader,
      responseType: ResponseContentType.Blob
    });

    authHeader.append('Authorization', 'Bearer ' + this.auth.accessToken + ' ' + this.auth.idToken);
    this.http.get('http://localhost:8080/static/file/' + this.fileToGet, reqOptions )
      .subscribe(resp => {
        console.log(resp);
        let contentType = resp.headers.get('content-type');
        let blobArr = [resp.blob()];
        let aBlob = new Blob(blobArr, { type: contentType });
        this.downloadUrl = URL.createObjectURL(aBlob);
        this.downloadLink.nativeElement.href = this.downloadUrl;
        this.downloadLink.nativeElement.click();
        // window.URL.revokeObjectURL(this.downloadUrl);
      });
  }

  ngOnInit() {
    this.subs.push(this.fileListService.fileList$.subscribe(
        (fileListModel: FileListModel) => this.fileListModel = fileListModel
    ));
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

}
