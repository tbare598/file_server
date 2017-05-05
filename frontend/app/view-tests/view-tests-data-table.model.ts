import { DataTableModel } from '../data-table/data-table';
import { DataTableCellItemModel } from '../data-table/data-table-cell-item/data-table-cell-item';
import { ViewTestsModel, TestMetadataModel, TestResultsModel } from './view-tests';

export class ViewTestsDataTableModel {

  dataTable: DataTableModel;

  private testMetadata: TestMetadataModel;
  private testResults: TestResultsModel;
  
  constructor(viewTests?: ViewTestsModel, initRunTest?: any, initTestClick?: any) {
    if (viewTests != null) {
      this.testMetadata = new TestMetadataModel(viewTests.tests);
      this.testResults = new TestResultsModel(viewTests.testResults);
    } else {
      this.testMetadata = new TestMetadataModel();
      this.testResults = new TestResultsModel();
    }
    
    let runTest = () => null;
    if (initRunTest != null) {
      runTest = initRunTest;
    }
    
    let testClick = () => null;
    if (initTestClick != null) {
      testClick = initTestClick;
    }
    
    this.loadDataTable(runTest, testClick);
  }
  public updateEnvTests(envs: any[]) {
    let removeRegEx = /\binactive\b/g;
    let foundCellIndex = -1;
    envs.forEach(env => {
      let findEnvRegEx = RegExp('_' + env.id + '$');
      this.dataTable.dataRows.forEach(row => {
        for (let i = foundCellIndex > -1 ? foundCellIndex : 0; i < row.cells.length; i++) {
          let cell = row.cells[i];
          cell.items.forEach(item => {
            let match = item.id.match(findEnvRegEx);
            if (item.id === 'NO_TEST_RESULTS') {
              foundCellIndex = i;
            } else if (match !== null) {
              foundCellIndex = i;
              if (env.checked) {
                item.cssClass = item.cssClass.replace(removeRegEx, '').trim();
              } else {
                item.cssClass += ' inactive';
              }
            }
          });
          if (foundCellIndex > -1) {
            break;
          }
        }
      });
    });
  }
  
  public updateTest(testId: string, env: string, newStatus: string) {
    for (let i1 = 0; i1 < this.dataTable.dataRows.length; i1++) {
      let row = this.dataTable.dataRows[i1];
      
      if (row.id === testId) {
        for (let i2 = 0; i2 < row.cells.length; i2++) {
          let cell = row.cells[i2];
          if (cell.id === 'Test_Statuses') {
            let testFound = false;
            for (let i3 = 0; i3 < cell.items.length; i3++) {
              let item = cell.items[i3];
              if (item.id === testId + '_' + env || item.id === 'NO_TEST_RESULTS') {
                item.id = testId + '_' + env;
                item.text = env + ':' + newStatus;
                item.cssClass = 'status status-' + newStatus.toLowerCase();
                testFound = true;
              }
            }
            if (!testFound) {
              cell.items.push(
                new DataTableCellItemModel(
                  testId + '_' + env,
                  env + ':' + newStatus,
                  'text',
                  null,
                  'status status-' + newStatus.toLowerCase())
              );
            }
            break;
          }
        }
        break;
      }
    }
  }
  
  private loadDataTable(runTest: any, testClick: any) {
    this.dataTable = new DataTableModel();
    
    this.dataTable.headerRow = {
      cells: [
        { id: 'TEST_ID',     items: [ new DataTableCellItemModel('TEST_ID',     'Test ID')     ], cssClass: '' },
        { id: 'TICKET_ID',   items: [ new DataTableCellItemModel('TICKET_ID',   'Ticket ID')   ], cssClass: '' },
        { id: 'TEST_TYPE',   items: [ new DataTableCellItemModel('TEST_TYPE',   'Test Type')   ], cssClass: '' },
        { id: 'SUBMITTER',   items: [ new DataTableCellItemModel('SUBMITTER',   'Submitter')   ], cssClass: '' },
        { id: 'TEST_STATUS', items: [ new DataTableCellItemModel('TEST_STATUS', 'Test Status') ], cssClass: '' },
        { id: 'RUN_TEST',    items: [ new DataTableCellItemModel('RUN_TEST',    'Run Test')    ], cssClass: '' } ],
      cssClass: '',
      sortCol: 'TEST_ID',
      sortDir: 'desc' };
    
    let meta = this.testMetadata.metadata;
    let res = this.testResults.results;
    let keys = Object.keys(meta);
    for (let i = 0; i < keys.length; i++) {
      let testId = keys[i];
      let metaRow = meta[testId];
      if (metaRow) {
        let openTestObj = { onClick: () => testClick(testId) };
        let runTestObj = { onClick: () => runTest(testId) };
        this.dataTable.dataRows.push({
          id: testId,
          cells: [
            { id: null, items: [ new DataTableCellItemModel(testId, testId, 'button', openTestObj, 'btn-view-test' ) ], cssClass: '' },
            { id: null, items: [ new DataTableCellItemModel(metaRow.ticketId, metaRow.ticketId)  ], cssClass: '' },
            { id: null, items: [ new DataTableCellItemModel('', metaRow.testType)], cssClass: '' },
            { id: null, items: [ new DataTableCellItemModel('', metaRow.submitter) ], cssClass: '' },
            { id: 'Test_Statuses', items: this.createStatusCells(testId, res[testId]), cssClass: '' },
            { id: null, items: [ new DataTableCellItemModel('', 'RUN', 'button', runTestObj) ], cssClass: '' }
          ],
          cssClass: ''
        });
      }
    }
  }
  
  private createStatusCells(testId: string, testResults: any) {
    if (testResults == null) {
      return [ new DataTableCellItemModel('NO_TEST_RESULTS', 'No Test Results') ];
    } else {
      return testResults.map(status =>
              new DataTableCellItemModel(testId + '_' + status.env, status.env + ':' + status.status,
                                         'text',
                                         null,
                                         status.env + '-status status status-' + status.status.toLowerCase())
            );
    }
  }
}
