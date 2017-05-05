import { QueryResultsDataTableModel, TestResultModel } from './query-results';

export class QueryResultsModel {
  dataTables: QueryResultsDataTableModel;
  testResults: TestResultModel[];
  
  constructor() {
    this. dataTables = new QueryResultsDataTableModel();
    this.testResults = [];
  }
  
}
