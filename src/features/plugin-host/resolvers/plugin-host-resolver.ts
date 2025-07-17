import {Injectable, Type} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {PluginHostType} from '../enums/plugin-host-type';
import {PluginHostGlobalComponent} from '../components/plugin-host-global/plugin-host-global.component';
import {PluginHostPreviewComponent} from '../components/plugin-host-preview/plugin-host-preview.component';

@Injectable()
export class PluginHostResolver implements Resolve<Type<unknown>> {
  resolve(route: ActivatedRouteSnapshot): Type<unknown> {
    switch (route.data['pluginHostType']) {
      case PluginHostType.Preview:
        return PluginHostPreviewComponent;
      case PluginHostType.Global:
        return PluginHostGlobalComponent;
      default:
        return PluginHostGlobalComponent;
    }
  }
}
