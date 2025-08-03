import {BaseMessagePayload, Constructor} from "../../entities";

export function Kioskable<
  GenericConfig extends BaseMessagePayload,
  TBase extends Constructor<
    {
      configuration: GenericConfig;
      updateConfiguration<GenericConfig>(newProps: Partial<GenericConfig>): void;
    }>
>(Base: TBase) {
  return class extends Base implements KioskableInterface {
    public toggleKiosk(): void {
      this.updateConfiguration({kioskActive: !this.configuration.kioskActive});
    }

    public setKioskActive(): void {
      this.updateConfiguration({kioskActive: true});
    }
  };
}

interface KioskableInterface {
  toggleKiosk(): void;

  setKioskActive(): void;
}

export type WithKioskable<T extends { configuration: { kioskActive: boolean } }> =
  T & KioskableInterface;
