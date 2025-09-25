import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatState, ChatMessage, ChatUser, ChatRoom } from '../types/chat';
import { CreditManager } from '../utils/creditManager';

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      // 초기 상태
      currentUser: null,
      chatRooms: [],
      activeChatRoom: null,
      messages: [],
      isConnected: false,
      isTyping: false,
      adminOnline: false,
      isChatOpen: false,
      unreadCount: 0,

      // 현재 사용자 설정
      setCurrentUser: (user) => set({ currentUser: user }),

      // 메시지 추가 (일반 사용자용)
      addMessage: (messageData) => {
        const newMessage: ChatMessage = {
          ...messageData,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          timestamp: Date.now(),
          isRead: false,
        };

        set((state) => ({
          messages: [...state.messages, newMessage],
          unreadCount: messageData.isAdmin ? state.unreadCount + 1 : state.unreadCount,
        }));

        // 새 메시지 알림 (사용자가 보낸 메시지가 아닌 경우)
        if (messageData.isAdmin && !get().isChatOpen) {
          // 브라우저 알림 (권한이 있는 경우)
          if (Notification.permission === 'granted') {
            new Notification('💬 관리자 답변이 도착했습니다!', {
              body: messageData.message.substring(0, 50) + (messageData.message.length > 50 ? '...' : ''),
              icon: '/vite.svg'
            });
          }
        }
      },

      // 메시지 읽음 처리
      markAsRead: (messageId) => {
        set((state) => ({
          messages: state.messages.map(msg => 
            messageId ? (msg.id === messageId ? { ...msg, isRead: true } : msg)
                     : { ...msg, isRead: true }
          ),
          unreadCount: messageId ? Math.max(0, state.unreadCount - 1) : 0,
        }));
      },

      // 채팅창 토글
      toggleChat: () => {
        const isOpen = !get().isChatOpen;
        set({ isChatOpen: isOpen });
        
        // 채팅창을 열 때 읽지 않은 메시지들을 읽음 처리
        if (isOpen) {
          get().markAsRead();
        }
      },

      // 연결 상태 설정
      setConnected: (connected) => set({ isConnected: connected }),

      // 타이핑 상태 설정
      setTyping: (typing) => set({ isTyping: typing }),

      // 관리자 온라인 상태 설정
      setAdminOnline: (online) => set({ adminOnline: online }),

      // === 어드민 전용 기능들 ===

      // 활성 채팅방 설정
      setActiveChatRoom: (roomId) => set({ activeChatRoom: roomId }),

      // 새 채팅방 생성
      createChatRoom: (userId, userNickname) => {
        const existingRoom = get().chatRooms.find(room => room.userId === userId);
        if (existingRoom) {
          set({ activeChatRoom: existingRoom.id });
          return;
        }

        const newRoom: ChatRoom = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          userId,
          userNickname,
          messages: [],
          unreadCount: 0,
          isActive: true,
          createdAt: Date.now(),
        };

        set((state) => ({
          chatRooms: [...state.chatRooms, newRoom],
          activeChatRoom: newRoom.id,
        }));
      },

      // 특정 채팅방에 메시지 추가
      addMessageToRoom: (roomId, messageData) => {
        const newMessage: ChatMessage = {
          ...messageData,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          timestamp: Date.now(),
          isRead: false,
        };

        set((state) => ({
          chatRooms: state.chatRooms.map(room => 
            room.id === roomId 
              ? { 
                  ...room, 
                  messages: [...room.messages, newMessage],
                  lastMessage: newMessage,
                  unreadCount: messageData.isAdmin ? room.unreadCount : room.unreadCount + 1,
                }
              : room
          ),
        }));
      },
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({
        messages: state.messages,
        chatRooms: state.chatRooms,
      }),
    }
  )
);

// 채팅 초기화 함수 (사용자 로그인 시 호출)
export const initializeChat = () => {
  const session = CreditManager.getSession();
  
  if (session) {
    const currentUser: ChatUser = {
      id: session.boundIP || Date.now().toString(),
      nickname: session.code,
      isAdmin: session.code === 'ADMIN999',
      isOnline: true,
      lastSeen: Date.now(),
    };

    useChatStore.getState().setCurrentUser(currentUser);

    // 어드민인 경우 모든 채팅방 로드
    if (currentUser.isAdmin) {
      // 어드민 채팅방 초기화 로직
      console.log('🔑 관리자 채팅 모드 활성화');
    }
  }

  // 브라우저 알림 권한 요청
  if (Notification.permission === 'default') {
    Notification.requestPermission();
  }
};