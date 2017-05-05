import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
//BUG CAUSING THIS NOT TO LINK CORRECTLY WHEN ACCESSED FROM auto-smoketest.ts
import { AutoSmoketestSystemModel } from './auto-smoketest-system.model';
import { config } from '../config/config';

@Injectable()
export class AutoSmoketestService {
    private _currSystem: AutoSmoketestSystemModel;
    private _currSystem$: BehaviorSubject<AutoSmoketestSystemModel>;
    private _systems: AutoSmoketestSystemModel[];

    constructor(private http: Http) {
      this._currSystem = new AutoSmoketestSystemModel();
      this._currSystem$ = new BehaviorSubject<AutoSmoketestSystemModel>(this._currSystem);
      this._systems = [];
    }

    
    get systems(): AutoSmoketestSystemModel[]{
      return this._systems;
    }
    
    get currSystemId(): string{
      return this._currSystem.id;
    }
    
    set currSystemId(newSysId: string){
      if (this._systems.length === 0) {
        this.loadSystems(newSysId);
      }else {
        let nextSystem = this._systems.find(sys => sys.id === newSysId);
        this.loadSystem(nextSystem);
      }
    }

    
    get currSystem(): AutoSmoketestSystemModel{
      return this._currSystem;
    }
    
    get currSystem$(): Observable<AutoSmoketestSystemModel>{
      return this._currSystem$.asObservable();
    }
    
    
    public loadSystem(newSystem: AutoSmoketestSystemModel) {
      this._currSystem = newSystem;
      this._currSystem$.next(this._currSystem);
    }
    
    
    public loadSystems(currSystemId?: string): Promise<AutoSmoketestSystemModel[]> {
      return this.http.get(config.apiHost + '/API/systems')
        .map(response => response.json())
        .toPromise()
        .then(res => {
          //Keeping references to _systems intact
          this._systems.length = 0;
          this._systems.push.apply(this._systems, res.systems.map(systemId => new AutoSmoketestSystemModel(systemId)));
          this.loadSystem(new AutoSmoketestSystemModel(currSystemId));
          return this._systems;
        })
        .catch(this.handleError);
    }
    
    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
