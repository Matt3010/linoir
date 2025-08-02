// Auto-generated file. Do not modify manually.
import { PluginManifest } from '../entities';

import { manifest as manifest0 } from './../available/network-config/manifest';
import { manifest as manifest1 } from './../available/telegram/scopes/admin/admin-telegram/manifest';
import { manifest as manifest2 } from './../available/telegram/scopes/dock/dock-telegram/manifest';
import { manifest as manifest3 } from './../available/telegram/scopes/kiosk/kiosk-telegram/manifest';

const pluginMap: Record<string, PluginManifest> = {};


for (const plugin of manifest0) {
  if (pluginMap[plugin.key]) {
    pluginMap[plugin.key].variants = [
      ...pluginMap[plugin.key].variants,
      ...plugin.variants
    ];
  } else {
    pluginMap[plugin.key] = { ...plugin, variants: [...plugin.variants] };
  }
}

for (const plugin of manifest1) {
  if (pluginMap[plugin.key]) {
    pluginMap[plugin.key].variants = [
      ...pluginMap[plugin.key].variants,
      ...plugin.variants
    ];
  } else {
    pluginMap[plugin.key] = { ...plugin, variants: [...plugin.variants] };
  }
}

for (const plugin of manifest2) {
  if (pluginMap[plugin.key]) {
    pluginMap[plugin.key].variants = [
      ...pluginMap[plugin.key].variants,
      ...plugin.variants
    ];
  } else {
    pluginMap[plugin.key] = { ...plugin, variants: [...plugin.variants] };
  }
}

for (const plugin of manifest3) {
  if (pluginMap[plugin.key]) {
    pluginMap[plugin.key].variants = [
      ...pluginMap[plugin.key].variants,
      ...plugin.variants
    ];
  } else {
    pluginMap[plugin.key] = { ...plugin, variants: [...plugin.variants] };
  }
}

export const PLUGINS: PluginManifest[] = Object.values(pluginMap);
