
const namespace = 'soundworks';

export default localStorage {
  set(key, value) {
    window.localStorage.setItem(key, value);
  }

  get(key) {
    return window.localStorage.getItem(key);
  }

  delete(key) {
    window.localStorage.removeItem(key);
  }

  clear() {
    window.localStorage.clear();
  }
}