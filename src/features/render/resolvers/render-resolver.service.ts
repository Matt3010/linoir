import {Injectable, Type} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {RenderType} from '../enums/render-type';
import {RenderKioskComponent} from '../components/render-kiosk/render-kiosk.component';
import {RenderAdminComponent} from '../components/render-admin/render-admin.component';

@Injectable()
export class RenderResolver implements Resolve<Type<unknown>> {
  resolve(route: ActivatedRouteSnapshot): Type<unknown> {
    switch (route.data['pluginHostType']) {
      case RenderType.Admin:
        return RenderAdminComponent;
      case RenderType.Kiosk:
        return RenderKioskComponent;
      default:
        return RenderKioskComponent;
    }
  }
}
