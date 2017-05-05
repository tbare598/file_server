export class QueryModel {
  query: string;
  envs: string[];
  
  constructor(initQuery?: string, initEnvs?: string[]) {
    this.query = initQuery != null ? initQuery : '';
    this.envs = initEnvs != null ? initEnvs : [];
  }
}
