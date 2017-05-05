# TODO:UPDATE executeQuerys TO runQuery
from ..config.config import DB


class TestStorage:
    ''' TestStorage '''
    def __init__(self, initDBConfig):
        self.db = DB(initDBConfig)

    def get_next_test_id(self):
        ''' get_next_test_id '''
        res = self.db.run_query(
            'DEV',
            'select S_ATSK_TEST_ID.NextVal from dual')
        return res['rows'][0][0]

    def get_next_cycle_id(self):
        ''' get_next_cycle_id '''
        res = self.db.run_query(
            'DEV',
            'select S_ATSK_TEST_CYCLE_ID.NextVal from dual')
        return res['rows'][0][0]

    def get_test_results(self, system_id):
        ''' get_test_results '''
        results = self.db.execute_query('DEV', '''
WITH MaxTime AS (
  SELECT MAX(Cyc.Execution_Time) AS Execution_Time,
         Cyc.Environment,
         Res.Test_Id
    FROM T_ATSK_Test_Cycles Cyc
   INNER JOIN T_ATSK_Test_Results
     Res ON Res.Test_Cycle_Id = Cyc.Test_Cycle_Id
   WHERE Res.System_Id = ?
   GROUP BY Res.Test_Id,
            Cyc.Environment
)
SELECT Res.Test_Id,
       Cyc.Environment,
       Res.Results_Status
  FROM T_ATSK_Test_Results Res
 INNER JOIN T_ATSK_Test_Cycles Cyc
    ON Cyc.Test_Cycle_Id = Res.Test_Cycle_Id
 INNER JOIN MaxTime
    ON MaxTime.Execution_Time = Cyc.Execution_Time
   AND MaxTime.Environment    = Cyc.Environment
   AND MaxTime.Test_Id        = Res.Test_Id''', (system_id,))
        return results

# TODO: ADD SYSTEM_ID TO T_ATSK_Lk_Branch_Conversion
    def get_tests_by_file(self, file):
        '''
        Pass in the file or directory location, and it will return any tests
        that match file or directory.
        '''
        results = self.db.execute_query('DEV', '''
SELECT Lk.Test_ID, System_Id, Ticket_ID, Test_Type, Test, Submitter, Lk.file_path
  FROM T_ATSK_Tests Tests
 INNER JOIN V_ATSK_Files_Across_Branches Lk
    ON Tests.Test_Id = Lk.test_id
 WHERE LOWER(Lk.file_path) = LOWER(?)''', (str(file),))
        if results and 'rows' in results:
            tests = [{
                    'testId':    results['rows'][i][0],
                    'system_id':  results['rows'][i][1],
                    'ticketId':  results['rows'][i][2],
                    'testType':  results['rows'][i][3],
                    'testObj':   results['rows'][i][4],
                    'submitter': results['rows'][i][5]
                } for i in range(0, len(results['rows']))]
        else:
            tests = None
        return tests

    def get_test_by_id(self, test_id=None):
        ''' get_test_by_id '''
        results = self.db.execute_query('DEV', '''
SELECT Test_ID, System_Id, Ticket_ID, Test_Type, Test, Submitter
  FROM T_ATSK_Tests Tests
 WHERE Test_ID = ?''', (str(test_id),))
        if results and 'rows' in results and len(results['rows']) == 1:
            test = {
                'testId':    results['rows'][0][0],
                'system_id':  results['rows'][0][1],
                'ticketId':  results['rows'][0][2],
                'testType':  results['rows'][0][3],
                'testObj':   results['rows'][0][4],
                'submitter': results['rows'][0][5]}
        else:
            test = None
        return test

    # TODO:CHANGE TO ACTUALLY RETURN TEST OBJECTS, INSTEAD OF A QUERY RESULT
    def get_tests(self, system_id):
        ''' get_tests '''
        results = self.db.execute_query('DEV', '''
SELECT Tests.Test_ID,
       Tests.Ticket_ID,
       Tests.Test_Type,
       --Test,
       Tests.Submitter
  FROM T_ATSK_Tests Tests
 WHERE Tests.System_Id = ?''', (system_id,))
        return results

    def store_test_cycle(self, cycle):
        ''' store_test_cycle '''
        cycle_insert_stmt = '''
INSERT INTO T_ATSK_Test_Cycles
(Test_Cycle_ID, Environment, Branch, Latest_Revision, Execution_Time)
VALUES
(?, ?, ?, ?, ?)'''
        cycle_tuple = (
            str(cycle['test_cycle_id']),
            cycle['env'],
            cycle['branch'],
            cycle['revision'],
            str(cycle['execTime']))

        # Storing all the tests in the DEV environment
        self.db.execute_query('DEV', cycle_insert_stmt, cycle_tuple)

    def store_cycle_results(self, cycle_results):
        ''' store_cycle_results '''
        cycle_insert_stmt = '''
INSERT INTO T_ATSK_Test_Results
(Test_ID, System_Id, Test_Cycle_ID, Results, Results_Status)
VALUES
(?, ?, ?, ?, ?)'''
        for test_results in cycle_results['results']:
            cycle_tuple = (
                str(test_results['test_id']),
                str(test_results['system_id']),
                str(cycle_results['test_cycle_id']),
                str(test_results['results']['run_status']),
                test_results['results']['status_id'])

            # Storing all the tests in the DEV environment
            self.db.execute_query('DEV', cycle_insert_stmt, cycle_tuple)

    def store_test(self, test):
        ''' store_test '''
        test_insert_stmt = '''
INSERT INTO T_ATSK_Tests
(Test_Id, System_Id, Test_Type, Test, Submitter, Ticket_Id, Expected_Results)
VALUES
(?, ?, ?, ?, ?, ?, ?)'''
        files_insert_stmt = '''
INSERT INTO T_ATSK_Test_LK_Files
(Test_Id, File_Path, Branch_Id, Svn_System_Id, Branch_Year, Relative_Path)
VALUES
(?,
 ?,
 REGEXP_REPLACE(?, '((/[^/]+){3}/([^/]+).*)|(.*)', '\\3')),
 REGEXP_REPLACE(?, '((/[^/]+)/([^/]+).*)|(.*)', '\\3')),
 REGEXP_REPLACE(?, '((/[^/]+){2}/([^/]+).*)|(.*)', '\\3')),
 REGEXP_REPLACE(?, '((/[^/]+){4}/(.*))|(.*)', '\\3'))'''
        test_tuple = (
            str(test['testId']),
            str(test['sysId']),
            str(test['testType']),
            test['test'],
            str(test['submitter']),
            str(test['ticketId']),
            str(test['expectedResults']),
            str(test['expectedResults']))
        test_files_tuple = tuple(
            (str(test['testId']), file_name, file_name, file_name, file_name, file_name)
            for file_name in test['files'])

        # Storing all the tests in the DEV environment
        self.db.execute_query('DEV', test_insert_stmt, test_tuple)
        self.db.execute_many('DEV', files_insert_stmt, test_files_tuple)
