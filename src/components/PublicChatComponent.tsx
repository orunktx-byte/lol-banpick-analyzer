import React, { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  username: string;
  content: string;
  timestamp: Date;
  isAdmin: boolean;
}

interface PublicChatComponentProps {
  isAdmin: boolean;
}

const PublicChatComponent: React.FC<PublicChatComponentProps> = ({ isAdmin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollInterval = useRef<NodeJS.Timeout | null>(null);

  // 메시지 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 메시지 폴링 (Vercel은 WebSocket을 지원하지 않으므로)
  useEffect(() => {
    if (isOpen && isUsernameSet) {
      loadMessages();
      pollInterval.current = setInterval(loadMessages, 2000); // 2초마다 폴링
    }

    return () => {
      if (pollInterval.current) {
        clearInterval(pollInterval.current);
      }
    };
  }, [isOpen, isUsernameSet]);

  const loadMessages = async () => {
    try {
      const response = await fetch('/api/chat/messages');
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
        setConnectedUsers(data.connectedUsers || 0);
      }
    } catch (error) {
      console.error('메시지 로드 오류:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !username.trim()) return;

    try {
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: isAdmin ? `👑 ${username}` : username,
          content: inputMessage.trim(),
          isAdmin
        }),
      });

      if (response.ok) {
        setInputMessage('');
        loadMessages(); // 즉시 메시지 새로고침
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
      if (!isUsernameSet) {
        handleUsernameSubmit();
      } else {
        sendMessage();
      }
    }
  };

  return (
    <>
      {/* 채팅 토글 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-lol-gold hover:bg-yellow-500 text-black font-bold p-3 rounded-full shadow-lg transition-all duration-300 z-50"
        title="실시간 채팅"
      >
        {isOpen ? '💬' : '💬'}
        {connectedUsers > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
            {connectedUsers}
          </span>
        )}
      </button>

      {/* 채팅창 */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-80 h-96 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-40 flex flex-col">
          {/* 헤더 */}
          <div className="bg-lol-blue text-white p-3 rounded-t-lg flex justify-between items-center">
            <h3 className="font-bold">실시간 채팅</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm">👥 {connectedUsers}</span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-red-400"
              >
                ✕
              </button>
            </div>
          </div>

          {!isUsernameSet ? (
            /* 닉네임 설정 */
            <div className="flex-1 flex flex-col justify-center items-center p-4">
              <h4 className="text-white mb-4">닉네임을 입력하세요</h4>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="닉네임"
                className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white mb-4"
                maxLength={20}
              />
              <button
                onClick={handleUsernameSubmit}
                className="bg-lol-gold hover:bg-yellow-500 text-black px-4 py-2 rounded font-bold"
                disabled={!username.trim()}
              >
                채팅 시작
              </button>
            </div>
          ) : (
            /* 채팅 영역 */
            <>
              {/* 메시지 목록 */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {messages.map((msg) => (
                  <div key={msg.id} className={`${msg.isAdmin ? 'border-l-4 border-yellow-500 pl-2' : ''}`}>
                    <div className="flex items-start space-x-2">
                      <span className={`text-sm font-bold ${msg.isAdmin ? 'text-yellow-400' : 'text-lol-gold'}`}>
                        {msg.username}:
                      </span>
                      <span className="text-white text-sm flex-1">
                        {msg.content}
                      </span>
                    </div>
                    <div className="text-gray-400 text-xs ml-2">
                      {new Date(msg.timestamp).toLocaleTimeString()}
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
                    placeholder="메시지 입력... (Enter: 전송, Shift+Enter: 줄바꿈)"
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
                  {isAdmin && '👑 관리자'} | {inputMessage.length}/500
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default PublicChatComponent;