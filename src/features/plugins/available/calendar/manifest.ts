import {PluginManifest} from '../../entities';
import {Kioskable} from '../../models';
import {CalendarPlugin} from './CalendarPlugin';
import {RenderType} from '../../../render/enums/render-type';
import {Socketable} from '../../models/mixins/Socketable';

export const manifest: PluginManifest[] = [
  {
    key: 'calendar',
    class: Kioskable(Socketable(CalendarPlugin)),
    variants: [
      {
        scope: RenderType.Admin,
        UIComponentClassName: 'AdminCalendarComponent',
        loader: () =>
          import(
            './scopes/admin/admin-calendar.component'
            ),
      },
      {
        scope: RenderType.Kiosk,
        UIComponentClassName: 'KioskCalendarComponent',
        loader: () =>
          import(
            './scopes/kiosk/kiosk-calendar.component'
            ),
      },
    ],
  },
]
