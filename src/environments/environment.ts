import {NetworkConfigPlugin} from '../features/plugins/available';

export const environment = {
  production: true,
  wsServer: 'ws-backend',
  fallbackAllDeactivated: NetworkConfigPlugin,
  TELEGRAM_API_ID: (window as any).__env?.TELEGRAM_API_ID ?? '',
  TELEGRAM_API_HASH: (window as any).__env?.TELEGRAM_API_HASH ?? '',
};
