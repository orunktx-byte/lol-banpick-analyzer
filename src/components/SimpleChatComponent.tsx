import React, { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  isAdmin: boolean;
  username?: string;
  isRead?: boolean;
}

interface AdminChatComponentProps {
  isAdmin: boolean;
}

const AdminChatComponent: React.FC<AdminChatComponentProps> = ({ isAdmin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [myUserId, setMyUserId] = useState<string>('');
  const [unreadCount, setUnreadCount] = useState(0);
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

  // 폴링 시작 - 간단한 1:1 대화
  useEffect(() => {
    if (isOpen && (isAdmin || isUsernameSet)) {
      loadMessages();
      pollInterval.current = setInterval(loadMessages, 2000); // 2초마다 폴링
    }

    return () => {
      if (pollInterval.current) {
        clearInterval(pollInterval.current);
      }
    };
  }, [isOpen, isUsernameSet, isAdmin]);

  // 1:1 대화 메시지 로드
  const loadMessages = async () => {
    try {
      const endpoint = isAdmin 
        ? '/api/simple-chat/admin-messages'
        : `/api/simple-chat/user-messages/${myUserId}`;
        
      console.log(`🔄 메시지 로드 시도: ${endpoint} (사용자: ${isAdmin ? '관리자' : myUserId})`);
        
      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        const newMessages = data.messages || [];
        
        console.log(`📨 메시지 로드 성공: ${newMessages.length}개 메시지`);
        console.log('최근 메시지:', newMessages.slice(-3));
        
        setMessages(newMessages);
        
        // 미읽은 메시지 수 업데이트 (관리자용)
        if (isAdmin) {
          const unread = newMessages.filter((msg: Message) => !msg.isAdmin && !msg.isRead).length;
          setUnreadCount(unread);
          console.log(`📬 미읽은 메시지: ${unread}개`);
        }
      } else {
        console.error('❌ 메시지 로드 실패:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('❌ 메시지 로드 오류:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    if (!isAdmin && !username.trim()) return;

    try {
      const payload = {
        userId: isAdmin ? 'admin' : myUserId,
        content: inputMessage.trim(),
        isAdmin,
        username: isAdmin ? '관리자' : username
      };

      console.log(`📤 메시지 전송 시도:`, payload);

      const response = await fetch('/api/simple-chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ 메시지 전송 성공:`, result);
        setInputMessage('');
        loadMessages(); // 즉시 새로고침
      } else {
        console.error('❌ 메시지 전송 실패:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('❌ 메시지 전송 오류:', error);
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

  // 읽음 처리 (관리자용)
  const markAsRead = async () => {
    if (isAdmin && isOpen) {
      try {
        await fetch('/api/simple-chat/mark-read', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        setUnreadCount(0);
      } catch (error) {
        console.error('읽음 처리 오류:', error);
      }
    }
  };

  useEffect(() => {
    if (isAdmin && isOpen) {
      markAsRead();
    }
  }, [isAdmin, isOpen, messages]);

  return (
    <>
      {/* 채팅 토글 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-lol-gold hover:bg-yellow-500 text-black font-bold p-3 rounded-full shadow-lg transition-all duration-300 z-50"
        title={isAdmin ? "관리자 대화함" : "문의하기"}
      >
        {isAdmin ? '👑💬' : '🙋‍♂️'}
        {(!isAdmin ? false : unreadCount > 0) && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
            {unreadCount}
          </span>
        )}
      </button>

      {/* 채팅창 - 단순한 1:1 대화함 */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-80 h-[500px] bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-40 flex flex-col">
          {/* 헤더 */}
          <div className="bg-lol-blue text-white p-3 rounded-t-lg flex justify-between items-center">
            <h3 className="font-bold">
              {isAdmin ? '👑 관리자 대화함' : '💬 관리자와 대화'}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-red-400"
            >
              ✕
            </button>
          </div>

          {!isAdmin && !isUsernameSet ? (
            /* 닉네임 설정 (일반 사용자만) */
            <div className="flex-1 flex flex-col justify-center items-center p-4">
              <h4 className="text-white mb-4">이름을 입력하세요</h4>
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
                대화 시작
              </button>
            </div>
          ) : (
            /* 대화 영역 */
            <>
              {/* 메시지 목록 */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-400 mt-8">
                    {isAdmin ? '사용자의 문의를 기다리고 있습니다...' : '관리자에게 문의하세요!'}
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.isAdmin ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] p-3 rounded-lg ${
                        msg.isAdmin 
                          ? 'bg-lol-gold text-black' 
                          : 'bg-gray-600 text-white'
                      }`}>
                        {!msg.isAdmin && msg.username && (
                          <div className="text-xs font-bold mb-1 opacity-70">
                            {msg.username}
                          </div>
                        )}
                        {msg.isAdmin && (
                          <div className="text-xs font-bold mb-1 opacity-70">
                            👑 관리자
                          </div>
                        )}
                        <div className="text-sm leading-relaxed">{msg.content}</div>
                        <div className="text-xs opacity-60 mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* 입력 영역 */}
              <div className="p-3 border-t border-gray-600 bg-gray-750">
                <div className="flex space-x-2 mb-2">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isAdmin ? "답변을 입력하세요..." : "관리자에게 문의하세요..."}
                    className="flex-1 p-2 border border-gray-600 rounded bg-gray-700 text-white text-sm resize-none"
                    rows={2}
                    maxLength={500}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim()}
                    className="bg-lol-gold hover:bg-yellow-500 disabled:bg-gray-600 disabled:text-gray-400 text-black px-4 py-2 rounded font-bold"
                  >
                    전송
                  </button>
                </div>
                <div className="text-gray-400 text-xs flex justify-between">
                  <span>{isAdmin ? '👑 관리자' : `💬 ${username}`}</span>
                  <span>{inputMessage.length}/500</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default AdminChatComponent;