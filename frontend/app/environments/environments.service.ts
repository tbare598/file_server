import { Injectable } from '@angular/core';
import { EnvironmentsModel } from './environments';
import { APIService } from '../api/api.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class EnvironmentsService {
    private _envModel: EnvironmentsModel;
    private _envModel$: BehaviorSubject<EnvironmentsModel>;
    

    constructor(private apiService: APIService) {
      this._envModel = new EnvironmentsModel();
      this._envModel$ = new BehaviorSubject<EnvironmentsModel>(this._envModel);
    }

    get envModel(): EnvironmentsModel{
      return this._envModel;
    }

    set envModel(newModel: EnvironmentsModel){
      this._envModel = newModel;
      this._envModel$.next(this._envModel);
    }

    get envModel$(): Observable<EnvironmentsModel>{
      return this._envModel$.asObservable();
    }
    
    loadEnvModel(envModel: EnvironmentsModel) {
      this._envModel.envs = envModel.envs;
      this._envModel$.next(this._envModel);
    }
    
    loadEnvs() {
      this.apiService.getEnvs
        .subscribe(res => {
          this._envModel.envs = res.envs.map(env => {
            return { id: env, name: env, checked: true };
          });
          this._envModel$.next(this._envModel);
        });
    }
}
