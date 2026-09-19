// Lightweight "who is this" identity — no auth system, just a random ID
// persisted in localStorage per browser/device. Good enough for a hackathon
// demo to scope "my checklist" and "my peer submission" without accounts.

const STORAGE_KEY = "abroadready_device_id";

export function getDeviceId(): string {
  if (typeof window === "undefined") {
    throw new Error("getDeviceId() can only be called in the browser");
  }
  let id = window.localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}
