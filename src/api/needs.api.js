import config from "../config/index.js";

class Needs {
  constructor(token, base_uri) {
    this.token = token;
    this.base_uri = base_uri;
  }

  async request(url, { method, data, query, lang = "en" } = {}) {
    if (query) {
      const search = new URLSearchParams();
      for (const key in query) {
        if (query[key]) {
          search.append(key, query[key]);
        }
      }
      url += "?" + search.toString();
    }

    const response = await fetch(this.base_uri + url, {
      method: method || (data ? "POST" : "GET"),
      body: data ? JSON.stringify(data) : undefined,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
        "X-Requested-With": "XMLHTTPRequest",
        "Accept-Language": lang,
      },
    });

    const json = await response.json().catch(() => {});

    if (!response.ok) {
      return Promise.reject(json);
    }

    return json;
  }
}

export const needs = new Needs(config.needs_api_token, config.needs_api_uri);
