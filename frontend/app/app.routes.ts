import { Routes, RouterModule }  from '@angular/router';
import { ModuleWithProviders }  from '@angular/core';
import { AutoSmoketestSystemResolve } from './auto-smoketest/auto-smoketest-system.resolve';

import { QueryAreaComponent } from './query-area/query-area';
import { ViewTestsComponent } from './view-tests/view-tests';
import { AutoTestComponent } from './auto-smoketest/auto-smoketest';

const routeConfig: Routes = [
    { path: '',
      component: AutoTestComponent,
      pathMatch: 'full' },
    { path: ':systemId',
      component: AutoTestComponent,
      resolve: {
        systemId: AutoSmoketestSystemResolve
      },
      children: [
        { path: '',
          component: QueryAreaComponent },
        { path: 'viewtests',
          component: ViewTestsComponent },
        { path: 'viewtests/:testId',
          component: ViewTestsComponent }
      ]
    }
];

export const routes: ModuleWithProviders = RouterModule.forRoot(routeConfig);
