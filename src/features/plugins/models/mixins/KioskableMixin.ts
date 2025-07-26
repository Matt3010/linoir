import {BaseMessagePayload} from "../../entities";

type Constructor<T = {}> = new (...args: any[]) => T;

export function KioskableMixin<TBase extends Constructor<{
  configuration: BaseMessagePayload;
  sendMessage(config: any): void
}>>(Base: TBase) {
  return class extends Base {
    toggleKiosk(): void {
      const currentConfig = this.configuration;
      const newConfig = {...currentConfig, kioskActive: !currentConfig.kioskActive};
      this.sendMessage(newConfig);
    }

    setKioskActive(): void {
      const currentConfig = this.configuration;
      const newConfig = {...currentConfig, kioskActive: true};
      this.sendMessage(newConfig);
    }
  };
}

interface Kioskable {
  toggleKiosk(): void;

  setKioskActive(): void;
}

export type WithKioskable<T> = T & Kioskable;

