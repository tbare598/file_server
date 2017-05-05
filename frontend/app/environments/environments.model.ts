export class EnvironmentsModel {
    envs: {
      id: string,
      name: string,
      checked: boolean
    }[];
    
    constructor() {
      this.envs = [];
    }
}
