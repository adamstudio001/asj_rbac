import { IpProvider } from "@/Abstract/IpProvider";

export class FakeIpProvider extends IpProvider {
  async getInfo() {
    return {
      success: true,
      data: {
        ip: "123.45.67.89",
        city: "Bandung",
        region: "Jawa Barat",
        country: "ID",
        loc: "-6.91,107.60",
        org: "FAKE ORG",
        postal: "40111",
        timezone: "Asia/Jakarta",
      },
      error: null
    };
  }
}
