// 실시간 채팅 관련 타입 정의

export interface ChatMessage {
  id: string;
  userId: string;
  userNickname: string;
  message: string;
  timestamp: number;
  isAdmin: boolean;
  isRead: boolean;
}

export interface ChatUser {
  id: string;
  nickname: string;
  isAdmin: boolean;
  isOnline: boolean;
  lastSeen: number;
}

export interface ChatRoom {
  id: string;
  userId: string;
  userNickname: string;
  messages: ChatMessage[];
  unreadCount: number;
  lastMessage?: ChatMessage;
  isActive: boolean;
  createdAt: number;
}

export interface ChatState {
  // 현재 사용자 정보
  currentUser: ChatUser | null;
  
  // 채팅방 관리 (어드민용)
  chatRooms: ChatRoom[];
  activeChatRoom: string | null;
  
  // 현재 채팅 메시지들 (일반 사용자용)
  messages: ChatMessage[];
  
  // 연결 상태
  isConnected: boolean;
  isTyping: boolean;
  adminOnline: boolean;
  
  // UI 상태
  isChatOpen: boolean;
  unreadCount: number;
  
  // 액션들
  setCurrentUser: (user: ChatUser) => void;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  markAsRead: (messageId?: string) => void;
  toggleChat: () => void;
  setConnected: (connected: boolean) => void;
  setTyping: (typing: boolean) => void;
  setAdminOnline: (online: boolean) => void;
  
  // 어드민 전용
  setActiveChatRoom: (roomId: string | null) => void;
  createChatRoom: (userId: string, userNickname: string) => void;
  addMessageToRoom: (roomId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
}