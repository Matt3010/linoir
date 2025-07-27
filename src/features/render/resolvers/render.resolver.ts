import {inject, Injectable, Type} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router} from '@angular/router';
import {RenderType} from '../enums/render-type';
import {RenderAdminComponent, RenderDockComponent, RenderKioskComponent} from '../components/_index'

@Injectable()
export class RenderResolver implements Resolve<Type<unknown> | undefined> {
  private readonly router = inject(Router)

  resolve(route: ActivatedRouteSnapshot): Type<unknown> | undefined {
    switch (route.data['scope']) {
      case RenderType.Admin:
        return RenderAdminComponent;
      case RenderType.Kiosk:
        return RenderKioskComponent;
      case RenderType.Dock:
        return RenderDockComponent;
      default:
        this.router.navigate(['admin']);
        return undefined;
    }
  }
}
