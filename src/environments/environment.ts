import {NetworkConfigPlugin} from '../features/plugins/available/network-config/NetworkConfigPlugin';
import {KioskableMixin} from '../features/plugins/models/KioskableMixin';

export const environment = {
  production: true,
  wsServer: 'backend-ws',
  fallbackAllDeactivated: KioskableMixin(NetworkConfigPlugin)
};
