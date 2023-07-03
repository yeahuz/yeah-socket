import config, { update_env } from "../config/index.js";

class Needs {
  constructor(sid, base_uri) {
    this.sid = sid;
    this.base_uri = base_uri;
    this.sid_promise = null;
  }

  static async build(base_uri) {
    const sid = await Needs.get_session();
    return new Needs(sid, base_uri);
  }

  static async get_session(force = false) {
    if (config.needs_api_sid && !force) return config.needs_api_sid;
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
    const json = await response.json().catch(() => { });
    if (!response.ok) return Promise.reject(json);
    await update_env({ NEEDS_API_SID: json.id });
    return json.id;
  }

  async refresh_session() {
    await update_env({ NEEDS_API_SID: "" });
    const sid = await Needs.get_session(true).catch(console.error);
    this.sid = sid;
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

    if (response.status === 403) {
      if (!this.sid_promise) {
        this.sid_promise = this.refresh_session().then(() => {
          this.sid_promise = null;
        })
      }

      return this.sid_promise.then(() => this.request(url, { method, data, query, lang }))
    }

    const json = await response.json().catch(() => { });

    if (!response.ok) {
      return Promise.reject(json);
    }

    return json;
  }
}

export const needs = await Needs.build(config.needs_api_uri);
