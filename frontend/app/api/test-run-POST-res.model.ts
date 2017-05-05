export class TestRunPOSTResModel {
    id: string;
    data: {
      env: string;
      results: {
        status_id: string;
        run_status: any;
      }
    };
}
