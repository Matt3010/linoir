import {NetworkConfigPlugin} from '../features/plugins/available/network-config/NetworkConfigPlugin';
import {DockableMixin, KioskableMixin} from '../features/plugins/models';
import {SocketableMixin} from '../features/plugins/models/mixins/SocketableMixin';

export const environment = {
  production: true,
  wsServer: 'backend-ws',
  fallbackAllDeactivated: KioskableMixin(DockableMixin(SocketableMixin(NetworkConfigPlugin))),
};
