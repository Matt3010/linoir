import {NetworkConfigPlugin} from '../features/plugins/available/_index';
import {Dockable, Kioskable} from '../features/plugins/models/_index';
import {Socketable} from '../features/plugins/models/mixins/Socketable';

export const environment = {
  production: true,
  wsServer: 'ws-backend',
  fallbackAllDeactivated: Kioskable(Dockable(Socketable(NetworkConfigPlugin))),
  TELEGRAM_API_ID: (window as any).__env?.TELEGRAM_API_ID ?? '',
  TELEGRAM_API_HASH: (window as any).__env?.TELEGRAM_API_HASH ?? '',
};
