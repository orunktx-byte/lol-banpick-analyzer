// 실시간 채팅 통신 서비스 (로컬 시뮬레이션)
import { useChatStore } from '../stores/chatStore';
import type { ChatMessage } from '../types/chat';

class ChatService {
  private pollInterval: number | null = null;
  private lastMessageTime: number = 0;

  // 채팅 서비스 시작
  start() {
    console.log('💬 채팅 서비스 시작');
    useChatStore.getState().setConnected(true);
    
    // 3초마다 새 메시지 확인
    this.pollInterval = window.setInterval(() => {
      this.checkForNewMessages();
      this.simulateAdminPresence();
    }, 3000);

    // 관리자 응답 시뮬레이션 (개발용)
    this.setupDemoResponses();
  }

  // 채팅 서비스 중지
  stop() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    useChatStore.getState().setConnected(false);
    console.log('💬 채팅 서비스 중지');
  }

  // 메시지 전송
  sendMessage(message: string, isAdmin: boolean = false) {
    const chatStore = useChatStore.getState();
    const currentUser = chatStore.currentUser;
    
    if (!currentUser) {
      console.error('❌ 사용자 정보가 없습니다');
      return;
    }

    const messageData = {
      userId: currentUser.id,
      userNickname: currentUser.nickname,
      message: message.trim(),
      isAdmin,
      isRead: false,
    };

    // 로컬 스토어에 추가
    chatStore.addMessage(messageData);

    // 글로벌 메시지 저장소에 저장 (다른 탭과 공유)
    const globalMessages = this.getGlobalMessages();
    const newMessage: ChatMessage = {
      ...messageData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };
    
    globalMessages.push(newMessage);
    localStorage.setItem('globalChatMessages', JSON.stringify(globalMessages));
    
    console.log(`📤 메시지 전송: ${isAdmin ? '[관리자]' : '[사용자]'} ${message}`);

    // 사용자가 메시지를 보냈을 때 자동 응답 트리거 (개발용)
    if (!isAdmin) {
      this.triggerAutoResponse(message);
    }
  }

  // 새 메시지 확인 (polling)
  private checkForNewMessages() {
    const globalMessages = this.getGlobalMessages();
    const chatStore = useChatStore.getState();
    const currentUser = chatStore.currentUser;
    
    if (!currentUser) return;

    // 마지막 확인 시점 이후의 새 메시지만 가져오기
    const newMessages = globalMessages.filter(msg => 
      msg.timestamp > this.lastMessageTime &&
      msg.userId !== currentUser.id // 자신이 보낸 메시지는 제외
    );

    newMessages.forEach(msg => {
      chatStore.addMessage({
        userId: msg.userId,
        userNickname: msg.userNickname,
        message: msg.message,
        isAdmin: msg.isAdmin,
        isRead: false,
      });
    });

    if (newMessages.length > 0) {
      this.lastMessageTime = Math.max(...newMessages.map(msg => msg.timestamp));
    }
  }

  // 글로벌 메시지 저장소에서 메시지 가져오기
  private getGlobalMessages(): ChatMessage[] {
    try {
      const stored = localStorage.getItem('globalChatMessages');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  // 관리자 온라인 상태 시뮬레이션
  private simulateAdminPresence() {
    const isOnline = Math.random() > 0.3; // 70% 확률로 온라인
    useChatStore.getState().setAdminOnline(isOnline);
  }

  // 자동 응답 트리거 (개발용)
  private triggerAutoResponse(userMessage: string) {
    // 30% 확률로 자동 응답
    if (Math.random() < 0.3) {
      setTimeout(() => {
        const responses = [
          '안녕하세요! 어떤 도움이 필요하신가요? 🤝',
          '문의해주셔서 감사합니다. 확인해보겠습니다! 🔍',
          '네, 말씀해주시면 도움드리겠습니다! 💪',
          '크레딧이나 분석 관련 질문이시군요! 답변드릴게요 📊',
          '잠시만요, 관련 정보를 찾아보겠습니다 🔎',
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        this.sendMessage(randomResponse, true); // 관리자 메시지로 전송
      }, 2000 + Math.random() * 3000); // 2-5초 후 응답
    }
  }

  // 데모 응답 설정 (개발용)
  private setupDemoResponses() {
    // 특정 키워드에 대한 자동 응답
    const keywords = {
      '크레딧': '💳 크레딧 관련 문의시 코드명과 함께 문의해주세요!',
      '분석': '📊 분석 기능에 대한 자세한 설명을 도와드릴게요!',
      '오류': '🚨 오류 상황을 자세히 알려주시면 빠르게 해결해드리겠습니다!',
      '안녕': '👋 안녕하세요! LOL 밴픽 분석기 고객지원입니다!',
    };

    // 글로벌 메시지 모니터링
    let lastChecked = Date.now();
    
    setInterval(() => {
      const globalMessages = this.getGlobalMessages();
      const recentMessages = globalMessages.filter(msg => 
        msg.timestamp > lastChecked && !msg.isAdmin
      );

      recentMessages.forEach(msg => {
        Object.entries(keywords).forEach(([keyword, response]) => {
          if (msg.message.includes(keyword)) {
            setTimeout(() => {
              this.sendMessage(response, true);
            }, 1000 + Math.random() * 2000);
          }
        });
      });

      if (recentMessages.length > 0) {
        lastChecked = Math.max(...recentMessages.map(msg => msg.timestamp));
      }
    }, 5000);
  }

  // 채팅 기록 초기화
  clearHistory() {
    localStorage.removeItem('globalChatMessages');
    useChatStore.setState({ messages: [], unreadCount: 0 });
    console.log('🗑️ 채팅 기록 초기화');
  }
}

// 싱글톤 인스턴스
export const chatService = new ChatService();