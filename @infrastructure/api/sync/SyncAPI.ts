import { env } from "@config/env";
import { API } from "../API";

export class SystemAPI extends API<any> {
  private url: string;

  constructor(collection: string) {
    super();
    this.url = `${env.SERVER_URL}/sync/${collection}`;
  }

  async checkForUpdates(updatesInput: Record<string, any>) {
    const updateResponse = await this.post(
      `${this.url}/checkForUpdates`,
      updatesInput
    );
    return JSON.parse(updateResponse as string);
  }
}
