import {BaseMessagePayload, Constructor} from "../../entities";

export function Kioskable<
  TBase extends Constructor<
    {
      configuration: BaseMessagePayload;
      updateAllClientsConfig(config: any): void
    }>
>(Base: TBase) {
  return class extends Base {
    toggleKiosk(): void {
      const currentConfig = this.configuration;
      const newConfig = {...currentConfig, kioskActive: !currentConfig.kioskActive};
      this.updateAllClientsConfig(newConfig);
    }

    setKioskActive(): void {
      const currentConfig = this.configuration;
      const newConfig = {...currentConfig, kioskActive: true};
      this.updateAllClientsConfig(newConfig);
    }
  };
}

interface Mixin {
  toggleKiosk(): void;

  setKioskActive(): void;
}

export type WithKioskable<T> = T & Mixin;

