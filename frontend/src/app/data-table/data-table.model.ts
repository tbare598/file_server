import { DataTableRowModel } from './data-table';
import { DataTableHeaderRowModel } from './data-table';

export class DataTableModel {
    dataRows: DataTableRowModel[];
    headerRow: DataTableHeaderRowModel;

    constructor() {
      this.dataRows = [];
      this.headerRow = new DataTableHeaderRowModel();
    }
}
