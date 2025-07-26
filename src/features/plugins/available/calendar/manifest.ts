import {PluginManifest} from '../../entities';
import {KioskableMixin} from '../../models';
import {CalendarPlugin} from './CalendarPlugin';
import {RenderType} from '../../../render/enums/render-type';

export const manifest: PluginManifest[] = [
  {
    key: 'calendar',
    class: KioskableMixin(CalendarPlugin),
    variants: [
      {
        scope: RenderType.Admin,
        componentName: 'AdminCalendarComponent',
        loader: () =>
          import(
            './scopes/admin/admin-calendar.component'
            ),
      },
      {
        scope: RenderType.Kiosk,
        componentName: 'KioskCalendarComponent',
        loader: () =>
          import(
            './scopes/kiosk/kiosk-calendar.component'
            ),
      },
    ],
  },
]
