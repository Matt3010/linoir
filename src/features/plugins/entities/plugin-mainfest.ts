import {PluginVariant} from './plugin-variant';

export interface PluginManifest {
  key: string;
  class: any;
  variants: PluginVariant[];
}
