import {NetworkConfigPlugin} from '../features/plugins/available/network-config/NetworkConfigPlugin';
import {KioskableMixin} from '../features/plugins/models';

export const environment = {
  production: true,
  wsServer: 'backend-ws',
  fallbackAllDeactivated: KioskableMixin(NetworkConfigPlugin)
};
