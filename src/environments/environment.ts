import {NetworkConfigPlugin} from '../features/plugins/available/network-config/NetworkConfigPlugin';

export const environment = {
  production: true,
  wsServer: 'backend-ws',
  fallbackAllDeactivated: NetworkConfigPlugin
};
