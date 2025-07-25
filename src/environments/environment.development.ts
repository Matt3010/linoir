import {NetworkConfigPlugin} from '../features/plugins/available/network-config/NetworkConfigPlugin';

export const environment = {
  production: false,
  wsServer: null,
  fallbackAllDeactivated: NetworkConfigPlugin
};
