import { create } from "zustand";

export interface ChatWindow {
  conversationId: string;
  participantName: string;
  participantAvatar?: string;
  minimized: boolean;
}

interface ChatOverlayState {
  windows: ChatWindow[];
  openChat: (window: Omit<ChatWindow, "minimized">) => void;
  closeChat: (conversationId: string) => void;
  toggleMinimize: (conversationId: string) => void;
  minimizeAll: () => void;
}

const MAX_WINDOWS = 3;

export const useChatOverlay = create<ChatOverlayState>((set) => ({
  windows: [],

  openChat: (newWindow) =>
    set((state) => {
      const existing = state.windows.find((w) => w.conversationId === newWindow.conversationId);
      if (existing) {
        return {
          windows: state.windows.map((w) =>
            w.conversationId === newWindow.conversationId ? { ...w, minimized: false } : w,
          ),
        };
      }
      const windows = state.windows.length >= MAX_WINDOWS ? state.windows.slice(1) : state.windows;
      return { windows: [...windows, { ...newWindow, minimized: false }] };
    }),

  closeChat: (conversationId) =>
    set((state) => ({
      windows: state.windows.filter((w) => w.conversationId !== conversationId),
    })),

  toggleMinimize: (conversationId) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.conversationId === conversationId ? { ...w, minimized: !w.minimized } : w,
      ),
    })),

  minimizeAll: () =>
    set((state) => ({
      windows: state.windows.map((w) => ({ ...w, minimized: true })),
    })),
}));
