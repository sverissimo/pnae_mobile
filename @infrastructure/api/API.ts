import { env } from "@config/env";
import { CheckForUpdatesResponse } from "@sync/types/CheckForUpdatesResponse";

enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
}

interface FetchOptions {
  url: string;
  method: HttpMethod;
  body?: any;
  isFormData?: boolean;
}

const token = env.ACCESS_TOKEN;
const authHeaders = { Authorization: `Bearer ${token}` };
export class API<T> {
  private async fetchResource({
    url,
    method,
    body,
    isFormData,
  }: FetchOptions): Promise<any> {
    const headers = isFormData
      ? authHeaders
      : {
          ...authHeaders,
          "Content-Type": "application/json",
        };
    // console.log("API WILL FETCH....", url);
    const response = await fetch(url, {
      method,
      headers,
      body: isFormData ? body : JSON.stringify(body),
    });
    // console.log("Got API response!!!!!!!!! ");

    if (response.ok) {
      return method === HttpMethod.GET
        ? await response.json()
        : await response.text();
    } else {
      let responsObj;
      try {
        responsObj = await response.text();
      } catch (_err) {
        responsObj = await response.text();
      }

      throw new Error(`Failed to fetch ${url}: ${JSON.stringify(responsObj)}`);
    }
  }

  async get(url: string): Promise<T[] | T> {
    return this.fetchResource({ url, method: HttpMethod.GET });
  }

  async post<T>(url: string, body: any): Promise<T> {
    return this.fetchResource({ url, method: HttpMethod.POST, body });
  }

  async patch<T>(url: string, body: any): Promise<T> {
    return this.fetchResource({ url, method: HttpMethod.PATCH, body });
  }

  async postFormData<T>(url: string, body: any): Promise<T> {
    return this.fetchResource({
      url,
      method: HttpMethod.POST,
      body,
      isFormData: true,
    });
  }

  async patchFormData<T>(url: string, body: any): Promise<T> {
    return this.fetchResource({
      url,
      method: HttpMethod.PATCH,
      body,
      isFormData: true,
    });
  }

  async getSyncInfo<T>(
    url: string,
    body: any
  ): Promise<CheckForUpdatesResponse<T>> {
    const updateResponse = await this.post(url, body);
    return JSON.parse(updateResponse as string);
  }
}
