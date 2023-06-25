export async function option(promise) {
  try {
    const result = await promise;
    return [result, null];
  } catch (err) {
    return [null, err];
  }
}

export function add_prefix(prefix, str) {
  return prefix + "/" + str
}
