import config, { update_env } from "../config/index.js";

class Needs {
  constructor(sid, base_uri) {
    this.sid = sid;
    this.base_uri = base_uri;
  }

  static async build(base_uri) {
    const sid = await Needs.get_session();
    return new Needs(sid, base_uri);
  }

  static async get_session() {
    if (config.needs_api_sid) return config.needs_api_sid;
    const response = await fetch(
      config.needs_api_uri + "/auth/external/login",
      {
        body: JSON.stringify({
          identifier: config.needs_api_username,
          password: config.needs_api_password,
        }),
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": "en",
        },
        method: "POST",
      }
    );
    const session = await response.json().catch(() => { });
    if (!response.ok) return Promise.reject(json);
    await update_env({ NEEDS_API_SID: session.id });
    return session.id;
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
        Authorization: this.sid,
        "X-Requested-With": "XMLHTTPRequest",
        "Accept-Language": lang,
        "User-Agent": "Needs-Socket/1.0 Linux (yeah; wss://needs.uz)",
      },
    });

    const json = await response.json().catch(() => { });

    if (!response.ok) {
      return Promise.reject(json);
    }

    return json;
  }
}

export const needs = await Needs.build(config.needs_api_uri);
