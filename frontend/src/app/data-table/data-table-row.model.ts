import { DataTableCellModel } from './data-table';

export class DataTableRowModel {
    id: string;
    cells: DataTableCellModel[];
    cssClass: string;

    constructor() {
      this.id = '';
      this.cells = [];
      this.cssClass = '';
    }
}
