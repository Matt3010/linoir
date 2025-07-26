import {PluginVariant} from './plugin-variant';
import {PossiblePlugin} from '../services/plugin-loader.service';
import {Type} from '@angular/core';

export interface PluginManifest {
  key: string;
  class: Type<PossiblePlugin>;
  variants: PluginVariant[];
}
