"""
Test
"""
import time
from .DBTestStorage import TestStorage as TSTStore


class Test:
    """
    Test
    """

    def __init__(self, storageConfig, initTests):
        self.tst_store = TSTStore(storageConfig)
        self.tests = initTests

    def get_envs(self, system_id):
        """
        get_envs
        """
        return self.tests[system_id]['envs']

    def submit_test(self, system_id, test):
        """
        submit_test
        """
        test['testId'] = self.tst_store.get_next_test_id()
        test['sysId'] = system_id
        self.tst_store.store_test(test)

    def run_cycle_by_files(self, env, files):
        """
        run_cycle_by_files
        """
        tests = []
        for file in files:
            next_tests = self.get_tests_by_file(file)
            for next_test in next_tests:
                dups = list(filter(lambda test: test['test_id'] == next_test['test_id'], tests))
                if len(dups) == 0:
                    tests.append(next_test)

        return self.run_and_store_tests(env, tests)

    def run_cycle_by_test_id(self, env, test_id, cycle=None):
        """
        run_cycle_by_test_id
        """
        test = [self.get_test_by_id(test_id)]
        return self.run_and_store_tests(env, test, cycle)

    def get_tests_by_file(self, file):
        """
        get_tests_by_file
        """
        return self.tst_store.get_tests_by_file(file)

    def get_test_by_id(self, test_id):
        """
        get_test
        """
        return self.tst_store.get_test_by_id(test_id)

    def get_tests(self, system_id):
        """
        get_tests
        """
        return self.tst_store.get_tests(system_id)

    def get_test_results(self, system_id):
        """
        get_test_results
        """
        return self.tst_store.get_test_results(system_id)

    def store_test_cycle(self, env, cycle):
        """
        store_test_cycle
        """
        if not cycle:
            cycle = {'branch': 'None', 'revision': 'None'}

        test_cycle_id = self.tst_store.get_next_cycle_id()
        test_cycle = {'test_cycle_id': test_cycle_id,
                      'env':           env,
                      'branch':        cycle['branch'],
                      'revision':      cycle['revision'],
                      'execTime':      int(time.time())}
        self.tst_store.store_test_cycle(test_cycle)

        return test_cycle_id

    def run_and_store_tests(self, env, tests, cycle=None):
        """
        run_and_store_tests
        """
        test_cycle_id = self.store_test_cycle(env, cycle)

        test_results = [{
            'test_id':       test['testId'],
            'system_id':     test['system_id'],
            'results':       self.run_test(env, test)}
            for test in tests]
        cycle_results = {
            'env':           env,
            'test_cycle_id': test_cycle_id,
            'results':       test_results
            }

        self.tst_store.store_cycle_results(cycle_results)
        return cycle_results

    def run_test(self, env, test):
        """
        run_test
        """
        test_func = self.tests[test['system_id']]['tests'][test['testType']]
        return test_func(test['testObj'], env)
