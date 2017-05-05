export class TestCyclePOSTResModel {
    data: {
      env: string;
      test_cycle_id: string;
      results: {
        test_id: string;
        system_id: string;
        results: {
          status_id: string;  
          run_status: string;  
        };
      }[];
    };
};
