import { ADVERTISEMENT_SERVICE, CHAR_UUIDS, UUIDS } from "./constants.js";

function buf2hex(buffer) {
  return Array.prototype.map
    .call(new Uint8Array(buffer), (x) => ("00" + x.toString(16)).slice(-2))
    .join("");
}

const concatBuffers = (buffer1, buffer2) => {
  const out = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
  out.set(new Uint8Array(buffer1), 0);
  out.set(new Uint8Array(buffer2), buffer1.byteLength);
  return out.buffer;
};

export class MiBand5 {
  /**
   * @param {String} authKey
   *   Hex representation of the auth key (https://github.com/Freeyourgadget/Gadgetbridge/wiki/Huami-Server-Pairing)
   *   Example: '94359d5b8b092e1286a43cfb62ee7923'
   */
  constructor(authKey) {
    if (!authKey.match(/^[a-zA-Z0-9]{32}$/)) {
      throw new Error(
        "Invalid auth key, must be 32 hex characters such as '94359d5b8b092e1286a43cfb62ee7923'"
      );
    }
    this.authKey = authKey;
    this.services = {};
    this.chars = {};
  }

  async init() {
    const device = await navigator.bluetooth.requestDevice({
      filters: [
        {
          services: [ADVERTISEMENT_SERVICE],
        },
      ],
      optionalServices: [UUIDS.miband2, UUIDS.heartrate, UUIDS.miband1],
    });
    window.dispatchEvent(new CustomEvent("connected"));
    if (!device) throw new Error("Couldn't find bluetooth device");
    await device.gatt.disconnect();
    const server = await device.gatt.connect();
    if (!server) throw new Error("Couldn't find server");

    this.services.miband1 = await server.getPrimaryService(UUIDS.miband1);
    this.services.miband2 = await server.getPrimaryService(UUIDS.miband2);
    this.services.heartrate = await server.getPrimaryService(UUIDS.heartrate);
    console.log("Got services");

    this.chars.auth = await this.services.miband2.getCharacteristic(
      CHAR_UUIDS.auth
    );
    this.chars.hrControl = await this.services.heartrate.getCharacteristic(
      CHAR_UUIDS.heartrate_control
    );
    this.chars.hrMeasure = await this.services.heartrate.getCharacteristic(
      CHAR_UUIDS.heartrate_measure
    );
    this.chars.sensor = await this.services.miband1.getCharacteristic(
      CHAR_UUIDS.sensor
    );
    console.log("Got characteristics");
    await this.authenticate();
  }

  async authenticate() {
    await this.startNotifications(this.chars.auth, async (e) => {
      const value = e.target.value.buffer;
      const cmd = buf2hex(value.slice(0, 3));
      console.log("Auth char cb", cmd);
      if (cmd === "100101") {
        console.log("Set new key OK");
      } else if (cmd === "100201") {
        const number = value.slice(3);
        console.log("Got random number", buf2hex(value.slice(3)));
        const key = aesjs.utils.hex.toBytes(this.authKey);
        console.log("key", key, "number", number);
        const aesCbc = new aesjs.ModeOfOperation.cbc(key);
        const out = aesCbc.encrypt(new Uint8Array(number));
        console.log("Encrypted: ", typeof out, out);
        const cmd = concatBuffers(new Uint8Array([3, 0]), out);
        await this.chars.auth.writeValue(cmd);
      } else if (cmd === "100301") {
        await this.onAuthenticated();
      } else {
        throw new Error(`Unknown callback, cmd='${cmd}'`);
      }
    });
    await this.chars.auth.writeValue(Uint8Array.from([2, 0]));
  }

  async onAuthenticated() {
    console.log("Authenticated");
    window.dispatchEvent(new CustomEvent("authenticated"));
    this.measureHr().then();
  }

  async measureHr() {
    await this.chars.hrControl.writeValue(Uint8Array.from([0x15, 0x02, 0x00]));
    await this.chars.hrControl.writeValue(Uint8Array.from([0x15, 0x01, 0x00]));
    await this.startNotifications(this.chars.hrMeasure, (e) => {
      console.log("Got heart rate", e.target.value);
      const heartRate = e.target.value.getInt16();
      window.dispatchEvent(
        new CustomEvent("heartrate", {
          detail: heartRate,
        })
      );
    });
    await this.chars.hrControl.writeValue(Uint8Array.from([0x15, 0x01, 0x01]));

    // Start pinging HRM
    this.hrmTimer =
      this.hrmTimer ||
      setInterval(() => {
        console.log("Pinging hrm");
        this.chars.hrControl.writeValue(Uint8Array.from([0x16]));
      }, 12000);
  }

  async startNotifications(char, cb) {
    await char.startNotifications();
    char.addEventListener("characteristicvaluechanged", cb);
  }
}

window.MiBand5 = MiBand5;
