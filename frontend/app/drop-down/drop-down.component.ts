import { Component, Input } from '@angular/core';
// import { FORM_DIRECTIVES } from '@angular/common';

@Component({
    selector: 'drop-down',
    templateUrl: 'app/drop-down/drop-down.component.html',
    styleUrls: ['app/drop-down/drop-down.component.css']
    // , directives: [ FORM_DIRECTIVES ]
})
export class DropDownComponent {
    
    //TODO:CREATE MODEL FOR ddItems
    @Input() ddItems: any;
    private _hidden: boolean = true;
    
    toggle() {
      this._hidden = !this._hidden;
    }
    
    hide() {
      this._hidden = true;
    }
    
    ddItemChanged(ddItem) {
      if (ddItem.updateCallback) {
        ddItem.updateCallback(this.ddItems);
      }
    }
    
    ddItemClicked(ddItem) {
      if (ddItem.checked === true || ddItem.checked === false) {
        ddItem.checked = !ddItem.checked;
      }
    }
}
