import {ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {APP_ROUTES} from './app.routes';
import {provideHttpClient, withFetch} from '@angular/common/http';
import {WebsocketService} from './common/services/websocket.service';
import {PluginLoaderService} from './features/plugins/services/plugin-loader.service';
import {PluginHostResolver} from './features/plugin-host/resolvers/plugin-host-resolver';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(withFetch()),
    provideRouter(APP_ROUTES),
    WebsocketService,
    PluginLoaderService,
    PluginHostResolver
  ]
};
