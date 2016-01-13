const namespace = 'soundworks';

export default {
  set(key, value) {
    window.localStorage.setItem(key, value);
  },

  get(key) {
    return window.localStorage.getItem(key) || null;
  },

  delete(key) {
    window.localStorage.removeItem(key);
  },

  clear() {
    window.localStorage.clear();
  },
}