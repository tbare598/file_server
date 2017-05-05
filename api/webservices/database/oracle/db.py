from cx_Oracle import connect, DatabaseError, Cursor


class DB:
    def __init__(self, init_config):
        self.config = init_config

    def get_envs(self):
        return list(self.config.keys())

    def get_env_config(self):
        return self.config.envs

    def get_conn(self, env):
        envs = self.config

        conn_str = \
            envs[env]['UID'] + \
            "/" + envs[env]['PWD'] + \
            "@" + envs[env]['DBQ']
        try:
            db = connect(conn_str, threaded=True)
            cur = db.cursor()
            cur.execute(envs[env]['STARTUP'])
            cur.close()

            return db
        except DatabaseError as db_err:
            error, = db_err.args
            if error.code == 1017:
                print('Please check your credentials.')
            else:
                import traceback
                print('ERROR--ENV:'+env)
                print(envs[env]['STARTUP'])
                traceback.print_exc()

    def access_db(self, env, action, commit_changes):
        results = {}
        try:
            conn = self.get_conn(env)
            cur = conn.cursor()

            results = action['func'](cur)

            if commit_changes:
                conn.commit()

            cur.close()
            conn.close()

        except DatabaseError as db_err:
            error, = db_err.args
            if error.code == 1017:
                print('Please check your credentials.')
            else:
                import traceback
                print('ERROR--ENV:'+env)
                print(action['err_msg'])
                traceback.print_exc()
                results['metaData'] = [{'name': 'ERROR'}]
                # cx_Oracle formatting uses -2, pyodbc uses -1
                error = traceback.format_exc().splitlines()[-2]
                results['rows'] = [[error]]

        return results

    def run_query(self, env, qry):
        query = self.cx_oracle_query_converter(qry)

        def db_action(cur):
            results = {}
            cur.execute(query)

            if cur.description:
                cols = [{'name': description[0]} for description in cur.description]
                results['metaData'] = cols
                results['rows'] = self.convert_to_dict(cur.fetchall())
            else:
                results = {'metaData': [{'name': 'QUERY'}], 'rows': [['EXECUTED SUCCESSFULLY']]}

            return results

        action = {"func": db_action, "err_msg": query}
        return self.access_db(env, action, True)

    def execute_query(self, env, qry, prms=()):
        query = self.cx_oracle_query_converter(qry)
        params = self.cx_oracle_param_converter(prms)
        msg = query + '\n'

        def db_action(cur):
            ''' db_action '''
            results = {}
            if len(params) > 0:
                cur.execute(query, params)
            else:
                cur.execute(query)

            if cur.description:
                cols = [{'name': description[0]} for description in cur.description]
                results['metaData'] = cols
                results['rows'] = self.convert_to_dict(cur.fetchall())
            else:
                results = {'metaData': [{'name': 'QUERY'}], 'rows': [['EXECUTED SUCCESSFULLY']]}

            return results

        if len(params) > 0:
            msg += '\n' + str(params)

        action = {"func": db_action, "err_msg": msg}
        return self.access_db(env, action, True)

    def execute_many(self, env, qry, prms):
        query = self.cx_oracle_query_converter(qry)
        params = self.cx_oracle_em_param_converter(prms)
        msg = query + '\n'

        def db_action(cur):
            ''' db_action '''
            results = {}
            cur.executemany(query, params)

            results = {'metaData': [{'name': 'QUERY'}], 'rows': [['EXECUTED SUCCESSFULLY']]}
            return results

        if len(params) > 0:
            msg += '\n' + str(params)

        action = {"func": db_action, "err_msg": msg}
        return self.access_db(env, action, True)

    def call_proc(self, env, proc, args=[]):
        msg = env + ' - Calling Proc: ' + proc + '\n'

        def db_action(cur):
            ''' db_action '''
            params = [arg(cur) for arg in args]
            ret_params = [
                self.results_from_desc(param) if type(param) is Cursor else
                param
                for param in cur.callproc(proc, params)]
            return ret_params

        action = {"func": db_action, "err_msg": msg}
        return self.access_db(env, action, True)

    def results_from_desc(self, cur):
        results = {}
        if cur.description:
            cols = [{'name': description[0]} for description in cur.description]
            results['metaData'] = cols
            results['rows'] = self.convert_to_dict(cur.fetchall())
        else:
            results = {'metaData': [{'name': 'QUERY'}], 'rows': [['EXECUTED SUCCESSFULLY']]}
        return results

    @staticmethod
    def cx_oracle_query_converter(query):
        counter = 0
        new_str = query
        while new_str.find('?') != -1:
            counter += 1
            new_str = new_str.replace('?', ':'+str(counter), 1)

        return new_str

    @staticmethod
    def cx_oracle_param_converter(params):
        return tuple(params)

    @staticmethod
    def cx_oracle_em_param_converter(params):
        new_arr = []
        for param in params:
            new_arr.append(list(param))

        return new_arr

    # Takes rows returned from Oracle, and converts them to strings
    # and into a Python Dictionary object
    @staticmethod
    def convert_to_dict(rows):
        new_arr = []
        for row in rows:
            new_row = []
            for col in row:
                new_row.append(str(col))
            new_arr.append(new_row)

        return new_arr
