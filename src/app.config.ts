import {ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {APP_ROUTES} from './app/app.routes';
import {provideHttpClient, withFetch} from '@angular/common/http';
import {WebsocketService} from './common/services/websocket.service';
import {PluginLoaderService} from './features/plugin-registry/services/plugin-loader.service';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(withFetch()),
    provideRouter(APP_ROUTES),
    WebsocketService,
    PluginLoaderService
  ]
};
