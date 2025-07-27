import {BaseMessagePayload} from "../../entities/_index";
import {Constructor} from '../../entities/constructor';


export function Kioskable<
  TBase extends Constructor<
    {
      configuration: BaseMessagePayload;
      sendMessage(config: any): void
    }>
>(Base: TBase) {
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

interface Mixin {
  toggleKiosk(): void;

  setKioskActive(): void;
}

export type WithKioskable<T> = T & Mixin;

