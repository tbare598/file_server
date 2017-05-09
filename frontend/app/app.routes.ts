import { Routes, RouterModule }  from '@angular/router';
import { ModuleWithProviders }  from '@angular/core';

import { FileServerComponent } from './file-server/file-server';

const routeConfig: Routes = [
    { path: '',
      component: FileServerComponent,
      pathMatch: 'full' }
];

export const routes: ModuleWithProviders = RouterModule.forRoot(routeConfig);
