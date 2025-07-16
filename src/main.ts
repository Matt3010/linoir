import {bootstrapApplication} from '@angular/platform-browser';
import {appConfig} from './app.config';
import {MainLayout} from './features/layouts/main-layout/main-layout';

bootstrapApplication(MainLayout, appConfig)
  .catch((err) => console.error(err));
