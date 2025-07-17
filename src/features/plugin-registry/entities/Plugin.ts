import {PluginManifest} from './plugin-manifest';

export class Plugin {

  constructor(
    protected readonly manifest: PluginManifest,
  ) {
    this.manifest = manifest;
  }

  public get conf(): PluginManifest {
    return this.manifest;
  }

  public get key(): string {
    return this.manifest.key;
  }

  public get componentName(): string {
    return this.manifest.componentName;
  }

  public get scope(): string {
    return this.manifest.scope;
  }


}
