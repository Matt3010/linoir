import {PluginManifest} from '../../entities';
import {DockableMixin, KioskableMixin} from '../../models';
import {NetworkConfigPlugin} from './NetworkConfigPlugin';
import {RenderType} from '../../../render/enums/render-type';

export const manifest: PluginManifest[] = [
  {
    key: 'network-config',
    class: KioskableMixin(DockableMixin(NetworkConfigPlugin)),
    variants: [
      {
        scope: RenderType.Admin,
        UIComponentClassName: 'AdminNetworkConfigComponent',
        loader: () =>
          import(
            './scopes/admin/admin-network-config.component'
            ),
      },
      {
        scope: RenderType.Kiosk,
        UIComponentClassName: 'KioskNetworkConfigComponent',
        loader: () =>
          import(
            './scopes/kiosk/kiosk-network-config.component'
            ),
      },
      {
        scope: RenderType.Dock,
        UIComponentClassName: 'DockNetworkConfigComponent',
        loader: () =>
          import(
            './scopes/dock/dock-network-config.component'
            ),
      },
    ],
  },
];
