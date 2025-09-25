import React, { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: Date;
  isAdmin: boolean;
  isRead: boolean;
}

interface Conversation {
  userId: string;
  username: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isActive: boolean;
}

interface AdminChatComponentProps {
  isAdmin: boolean;
}

const AdminChatComponent: React.FC<AdminChatComponentProps> = ({ isAdmin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [myUserId, setMyUserId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollInterval = useRef<NodeJS.Timeout | null>(null);

  // 고유 사용자 ID 생성 (일반 사용자용)
  useEffect(() => {
    if (!isAdmin) {
      let userId = localStorage.getItem('chatUserId');
      if (!userId) {
        userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('chatUserId', userId);
      }
      setMyUserId(userId);
    }
  }, [isAdmin]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 폴링 시작
  useEffect(() => {
    if (isOpen && (isAdmin || isUsernameSet)) {
      if (isAdmin) {
        loadConversations();
        pollInterval.current = setInterval(loadConversations, 3000);
      } else {
        loadMyMessages();
        pollInterval.current = setInterval(loadMyMessages, 2000);
      }
    }

    return () => {
      if (pollInterval.current) {
        clearInterval(pollInterval.current);
      }
    };
  }, [isOpen, isUsernameSet, isAdmin, selectedUserId]);

  // 관리자: 모든 대화 목록 로드
  const loadConversations = async () => {
    try {
      const response = await fetch('/api/admin-chat/conversations');
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
        
        // 선택된 사용자의 메시지도 로드
        if (selectedUserId) {
          loadUserMessages(selectedUserId);
        }
      }
    } catch (error) {
      console.error('대화 목록 로드 오류:', error);
    }
  };

  // 관리자: 특정 사용자와의 메시지 로드
  const loadUserMessages = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin-chat/messages/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('사용자 메시지 로드 오류:', error);
    }
  };

  // 일반 사용자: 자신의 메시지만 로드
  const loadMyMessages = async () => {
    try {
      const response = await fetch(`/api/admin-chat/my-messages/${myUserId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('내 메시지 로드 오류:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    if (!isAdmin && !username.trim()) return;

    try {
      const payload = isAdmin ? {
        fromUserId: 'admin',
        toUserId: selectedUserId,
        content: inputMessage.trim(),
        isAdmin: true
      } : {
        fromUserId: myUserId,
        toUserId: 'admin',
        username: username,
        content: inputMessage.trim(),
        isAdmin: false
      };

      const response = await fetch('/api/admin-chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setInputMessage('');
        if (isAdmin) {
          loadUserMessages(selectedUserId!);
          loadConversations();
        } else {
          loadMyMessages();
        }
      }
    } catch (error) {
      console.error('메시지 전송 오류:', error);
    }
  };

  const handleUsernameSubmit = () => {
    if (username.trim()) {
      setIsUsernameSet(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isUsernameSet && !isAdmin) {
        handleUsernameSubmit();
      } else {
        sendMessage();
      }
    }
  };

  const handleConversationSelect = (userId: string) => {
    setSelectedUserId(userId);
    loadUserMessages(userId);
    
    // 읽음 처리
    markAsRead(userId);
  };

  const markAsRead = async (userId: string) => {
    try {
      await fetch('/api/admin-chat/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
    } catch (error) {
      console.error('읽음 처리 오류:', error);
    }
  };

  // 총 미읽은 메시지 수 계산
  const totalUnreadCount = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  return (
    <>
      {/* 채팅 토글 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-lol-gold hover:bg-yellow-500 text-black font-bold p-3 rounded-full shadow-lg transition-all duration-300 z-50"
        title={isAdmin ? "관리자 채팅" : "문의하기"}
      >
        {isAdmin ? '👑💬' : '🙋‍♂️'}
        {(isAdmin ? totalUnreadCount : 0) > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
            {isAdmin ? totalUnreadCount : ''}
          </span>
        )}
      </button>

      {/* 채팅창 */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-96 h-[500px] bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-40 flex flex-col">
          {/* 헤더 */}
          <div className="bg-lol-blue text-white p-3 rounded-t-lg flex justify-between items-center">
            <h3 className="font-bold">
              {isAdmin ? '👑 관리자 채팅' : '문의하기'}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-red-400"
            >
              ✕
            </button>
          </div>

          {isAdmin ? (
            /* 관리자 인터페이스 */
            <div className="flex flex-1 overflow-hidden">
              {/* 대화 목록 */}
              <div className="w-32 bg-gray-700 border-r border-gray-600 overflow-y-auto">
                <div className="p-2 text-xs text-gray-300 border-b border-gray-600">
                  문의 목록 ({conversations.length})
                </div>
                {conversations.map((conv) => (
                  <div
                    key={conv.userId}
                    onClick={() => handleConversationSelect(conv.userId)}
                    className={`p-2 cursor-pointer border-b border-gray-600 hover:bg-gray-600 ${
                      selectedUserId === conv.userId ? 'bg-gray-600' : ''
                    }`}
                  >
                    <div className="text-xs text-white truncate">{conv.username}</div>
                    <div className="text-xs text-gray-400 truncate">{conv.lastMessage}</div>
                    <div className="flex justify-between items-center mt-1">
                      <div className="text-xs text-gray-500">
                        {new Date(conv.lastMessageTime).toLocaleTimeString().substring(0, 5)}
                      </div>
                      {conv.unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full px-1">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* 메시지 영역 */}
              <div className="flex-1 flex flex-col">
                {selectedUserId ? (
                  <>
                    {/* 메시지 목록 */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                      {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.isAdmin ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[70%] p-2 rounded-lg ${
                            msg.isAdmin 
                              ? 'bg-lol-gold text-black' 
                              : 'bg-gray-600 text-white'
                          }`}>
                            <div className="text-sm">{msg.content}</div>
                            <div className="text-xs opacity-70 mt-1">
                              {new Date(msg.timestamp).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* 입력 영역 */}
                    <div className="p-3 border-t border-gray-600">
                      <div className="flex space-x-2">
                        <input
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="답변 입력..."
                          className="flex-1 p-2 border border-gray-600 rounded bg-gray-700 text-white text-sm"
                          maxLength={500}
                        />
                        <button
                          onClick={sendMessage}
                          disabled={!inputMessage.trim()}
                          className="bg-lol-gold hover:bg-yellow-500 disabled:bg-gray-600 disabled:text-gray-400 text-black px-3 py-2 rounded font-bold"
                        >
                          전송
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-400">
                    문의를 선택하세요
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* 일반 사용자 인터페이스 */
            <>
              {!isUsernameSet ? (
                /* 닉네임 설정 */
                <div className="flex-1 flex flex-col justify-center items-center p-4">
                  <h4 className="text-white mb-4">문의자 이름을 입력하세요</h4>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="이름 또는 닉네임"
                    className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white mb-4"
                    maxLength={20}
                  />
                  <button
                    onClick={handleUsernameSubmit}
                    className="bg-lol-gold hover:bg-yellow-500 text-black px-4 py-2 rounded font-bold"
                    disabled={!username.trim()}
                  >
                    문의 시작
                  </button>
                </div>
              ) : (
                /* 채팅 영역 */
                <>
                  {/* 메시지 목록 */}
                  <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.isAdmin ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[80%] p-2 rounded-lg ${
                          msg.isAdmin 
                            ? 'bg-yellow-100 text-black border-l-4 border-yellow-500' 
                            : 'bg-lol-blue text-white'
                        }`}>
                          {msg.isAdmin && (
                            <div className="text-xs font-bold text-yellow-700 mb-1">👑 관리자</div>
                          )}
                          <div className="text-sm">{msg.content}</div>
                          <div className="text-xs opacity-70 mt-1">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* 입력 영역 */}
                  <div className="p-3 border-t border-gray-600">
                    <div className="flex space-x-2">
                      <textarea
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="문의 내용을 입력하세요..."
                        className="flex-1 p-2 border border-gray-600 rounded bg-gray-700 text-white text-sm resize-none"
                        rows={2}
                        maxLength={500}
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!inputMessage.trim()}
                        className="bg-lol-gold hover:bg-yellow-500 disabled:bg-gray-600 disabled:text-gray-400 text-black px-3 py-2 rounded font-bold"
                      >
                        전송
                      </button>
                    </div>
                    <div className="text-gray-400 text-xs mt-1">
                      {inputMessage.length}/500
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default AdminChatComponent;