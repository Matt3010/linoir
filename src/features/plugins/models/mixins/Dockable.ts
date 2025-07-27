import {BaseMessagePayload} from "../../entities/_index";

type Constructor<T = {}> = new (...args: any[]) => T;

export function Dockable<TBase extends Constructor<{
  configuration: BaseMessagePayload;
  sendMessage(config: any): void;
}>>(Base: TBase) {
  return class extends Base {
    toggleDock(): void {
      const currentConfig = this.configuration;
      const newConfig = {...currentConfig, dockActive: !currentConfig.dockActive};
      this.sendMessage(newConfig);
    }

    setDockActive(): void {
      const currentConfig = this.configuration;
      const newConfig = {...currentConfig, dockActive: true};
      this.sendMessage(newConfig);
    }
  };
}

interface Mixin {
  toggleDock(): void;

  setDockActive(): void;
}

export type WithDockable<T> = T & Mixin;
