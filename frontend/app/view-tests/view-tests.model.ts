import { ResultSetModel } from '../result-set/result-set.model';

export class ViewTestsModel {
  testResults: ResultSetModel;
  tests: ResultSetModel;
  runTest: any;
  
  constructor() {
    this.testResults = new ResultSetModel();
    this.tests = new ResultSetModel();
    this.runTest = () => undefined;
  }
}
