import config from "../config/index.js";
import sodium from "sodium-native";

function get_key(secret) {
  let key = "";
  if (secret) {
    key = Buffer.allocUnsafe(sodium.crypto_secretbox_KEYBYTES);

    let salt = Buffer.from("mq9hDxBVDbspDR6nLfFT1g==", "base64");
    if (salt) {
      salt = Buffer.isBuffer(salt) ? salt : Buffer.from(salt, "ascii");
    }
    sodium.crypto_pwhash(
      key,
      Buffer.from(secret),
      salt,
      sodium.crypto_pwhash_OPSLIMIT_MODERATE,
      sodium.crypto_pwhash_MEMLIMIT_MODERATE,
      sodium.crypto_pwhash_ALG_DEFAULT
    );
  }

  return key;
}

const key = get_key(config.session_cookie_secret);

export function decode_cookie(cookie, name) {
  const cookies = cookie.split("; ");
  const cookiesMap = new Map(cookies.map((cookie) => cookie.split('=')));
  const value = cookiesMap.get(name);
  const split = decodeURIComponent(value).split(";");
  const cipher_b64 = split[0];
  const nonce_b64 = split[1];

  const cipher = Buffer.from(cipher_b64, "base64");
  const nonce = Buffer.from(nonce_b64, "base64");

  const msg = Buffer.allocUnsafe(
    cipher.length - sodium.crypto_secretbox_MACBYTES
  );

  const decoded = sodium.crypto_secretbox_open_easy(msg, cipher, nonce, key);
  if (decoded) {
    return JSON.parse(msg);
  }

  return decoded;
}
