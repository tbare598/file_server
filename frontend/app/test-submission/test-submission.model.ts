export class TestSubmissionModel {
  testType: string;
  test: any;
  submitter: string;
  ticketId: string;
  expectedResults: any;
  files: string[];

  constructor() {
    this.testType = '';
    this.submitter = '';
    this.ticketId = '';
    this.files = [];
  }
}
