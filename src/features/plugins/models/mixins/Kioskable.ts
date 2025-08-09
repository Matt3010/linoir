import {BaseMessagePayload, Constructor} from "../../entities";

export function Kioskable<
  GenericConfig extends BaseMessagePayload,
  TBase extends Constructor<
    {
      configuration: GenericConfig;
      updateConfiguration<GenericConfig>(newProps: Partial<GenericConfig>): void;
      updateConfiguration<GenericConfig>(newProps: Partial<GenericConfig>, ignoreSelf: boolean): void;
    }>
>(Base: TBase) {
  return class extends Base implements KioskableInterface {
    public toggleKiosk(ignoreSelf: boolean = false): void {
      this.updateConfiguration({kioskActive: !this.configuration.kioskActive}, ignoreSelf);
    }

    public setKioskActive(ignoreSelf: boolean = false): void {
      this.updateConfiguration({kioskActive: true}, ignoreSelf);
    }
  };
}

interface KioskableInterface {
  toggleKiosk(): void;

  setKioskActive(): void;
}

export type WithKioskable<T extends { configuration: { kioskActive: boolean } }> =
  T & KioskableInterface;
