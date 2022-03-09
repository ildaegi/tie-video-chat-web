class Cookie {
  delete(name: string): void {
    const date = new Date();
    document.cookie = `${name}= ;expires=${date.toUTCString()};path=/`;
  }
  set(name: string, value = "none", day = 0): void {
    const date = new Date();
    date.setTime(date.getTime() + day * 60 * 60 * 24 * 1000);
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
  }

  get(name: string): string {
    const value = document.cookie.match(`(^|;) ?${name}=([^;]*)(;|$)`);

    return value ? value[2] : "";
  }
}

export default new Cookie();
