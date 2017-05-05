import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AutoSmoketestSystemResolve implements Resolve<any> {
  resolve(route: ActivatedRouteSnapshot) {
    return Observable.create(observer => {
      const SYSTEM_ID = 'systemId';
      observer.next(route.params[SYSTEM_ID]);
      observer.complete();
    });
  }
}
