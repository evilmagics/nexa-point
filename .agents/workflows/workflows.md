---
description: Development
---

# Nexa Point Chatbot Development Workflow

This document contains step-by-step guidelines for the Agent (Google Antigravity) in building a chatbot application based on Next.js and the Google AI API.

## Project Description
Build a simple chatbot with an interface resembling Google Gemini (using a default dark mode theme).
Key features:
1. **Persona/Skill Selection**: Users can choose one of three personas (Travel Planner, Financial Consultant, Copywriter) at the beginning of the session. Only 1 persona can be active per session.
2. **Local History**: Chat history is stored locally in the browser and supports Markdown rendering.
3. **Tech Stack**: Next.js (App Router), Google AI (Gemini) API, Vanilla CSS (no Tailwind CSS).

---

## Development Stages (Workflow)

### Phase 1: Project Initiation & Basic Configuration
1. **Next.js Setup**: Create a new Next.js project in this directory using the App Router. Run `npx create-next-app@latest ./ --use-npm` (ensure non-interactive mode or adjust configuration to use Vanilla CSS instead of Tailwind CSS).
2. **Install Dependencies**: Install required libraries, such as `@google/genai` (or the latest Gemini SDK) and libraries for parsing Markdown (e.g., `react-markdown`).
3. **Environment Variables**: Create a `.env.local` file to store the `GOOGLE_GEMINI_API_KEY` credential.

### Phase 2: UI/UX Design (Gemini Clone - Dark Mode)
1. **Design System (CSS)**: Create CSS variables in `globals.css` for dark theme colors (dark background, light text, typical Gemini accent colors).
2. **Main Layout**:
   - **Sidebar**: To display the conversation history list (Local History).
   - **Header**: Displays the application title and the currently active Skill indicator/dropdown.
   - **Chat Area**: Main area to display messages (chat bubbles).
   - **Input Area**: Textarea at the bottom to type messages.

### Phase 3: Skill Selection Implementation (System Prompts)
1. **State Management**: Create state (e.g., using React Context or Zustand/local state) to store the selected skill.
2. **Skill Selector UI**: Create a "Welcome" page or a modal at the start of the application that forces the user to choose 1 skill (Travel Planner, Financial Consultant, Copywriter) before they can start chatting.
3. **Prompt Integration**: Map each skill to a "System Instruction" that will be sent to the Google AI API when creating a chat session.

### Phase 4: Google AI API Integration
1. **API Route**: Create an endpoint in Next.js (`app/api/chat/route.js` or `route.ts`) to communicate with the Google AI API.
2. **Streaming Support**: Implement a *streaming* response from the Gemini API so text appears gradually like typing, providing a better UX.
3. **Context Awareness**: Ensure the endpoint receives and sends previous chat history to Gemini to maintain conversation context.

### Phase 5: Local History & Markdown Implementation
1. **Local Storage**: Use `localStorage` or `IndexedDB` to store chat history. Each conversation must have an ID, automatic title, timestamp, and message list.
2. **Markdown Rendering**: Use `react-markdown` to render messages returned by Gemini, including support for *code blocks*, *bold*, *italic*, and tables.
3. **History Management**: Provide features to load old conversations from the Sidebar, or create new chat sessions.

### Phase 6: Polishing & Testing
1. **Animations & Transitions**: Add smooth *micro-animations* when messages arrive or when opening/closing the sidebar.
2. **Validation**: Ensure the application runs without errors, the UI is responsive on mobile and desktop devices, and the API key is not exposed to the client.
