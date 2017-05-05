import { ResultSetModel } from '../result-set/result-set.model';

export class TestMetadataModel {
  metadata: {
    [testId: string]: {
      ticketId: string,
      testType: string,
      submitter: string
    }
  };

  private resultSet: ResultSetModel;
  
  constructor(initResultSet?: ResultSetModel) {
    //null or undefined
    if (initResultSet == null) {
      this.metadata = {}; 
      this.resultSet = new ResultSetModel();
    } else {
      this.setMetadata(initResultSet);
    }
  }
  
  public setMetadata(newResultSet: ResultSetModel) {
    this.resultSet = newResultSet;
    this.metadata = {}; 
    
    //Finding Keys
    let testIdKey, ticketKey, typeKey, submitterKey = -1;
    
    for (let i = 0; i < this.resultSet.metaData.length; i++) {
      switch (this.resultSet.metaData[i].name) {
        case 'TEST_ID':
          testIdKey = i;
          break;
        case 'TICKET_ID':
          ticketKey = i;
          break;
        case 'TEST_TYPE':
          typeKey = i;
          break;
        case 'SUBMITTER':
          submitterKey = i;
          break;
        default:
         break;
      }
    }
    
    this.resultSet.rows.forEach(row => {
      let currTicket = row[ticketKey];
      let currTestType = row[typeKey];
      let currSubmitter = row[submitterKey];
      
      let currMeta = {
        ticketId:  currTicket,
        testType:  currTestType,
        submitter: currSubmitter };
      
      
      this.metadata[row[testIdKey]] = currMeta;
    });
    
  }
}
