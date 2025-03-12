const generateAlphanumeric = ( lenthLimit = 6 ) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < lenthLimit ; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

class EtherpadIdStorage {
  constructor() {
    this.storageKey = "etherpad_id";
  }

  getPadId() {
    return localStorage.getItem(this.storageKey) || "";
  }

  setPadId(padId) {
    localStorage.setItem(this.storageKey, padId);
  }

  removePadId() {
    localStorage.removeItem(this.storageKey);
  }
}

export { EtherpadIdStorage, generateAlphanumeric };
