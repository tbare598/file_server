import { Component, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
// import { CodeMirror } from './code-mirror';


declare var CodeMirror: any;
import * as $ from 'jquery';

@Component({
    selector: 'code-mirror',
    templateUrl: 'app/code-mirror/code-mirror.component.html',
    styleUrls: ['app/code-mirror/codemirror.css',
                'app/code-mirror/solarized.css',
                'app/code-mirror/midnight.css']
})

export class CodeMirrorComponent implements AfterViewInit {

    @Input() elmId: string;
    @Output() textChange = new EventEmitter();
    @Output() f5Pressed = new EventEmitter();
    
    private viewInited: boolean = false;
    private queryObj;
    private _text: string = '';

    @Input()
    set text(textVal: string){
      if (this._text !== textVal) {
        this._text = textVal != null ? textVal : '';
        if (this.viewInited) {
          let cursorPosition = this.queryObj.getDoc().getCursor();
          this.queryObj.getDoc().setValue(this._text);
          this.queryObj.getDoc().setCursor(cursorPosition);
        }
      }
    }
    
    get text(): string{
      if (this.queryObj && this.queryObj.getDoc) {
        return this.queryObj.getDoc().getValue();
      } else {
        return '';
      }
    }
    
    private syntaxOpts = {
      lineNumbers: true,
      mode: 'text/x-plsql',
      theme: 'midnight',
      matchBrackets: true,
      showCursorWhenSelecting: true
    };
    
    constructor() {
      this.textChange.emit('');
    }

    ngAfterViewInit() {
      this.viewInited = true;
      this.queryObj = CodeMirror.fromTextArea($('#' + this.elmId)[0], this.syntaxOpts);
      this.queryObj.addKeyMap({'F5': () => this.f5Pressed.emit() });
      this.queryObj.on('change', () => this.textChange.emit(this.text));
      
      this.textChange.emit(this.text);
    }
    
}
