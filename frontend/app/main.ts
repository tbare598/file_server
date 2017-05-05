import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';
import { config } from './config/config';
import { enableProdMode } from '@angular/core';

if (config.env === 'PROD') {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
