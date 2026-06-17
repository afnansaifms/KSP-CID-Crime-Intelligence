import type { ChatMessage } from '../types';

const DB_NAME = 'ksp_chat_db';
const DB_VERSION = 1;
const STORE_NAME = 'conversations';

// Open IndexedDB
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('date', 'date', { unique: false });
        store.createIndex('title', 'title', { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export interface Conversation {
  id: string;
  title: string;
  date: string;
  messages: ChatMessage[];
  preview: string;
}

// Save conversation
export const saveConversation = async (messages: ChatMessage[]): Promise<string> => {
  if (messages.length < 2) return '';
  const db = await openDB();
  const id = `conv_${Date.now()}`;
  const firstUserMsg = messages.find(m => m.role === 'user')?.content || 'New conversation';
  const title = firstUserMsg.length > 50 ? firstUserMsg.slice(0, 50) + '...' : firstUserMsg;
  const preview = messages[messages.length - 1]?.content.slice(0, 100) || '';

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const conversation: Conversation = {
      id,
      title,
      date: new Date().toISOString(),
      messages,
      preview,
    };
    const req = store.add(conversation);
    req.onsuccess = () => resolve(id);
    req.onerror = () => reject(req.error);
  });
};

// Update existing conversation
export const updateConversation = async (id: string, messages: ChatMessage[]): Promise<void> => {
  if (!id || messages.length < 2) return;
  const db = await openDB();
  const firstUserMsg = messages.find(m => m.role === 'user')?.content || 'New conversation';
  const title = firstUserMsg.length > 50 ? firstUserMsg.slice(0, 50) + '...' : firstUserMsg;
  const preview = messages[messages.length - 1]?.content.slice(0, 100) || '';

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put({
      id, title, preview,
      date: new Date().toISOString(),
      messages,
    });
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
};

// Get all conversations
export const getAllConversations = async (): Promise<Conversation[]> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();
    req.onsuccess = () => {
      const sorted = (req.result as Conversation[]).sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      resolve(sorted);
    };
    req.onerror = () => reject(req.error);
  });
};

// Get single conversation
export const getConversation = async (id: string): Promise<Conversation | null> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
};

// Delete conversation
export const deleteConversation = async (id: string): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
};

// Clear all conversations
export const clearAllConversations = async (): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.clear();
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
};

// Group conversations by date like Claude does
export const groupByDate = (conversations: Conversation[]) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const last7 = new Date(today.getTime() - 7 * 86400000);
  const last30 = new Date(today.getTime() - 30 * 86400000);

  const groups: Record<string, Conversation[]> = {
    'Today': [],
    'Yesterday': [],
    'Previous 7 Days': [],
    'Previous 30 Days': [],
    'Older': [],
  };

  conversations.forEach(conv => {
    const date = new Date(conv.date);
    if (date >= today) groups['Today'].push(conv);
    else if (date >= yesterday) groups['Yesterday'].push(conv);
    else if (date >= last7) groups['Previous 7 Days'].push(conv);
    else if (date >= last30) groups['Previous 30 Days'].push(conv);
    else groups['Older'].push(conv);
  });

  return groups;
};