/**
 * Storage Service - IndexedDB and localStorage utilities
 * خدمة التخزين للبيانات المحلية
 */

const DB_NAME = "sakina-db";
const DB_VERSION = 1;
const STORES = {
    progress: "progress",
    settings: "settings",
    cache: "cache",
};

let db = null;

/**
 * Initialize IndexedDB
 */
export async function initDB() {
    return new Promise((resolve, reject) => {
        if (db) {
            resolve(db);
            return;
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const database = event.target.result;

            // Progress store
            if (!database.objectStoreNames.contains(STORES.progress)) {
                database.createObjectStore(STORES.progress, {
                    keyPath: "date",
                });
            }

            // Settings store
            if (!database.objectStoreNames.contains(STORES.settings)) {
                database.createObjectStore(STORES.settings, { keyPath: "key" });
            }

            // Cache store for offline data
            if (!database.objectStoreNames.contains(STORES.cache)) {
                database.createObjectStore(STORES.cache, { keyPath: "key" });
            }
        };
    });
}

/**
 * Save data to IndexedDB
 */
export async function saveToIndexedDB(storeName, data) {
    try {
        const database = await initDB();
        return new Promise((resolve, reject) => {
            const transaction = database.transaction(storeName, "readwrite");
            const store = transaction.objectStore(storeName);
            const request = store.put(data);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    } catch (error) {
        console.warn(
            "IndexedDB save failed, falling back to localStorage:",
            error,
        );
        localStorage.setItem(
            `${storeName}-${data.key || data.date}`,
            JSON.stringify(data),
        );
        return data;
    }
}

/**
 * Get data from IndexedDB
 */
export async function getFromIndexedDB(storeName, key) {
    try {
        const database = await initDB();
        return new Promise((resolve, reject) => {
            const transaction = database.transaction(storeName, "readonly");
            const store = transaction.objectStore(storeName);
            const request = store.get(key);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    } catch (error) {
        console.warn("IndexedDB get failed, checking localStorage:", error);
        const localData = localStorage.getItem(`${storeName}-${key}`);
        return localData ? JSON.parse(localData) : null;
    }
}

/**
 * Delete from IndexedDB
 */
export async function deleteFromIndexedDB(storeName, key) {
    try {
        const database = await initDB();
        return new Promise((resolve, reject) => {
            const transaction = database.transaction(storeName, "readwrite");
            const store = transaction.objectStore(storeName);
            const request = store.delete(key);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(true);
        });
    } catch (error) {
        console.warn("IndexedDB delete failed:", error);
        localStorage.removeItem(`${storeName}-${key}`);
        return true;
    }
}

/**
 * Clear all data from a store
 */
export async function clearStore(storeName) {
    try {
        const database = await initDB();
        return new Promise((resolve, reject) => {
            const transaction = database.transaction(storeName, "readwrite");
            const store = transaction.objectStore(storeName);
            const request = store.clear();

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(true);
        });
    } catch (error) {
        console.warn("IndexedDB clear failed:", error);
        // Clear localStorage items for this store
        Object.keys(localStorage)
            .filter((key) => key.startsWith(`${storeName}-`))
            .forEach((key) => localStorage.removeItem(key));
        return true;
    }
}

// LocalStorage helpers with fallback
export const storage = {
    get: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch {
            return defaultValue;
        }
    },

    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch {
            return false;
        }
    },

    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch {
            return false;
        }
    },

    clear: () => {
        try {
            localStorage.clear();
            return true;
        } catch {
            return false;
        }
    },
};

export default {
    initDB,
    saveToIndexedDB,
    getFromIndexedDB,
    deleteFromIndexedDB,
    clearStore,
    storage,
    STORES,
};
