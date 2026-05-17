import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../services/apiClient';

interface BookInfo {
  id: number;
  title: string;
  coverImageUrl?: string;
  price: number;
}

interface ChatMessage {
  id?: number;
  message: string;
  sender: 'USER' | 'BOT';
  sentAt?: string;
  book?: BookInfo;
}

export function ChatWidget() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && user?.id) {
      loadHistory();
    }
  }, [isOpen, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadHistory = async () => {
    if (!user?.id) return;
    try {
      const history = await apiClient.get<ChatMessage[]>(`api/chat/history/${user.id}`);
      setMessages(history);
    } catch (error) {
      console.error('Failed to load chat history', error);
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const newMessage: ChatMessage = {
      message: inputValue,
      sender: 'USER',
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await apiClient.post<ChatMessage>('api/chat/send', {
        userId: user?.id ? parseInt(user.id, 10) : null,
        message: newMessage.message,
      });

      setMessages((prev) => [...prev, response]);
    } catch (error: any) {
      console.error('Failed to send message', error);
      setMessages((prev) => [
        ...prev,
        { message: 'Xin lỗi, tôi đang gặp trục trặc kỹ thuật. Hãy thử lại sau nhé!', sender: 'BOT' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  if (!user) {
    return null;
  }

  const formatMessage = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      // Replace **bold** with <b>bold</b>
      const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
      return (
        <React.Fragment key={i}>
          <span dangerouslySetInnerHTML={{ __html: formattedLine }} />
          {i !== text.split('\n').length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div 
          className="mb-4 w-80 md:w-96 rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-200 transition-all duration-300 transform origin-bottom-right"
          style={{ backgroundColor: '#f5f2ed', height: '500px' }}
        >
          {/* Header */}
          <div 
            className="p-4 flex justify-between items-center text-white"
            style={{ backgroundColor: '#000666' }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <h3 className="font-semibold">The Archive Support</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 text-sm mt-4">
                Bắt đầu trò chuyện với chúng tôi!
              </div>
            )}
            
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col max-w-[80%] ${msg.sender === 'USER' ? 'self-end' : 'self-start'}`}
              >
                <div 
                  className={`p-3 rounded-2xl ${
                    msg.sender === 'USER' 
                      ? 'rounded-tr-none text-white' 
                      : 'rounded-tl-none bg-white text-gray-800 border border-gray-100 shadow-sm'
                  }`}
                  style={msg.sender === 'USER' ? { backgroundColor: '#000666' } : {}}
                >
                  <p className="text-sm break-words">{formatMessage(msg.message)}</p>
                </div>
                
                {/* Render Book Info if available */}
                {msg.book && (
                  <div className="mt-2 bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                    {msg.book.coverImageUrl && (
                      <img 
                        src={msg.book.coverImageUrl} 
                        alt={msg.book.title} 
                        className="w-full h-32 object-cover"
                      />
                    )}
                    <div className="p-3">
                      <h4 className="font-semibold text-sm line-clamp-2">{msg.book.title}</h4>
                      <p className="text-red-600 font-bold text-sm mt-1">
                        {msg.book.price.toLocaleString('vi-VN')} đ
                      </p>
                      <button className="w-full mt-2 py-1.5 text-xs font-medium text-white rounded-lg transition-colors" style={{ backgroundColor: '#000666' }}>
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="self-start bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1 items-center">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-200">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập tin nhắn..."
                className="flex-1 bg-gray-100 text-gray-800 text-sm rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#000666]/30"
              />
              <button
                onClick={sendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="p-2.5 rounded-full text-white disabled:opacity-50 transition-colors flex-shrink-0"
                style={{ backgroundColor: '#000666' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white hover:scale-110 transition-transform duration-300"
          style={{ backgroundColor: '#000666' }}
          aria-label="Open Chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}
    </div>
  );
}
