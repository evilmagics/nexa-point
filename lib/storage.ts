import { PersonaId } from './personas';

export interface ChatSession {
  id: string;
  title: string;
  personaId: PersonaId;
  messages: any[];
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = 'nexa_chats';

export const saveChat = (session: ChatSession) => {
  if (typeof window === 'undefined') return;
  
  const chats = getAllChats();
  const existingIndex = chats.findIndex(c => c.id === session.id);
  
  if (existingIndex > -1) {
    chats[existingIndex] = { ...session, createdAt: chats[existingIndex].createdAt, updatedAt: Date.now() };
  } else {
    chats.unshift({ ...session, createdAt: Date.now(), updatedAt: Date.now() });
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
};

export const getAllChats = (): ChatSession[] => {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to parse chats from localStorage', e);
    return [];
  }
};

export const getChatById = (id: string): ChatSession | undefined => {
  const chats = getAllChats();
  return chats.find(c => c.id === id);
};

export const deleteChat = (id: string) => {
  if (typeof window === 'undefined') return;
  
  const chats = getAllChats();
  const filtered = chats.filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const updateChatTitle = (id: string, title: string) => {
  const chat = getChatById(id);
  if (chat) {
    chat.title = title;
    saveChat(chat);
  }
};

export const clearAllChats = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
};
