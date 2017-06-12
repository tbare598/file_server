import { DataTableCellModel } from './data-table';

export class DataTableHeaderRowModel {
    cells: DataTableCellModel[];
    cssClass: string;
    sortCol: string;
    sortDir: string;

    constructor() {
      this.sortCol = '';
      this.sortDir = '';
      this.cells = [];
      this.cssClass = '';
    }
}
