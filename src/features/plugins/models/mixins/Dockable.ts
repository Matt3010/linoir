import {BaseMessagePayload, Constructor} from "../../entities";

export function Dockable<
  TBase extends Constructor<
    {
      configuration: BaseMessagePayload;
      updateAllClientsConfig(config: any): void;
    }>
>(Base: TBase) {
  return class extends Base {
    toggleDock(): void {
      const currentConfig = this.configuration;
      const newConfig = {...currentConfig, dockActive: !currentConfig.dockActive};
      this.updateAllClientsConfig(newConfig);
    }

    setDockActive(): void {
      const currentConfig = this.configuration;
      const newConfig = {...currentConfig, dockActive: true};
      this.updateAllClientsConfig(newConfig);
    }
  };
}

interface Mixin {
  toggleDock(): void;

  setDockActive(): void;
}

export type WithDockable<T> = T & Mixin;
