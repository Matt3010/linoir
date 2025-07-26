import {RenderType} from '../../render/enums/render-type';
import {Type} from '@angular/core';

export interface PluginVariant {
  scope: RenderType;
  UIComponentClassName: string;
  loader: () => Promise<Record<string, Type<unknown>>>;
}
