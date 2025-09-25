import React, { useState, useEffect, useRef } from 'react';

interface ChatMessage {
  id: number;
  message: string;
  nickname: string;
  timestamp: number;
  createdAt: string;
}

const PublicChatComponent: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [nickname, setNickname] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isNicknameFixed, setIsNicknameFixed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 로컬 스토리지에서 닉네임 불러오기
  useEffect(() => {
    const savedNickname = localStorage.getItem('publicChatNickname');
    if (savedNickname) {
      setNickname(savedNickname);
    }
  }, []);

  // 메시지 자동 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 메시지 불러오기
  const loadMessages = async () => {
    try {
      const response = await fetch('/api/public-chat/messages');
      const data = await response.json();
      setMessages(data.messages || []);
      
      // 서버에서 고정된 닉네임이 있으면 설정
      if (data.fixedNickname) {
        setNickname(data.fixedNickname);
        setIsNicknameFixed(true);
        localStorage.setItem('publicChatNickname', data.fixedNickname);
      } else {
        setIsNicknameFixed(false);
      }
    } catch (error) {
      console.error('메시지 불러오기 오류:', error);
    }
  };

  // 메시지 전송
  const sendMessage = async () => {
    if (!newMessage.trim() || !nickname.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/public-chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: newMessage.trim(),
          nickname: nickname.trim()
        })
      });

      if (response.ok) {
        const responseData = await response.json();
        setNewMessage('');
        
        // 서버에서 반환된 고정 닉네임으로 업데이트
        if (responseData.fixedNickname) {
          setNickname(responseData.fixedNickname);
          setIsNicknameFixed(true);
          localStorage.setItem('publicChatNickname', responseData.fixedNickname);
        }
        
        // 메시지 다시 불러오기
        loadMessages();
      } else {
        const error = await response.json();
        alert(error.error || '메시지 전송 실패');
      }
    } catch (error) {
      console.error('메시지 전송 오류:', error);
      alert('메시지 전송 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 엔터키로 전송
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // 메시지 실시간 업데이트 (5초마다)
  useEffect(() => {
    if (isVisible) {
      loadMessages();
      const interval = setInterval(loadMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  // 시간 포맷팅
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      {/* 채팅 토글 버튼 */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50"
        title="공개 채팅"
      >
        💬 {messages.length > 0 && <span className="ml-1 text-xs">({messages.length})</span>}
      </button>

      {/* 채팅 창 */}
      {isVisible && (
        <div className="fixed bottom-20 right-6 w-80 h-96 bg-gray-900 rounded-lg shadow-2xl border border-gray-700 flex flex-col z-40">
          {/* 헤더 */}
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-lg">
            <h3 className="text-white font-semibold">💬 공개 채팅</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-white hover:text-gray-300 text-xl"
            >
              ×
            </button>
          </div>

          {/* 메시지 영역 */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.length === 0 ? (
              <div className="text-gray-400 text-center text-sm">
                아직 메시지가 없습니다.<br />
                첫 번째 메시지를 남겨보세요! 👋
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-400 font-semibold">{msg.nickname}</span>
                    <span className="text-gray-500 text-xs">{formatTime(msg.timestamp)}</span>
                  </div>
                  <div className="text-gray-200 mt-1 pl-2 border-l-2 border-gray-700">
                    {msg.message}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 입력 영역 */}
          <div className="p-3 border-t border-gray-700">
            {/* 닉네임 입력 */}
            <div className="relative">
              <input
                type="text"
                value={nickname}
                onChange={(e) => !isNicknameFixed && setNickname(e.target.value)}
                placeholder={isNicknameFixed ? "고정된 닉네임" : "닉네임"}
                className={`w-full mb-2 px-3 py-1 text-white border rounded text-sm focus:outline-none ${
                  isNicknameFixed 
                    ? 'bg-gray-700 border-gray-500 cursor-not-allowed' 
                    : 'bg-gray-800 border-gray-600 focus:border-blue-500'
                }`}
                maxLength={20}
                readOnly={isNicknameFixed}
              />
              {isNicknameFixed && (
                <div className="absolute right-2 top-1 text-xs text-green-400">
                  🔒 고정됨
                </div>
              )}
            </div>
            
            {/* 메시지 입력 */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="메시지를 입력하세요..."
                className="flex-1 px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded text-sm focus:outline-none focus:border-blue-500"
                maxLength={200}
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim() || !nickname.trim() || isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? '⏳' : '📤'}
              </button>
            </div>
            
            <div className="text-xs text-gray-500 mt-1">
              {newMessage.length}/200 • 엔터로 전송
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PublicChatComponent;