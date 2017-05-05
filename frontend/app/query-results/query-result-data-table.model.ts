import { DataTableModel } from '../data-table/data-table';

export class QueryResultDataTableModel {
  queryId: string;
  env: string;
  dataTable: DataTableModel;
    
  
  constructor(initQueryId?: string, initEnv?: string, initDataTable?: DataTableModel) {
    this.queryId = initQueryId != null ? initQueryId : '';
    this.env = initEnv != null ? initEnv : '';
    this.dataTable = initDataTable != null ? initDataTable : new DataTableModel();
  }
  
  
}
