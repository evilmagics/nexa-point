---
description: Local history feature implementation using LocalStorage for local persistence.
---

# Workflow: Local Storage Chat History

This workflow outlines the technical steps to implement a chat conversation history stored in the user's browser using `localStorage`.

## 1. Data Structure Definition
Each chat session will be stored as an object within a `nexa_chats` array.

```typescript
interface ChatSession {
  id: string;          // Unique UUID or timestamp
  title: string;       // Auto-generated title from /api/chat/title
  personaId: string;   // ID of the selected assistant (travel, finance, copywriter)
  messages: Message[]; // Array of messages from Vercel AI SDK
  createdAt: number;   // Creation timestamp
  updatedAt: number;   // Last update timestamp
}
```

## 2. Storage Utility (Helper Functions)
Create helper functions to manage data in `localStorage`:
- `saveChat(session: ChatSession)`: Save or update a single session.
- `getAllChats()`: Retrieve all sessions to display in the sidebar.
- `getChatById(id: string)`: Retrieve a specific session when a user clicks history.
- `deleteChat(id: string)`: Remove a session from history.
- `updateChatTitle(id: string, title: string)`: Update the title of a specific session.

## 3. Integration into `ChatPage` (Frontend)

### A. Initialization & Loading
1. When the page loads, check `searchParams` for an `id`.
2. If an `id` exists, retrieve data from `localStorage` and populate `initialMessages` in the `useChat` hook.
3. Set the `personaId` state according to what's stored in that session.

### B. Auto-Saving Logic
Use the `onFinish` callback in the `useChat` hook or a `useEffect` that monitors `messages` changes:
1. Every time the AI finishes responding, get the latest `messages` array.
2. Update the corresponding `ChatSession` object in `localStorage`.
3. If the title is still "New Chat", call `/api/chat/title` and update the title.

### C. Context Resuming
1. When a user clicks a sidebar item, navigate to a new URL with a query param (e.g., `/chat?id=...`).
2. Ensure the `messages` state is reset and repopulated with data from that ID.

## 4. Context Limiting (Sliding Window)
To maintain token efficiency when resuming old chats:
1. In `app/api/chat/route.ts`, add logic to take only the last 10-15 messages from the `messages` array before sending them to Gemini.
2. Ensure the System Prompt remains sent as the first message.

## 5. UI Synchronization
1. Ensure the Sidebar uses state that is synchronized with `localStorage`.
2. Use `CustomEvent` or `StorageEvent` to update the sidebar history list instantly when changes occur in another tab or when a new title is generated.

## Implementation Checklist:
- [ ] Create `lib/storage.ts` for helper functions.
- [ ] Modify `app/chat/page.tsx` to read `id` from URL.
- [ ] Add `useEffect` logic for auto-saving to `localStorage`.
- [ ] Update Sidebar UI to map data from `getAllChats()`.
- [ ] Add a "New Chat" button that clears state and removes the ID from the URL.
