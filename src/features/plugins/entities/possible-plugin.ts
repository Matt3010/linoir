import {NetworkConfigPlugin, TelegramPlugin} from '../available';
import {Dockable, Kioskable, Socketable} from '../models';

export const TelegramPluginWithMixins = Kioskable(Dockable(Socketable(TelegramPlugin)));
export const NetworkConfigPluginWithMixins = Kioskable(Dockable(Socketable(NetworkConfigPlugin)));

export type PossiblePlugin =
  | InstanceType<typeof NetworkConfigPluginWithMixins>
  | InstanceType<typeof TelegramPluginWithMixins>;
