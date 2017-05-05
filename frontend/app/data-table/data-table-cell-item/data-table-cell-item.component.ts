import { Component, Input } from '@angular/core';

import { DataTableCellItemModel } from './data-table-cell-item';

@Component({
    selector: 'data-table-cell-item',
    templateUrl: 'app/data-table/data-table-cell-item/data-table-cell-item.component.html',
    styleUrls: ['app/data-table/data-table-cell-item/data-table-cell-item.component.css']
})

export class DataTableCellItemComponent {
    
    @Input() item: DataTableCellItemModel;
    
    runOnClick() {
      if (this.item != null
      && this.item.value != null
      && this.item.value.onClick != null) {
        this.item.value.onClick();
      }
    }
}
