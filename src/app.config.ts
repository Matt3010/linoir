import {ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {APP_ROUTES} from './app.routes';
import {provideHttpClient, withFetch} from '@angular/common/http';
import {WebsocketService} from './common/services/websocket.service';
import {PluginLoaderService} from './features/plugins/services/plugin-loader.service';
import {RenderResolver} from './features/render/resolvers/render.resolver';
import {gsap} from 'gsap';
import {Flip} from 'gsap/Flip';
import {InertiaPlugin} from 'gsap/InertiaPlugin';
import {Draggable} from 'gsap/Draggable';

gsap.registerPlugin(Flip);
gsap.registerPlugin(InertiaPlugin);
gsap.registerPlugin(Draggable)

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(withFetch()),
    provideRouter(APP_ROUTES),
    WebsocketService,
    PluginLoaderService,
    RenderResolver
  ]
};
