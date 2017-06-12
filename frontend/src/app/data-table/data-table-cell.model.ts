import { DataTableCellItemModel } from './data-table-cell-item/data-table-cell-item';

export class DataTableCellModel {

    id: string;
    items: DataTableCellItemModel[];
    cssClass: string;

    constructor() {
      this.id = '';
      this.items = [];
      this.cssClass = '';
    }
}
