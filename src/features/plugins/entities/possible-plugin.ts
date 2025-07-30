import {TelegramPlugin, WithDockable, WithKioskable, WithSocketable} from '../models';
import {NetworkConfigPlugin} from '../available';

export type TelegramPluginWithMixins = WithKioskable<WithDockable<WithSocketable<TelegramPlugin>>>;
export type NetworkConfigPluginWithMixins = WithKioskable<WithDockable<WithSocketable<NetworkConfigPlugin>>>;

export type PossiblePlugin =
  | NetworkConfigPluginWithMixins
  | TelegramPluginWithMixins;

