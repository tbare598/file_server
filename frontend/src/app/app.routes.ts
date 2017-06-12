import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { FileServerComponent } from './file-server/file-server';
import { FileListComponent } from './file-list/file-list';

const routeConfig: Routes = [
    { path: '',
      component: FileServerComponent,
      children: [
        { path: '**',
          component: FileListComponent }
      ]
    }
];

export const routes: ModuleWithProviders = RouterModule.forRoot(routeConfig);
