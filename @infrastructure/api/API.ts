export class API {
  async get(url: string) {
    const result = await fetch(url);
    return await result.json();
  }

  async post(url: string, body: any) {
    const result = await fetch(url, {
      method: "POST",
      body: body,
    });
    return await result.text();
  }

  async patch(url: string, body: any) {
    const result = await fetch(url, {
      method: "PATCH",
      body: body,
    });
    return await result.text();
  }
}
