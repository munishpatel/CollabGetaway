import React, { useEffect, useState, useRef } from 'react';
import { useYjs } from '../context/YjsContext';
import { addChange } from '../utils/changeFeedUtils';

export default function Chat() {
  const { ydoc, users } = useYjs();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!ydoc) return;

    const ychat = ydoc.getArray('chat');
    const updateMessages = () => {
      setMessages(ychat.toArray());
      scrollToBottom();
    };

    ychat.observe(updateMessages);
    updateMessages();

    return () => {
      ychat.unobserve(updateMessages);
    };
  }, [ydoc]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !ydoc) return;
    
    const ychat = ydoc.getArray('chat');
    const userName = localStorage.getItem("collabUserName") || "Anonymous";
    const userColor = users.find(u => u.name === userName)?.color || '#6366f1';
    
    ychat.push([{
      id: Date.now(),
      text: newMessage.trim(),
      sender: userName,
      color: userColor,
      timestamp: new Date().toISOString()
    }]);
    
    addChange(ydoc, `${userName} sent a message`);
    setNewMessage('');
  };

  const currentUser = localStorage.getItem("collabUserName") || "Anonymous";

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between bg-indigo-600 p-4 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h2 className="text-xl font-semibold text-white">Group Chat</h2>
        </div>
        <div className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">
          {messages.length} {messages.length === 1 ? 'message' : 'messages'}
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-gray-500">No messages yet</p>
            <p className="text-gray-400 text-sm mt-1">Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === currentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs md:max-w-md rounded-xl p-3 border transition-all duration-200 ${
                  msg.sender === currentUser
                    ? 'bg-indigo-100 border-indigo-200'
                    : 'bg-white border-gray-200'
                }`}
              >
                {/* Sender Header */}
                <div className="flex items-center mb-1 space-x-2">
                  {msg.sender !== currentUser && (
                    <div
                      className="h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ backgroundColor: msg.color }}
                    >
                      {msg.sender.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span
                    className={`text-xs font-semibold ${
                      msg.sender === currentUser ? 'text-indigo-700' : 'text-gray-700'
                    }`}
                  >
                    {msg.sender}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Message Text */}
                <div className="text-sm text-gray-700">
                  {msg.text}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-3">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
