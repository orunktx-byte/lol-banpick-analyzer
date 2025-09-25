import React, { useState, useEffect, useRef } from 'react';
import { useChatStore, initializeChat } from '../stores/chatStore';
import { chatService } from '../services/chatService';
import { CreditManager } from '../utils/creditManager';

interface ChatComponentProps {
  className?: string;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ className = '' }) => {
  const {
    currentUser,
    messages,
    isConnected,
    isTyping,
    adminOnline,
    isChatOpen,
    unreadCount,
    addMessage,
    toggleChat,
    markAsRead,
  } = useChatStore();

  const [messageInput, setMessageInput] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 초기화
  useEffect(() => {
    const session = CreditManager.getSession();
    if (session && !isInitialized) {
      initializeChat();
      chatService.start();
      setIsInitialized(true);
    }

    return () => {
      if (isInitialized) {
        chatService.stop();
      }
    };
  }, [isInitialized]);

  // 메시지 목록 스크롤을 맨 아래로
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 채팅창이 열릴 때 읽지 않은 메시지 읽음 처리
  useEffect(() => {
    if (isChatOpen && unreadCount > 0) {
      markAsRead();
    }
  }, [isChatOpen, unreadCount, markAsRead]);

  // 메시지 전송
  const handleSendMessage = () => {
    if (!messageInput.trim() || !currentUser) return;

    chatService.sendMessage(messageInput, currentUser.isAdmin);
    setMessageInput('');
  };

  // Enter 키로 메시지 전송
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 시간 포맷팅
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // 사용자가 로그인하지 않은 경우
  if (!currentUser) {
    return null;
  }

  return (
    <>
      {/* 채팅 토글 버튼 */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 z-40 bg-lol-gold text-black p-4 rounded-full shadow-lg hover:bg-yellow-400 transition-all duration-300 ${className}`}
        title="고객지원 채팅"
      >
        <div className="relative">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          
          {/* 읽지 않은 메시지 배지 */}
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
          
          {/* 연결 상태 표시 */}
          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
        </div>
      </button>

      {/* 채팅창 */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-96 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-50 flex flex-col">
          {/* 헤더 */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800 rounded-t-lg">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-lol-gold" />
              <span className="text-white font-medium">고객지원</span>
              {adminOnline && (
                <span className="text-green-400 text-xs">● 온라인</span>
              )}
            </div>
            <button
              onClick={toggleChat}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 메시지 목록 */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-850">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 mt-8">
                <div className="text-4xl mb-2">💬</div>
                <div className="text-sm">
                  안녕하세요! 궁금한 점이 있으시면<br />
                  언제든 문의해주세요!
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isAdmin ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-xs px-3 py-2 rounded-lg ${
                    message.isAdmin 
                      ? 'bg-gray-700 text-white' 
                      : 'bg-lol-gold text-black'
                  }`}>
                    {message.isAdmin && (
                      <div className="text-xs text-gray-300 mb-1">관리자</div>
                    )}
                    <div className="text-sm">{message.message}</div>
                    <div className={`text-xs mt-1 ${
                      message.isAdmin ? 'text-gray-400' : 'text-gray-700'
                    }`}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {/* 타이핑 표시 */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-700 text-white px-3 py-2 rounded-lg">
                  <div className="text-xs text-gray-300 mb-1">관리자</div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* 메시지 입력창 */}
          <div className="p-4 border-t border-gray-700 bg-gray-800 rounded-b-lg">
            <div className="flex space-x-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="메시지를 입력하세요..."
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-lol-gold"
                maxLength={500}
              />
              <button
                onClick={handleSendMessage}
                disabled={!messageInput.trim() || !isConnected}
                className="px-4 py-2 bg-lol-gold text-black rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-400 transition-colors"
              >
                전송
              </button>
            </div>
            
            {/* 연결 상태 표시 */}
            <div className="flex items-center justify-between mt-2 text-xs">
              <span className={`${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                {isConnected ? '● 연결됨' : '● 연결 끊김'}
              </span>
              <span className="text-gray-400">
                {currentUser.nickname} {currentUser.isAdmin && '(관리자)'}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatComponent;