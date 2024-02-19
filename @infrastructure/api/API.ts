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

export class API<T> {
  private async fetchResource({
    url,
    method,
    body,
    isFormData,
  }: FetchOptions): Promise<any> {
    const headers = isFormData
      ? undefined
      : {
          "Content-Type": "application/json",
        };

    const response = await fetch(url, {
      method,
      headers,
      body: isFormData ? body : JSON.stringify(body),
    });

    if (response.ok) {
      return method === HttpMethod.GET
        ? await response.json()
        : await response.text();
    } else {
      throw new Error(`Failed to fetch ${url}: ${response.toString()}`);
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
    // console.log("🚀 - file: API.ts:79", {
    //   url,
    //   body: body?.relatoriosSyncInfo,
    // });
    const updateResponse = await this.post(url, body);

    return JSON.parse(updateResponse as string);
  }
}
