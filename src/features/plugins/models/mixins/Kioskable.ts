import {BaseMessagePayload, Constructor} from "../../entities";

export function Kioskable<
  GenericConfig extends BaseMessagePayload,
  TBase extends Constructor<
    {
      configuration: GenericConfig;
      setNewConfig<GenericConfig>(newProps: Partial<GenericConfig>): void;
    }>
>(Base: TBase) {
  return class extends Base {
    public toggleKiosk(): void {
      this.setNewConfig({kioskActive: !this.configuration.kioskActive});
    }

    public setKioskActive(): void {
      this.setNewConfig({kioskActive: true});
    }
  };
}
