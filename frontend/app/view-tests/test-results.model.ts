import { ResultSetModel } from '../result-set/result-set.model';

export class TestResultsModel {
  results: {
    [testId: string]: {
      env: string,
      status: string
    }[]
  };

  private resultSet: ResultSetModel;
  
  constructor(initResultSet?: ResultSetModel) {
    //null or undefined
    if (initResultSet == null) {
      this.resultSet = new ResultSetModel();
      this.results = {};
    } else {
      this.setResults(initResultSet);
    }
  }
  
  public setResults(newResultSet: ResultSetModel) {
    this.resultSet = newResultSet;
    this.results = {};
    
    //Finding Keys
    let testIdKey, envKey, statusKey = -1;
    
    for (let i = 0; i < this.resultSet.metaData.length; i++) {
      switch (this.resultSet.metaData[i].name) {
        case 'TEST_ID':
          testIdKey = i;
          break;
        case 'ENVIRONMENT':
          envKey = i;
          break;
        case 'RESULTS_STATUS':
          statusKey = i;
          break;
        default:
          break;
      }
    }
    
    this.resultSet.rows.forEach(row => {
      if (!this.results[row[testIdKey]]) {
        this.results[row[testIdKey]] = [];
      }
      let currRes = this.results[row[testIdKey]];
      
      currRes.push({ env: row[envKey], status: row[statusKey] });
    });
      
    
  }
  
}
