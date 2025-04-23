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
    const userColor = users.find(u => u.name === userName)?.color || '#3b82f6';
    
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

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Group Chat</h2>
      
      <div className="flex-1 overflow-y-auto mb-4 space-y-3">
        {messages.map(msg => (
          <div key={msg.id} className="flex">
            <div className="flex-1">
              <div className="flex items-baseline">
                <span 
                  className="font-medium mr-2"
                  style={{ color: msg.color }}
                >
                  {msg.sender}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="mt-1 text-gray-800">{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded-l-md px-3 py-2"
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}