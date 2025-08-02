import {BaseMessagePayload, Constructor} from "../../entities";

export function Kioskable<
  GenericConfig extends BaseMessagePayload,
  TBase extends Constructor<
    {
      configuration: GenericConfig;
      setNewConfig<GenericConfig>(newProps: Partial<GenericConfig>, ignoreSelf: boolean): void;
    }>
>(Base: TBase) {
  return class extends Base {
    toggleKiosk(): void {
      this.setNewConfig({kioskActive: !this.configuration.kioskActive}, false);
    }

    setKioskActive(): void {
      this.setNewConfig({kioskActive: true}, false);
    }
  };
}
