import {NetworkConfigPlugin, TelegramPlugin} from '../available';
import {WithDockable, WithKioskable, WithSocketable} from '../models';

type BaseTelegramInstance = InstanceType<typeof TelegramPlugin>;
type BaseNetworkConfigInstance = InstanceType<typeof NetworkConfigPlugin>;

export type MixedTelegramPlugin = WithKioskable<WithDockable<WithSocketable<BaseTelegramInstance>>>;
export type MixedNetworkConfigPlugin = WithKioskable<WithDockable<WithSocketable<BaseNetworkConfigInstance>>>;

export type PossiblePlugins =
  | MixedTelegramPlugin
  | MixedNetworkConfigPlugin;
