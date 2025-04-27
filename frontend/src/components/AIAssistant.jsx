import React, { useState, useEffect, useRef } from 'react';
import { useYjs } from '../context/YjsContext';
import { addChange } from '../utils/changeFeedUtils';
import { FiSend, FiX, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { RiRobot2Line } from 'react-icons/ri';
import { BsLightningCharge } from 'react-icons/bs';

const isProduction = import.meta.env.MODE === 'production';

const apiBaseURL = isProduction
  ? 'https://collabgetaway.onrender.com'
  : 'http://localhost:1234';

export default function AIAssistant() {
  const { ydoc } = useYjs();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [itinerary, setItinerary] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!ydoc) return;

    const yitinerary = ydoc.getArray('itinerary');
    const ymarkers = ydoc.getArray('markers');

    const updateItinerary = () => setItinerary(yitinerary.toArray());
    const updateMarkers = () => setMarkers(ymarkers.toArray());

    yitinerary.observe(updateItinerary);
    ymarkers.observe(updateMarkers);
    updateItinerary();
    updateMarkers();

    return () => {
      yitinerary.unobserve(updateItinerary);
      ymarkers.unobserve(updateMarkers);
    };
  }, [ydoc]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${apiBaseURL}/api/ai-assistant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
          itinerary,
          markers
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to get AI response');

      const aiMessage = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
      addChange(ydoc, `AI Assistant responded to: "${input}"`);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, I encountered an error. Please try again later.",
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question) => {
    setInput(question);
    setTimeout(() => handleSendMessage(), 100);
  };

  const quickQuestions = [
    "Suggest 3 must-visit locations",
    "Plan a 3-day itinerary",
    "Budget-friendly activities",
    "Best local restaurants",
    "Weather-appropriate packing list"
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-all flex items-center space-x-2 z-50"
      >
        <RiRobot2Line className="h-6 w-6" />
        <span className="hidden sm:inline">Travel Assistant</span>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-8 right-8 w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col z-50 transition-all duration-300 ${isMinimized ? 'h-16' : 'h-[70vh]'}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center text-white">
        <div className="flex items-center space-x-2">
          <RiRobot2Line className="h-6 w-6" />
          <h2 className="text-lg font-semibold">Travel Assistant</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={() => setIsMinimized(!isMinimized)} aria-label="Minimize">
            {isMinimized ? <FiChevronUp className="h-5 w-5" /> : <FiChevronDown className="h-5 w-5" />}
          </button>
          <button onClick={() => setIsOpen(false)} aria-label="Close">
            <FiX className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Messages + Input */}
      {!isMinimized && (
        <>
          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <BsLightningCharge className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Hi! I'm your Travel Assistant</h3>
                <p className="text-gray-500">How can I help you plan today?</p>
                <div className="grid grid-cols-1 gap-2 w-full">
                  {quickQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleQuickQuestion(q)}
                      className="text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] p-3 rounded-lg ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-700'}`}>
                      {msg.role === 'assistant' && (
                        <div className="flex items-center mb-1 space-x-1">
                          <RiRobot2Line className="h-4 w-4 text-indigo-500" />
                          <span className="text-xs font-semibold text-indigo-600">Assistant</span>
                        </div>
                      )}
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      <div className="text-xs mt-1 text-gray-400 text-right">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[75%] bg-white border border-gray-200 rounded-lg p-3 flex items-center space-x-2">
                      <div className="flex space-x-1 animate-pulse">
                        <div className="h-2 w-2 bg-gray-300 rounded-full"></div>
                        <div className="h-2 w-2 bg-gray-300 rounded-full"></div>
                        <div className="h-2 w-2 bg-gray-300 rounded-full"></div>
                      </div>
                      <span className="text-xs text-gray-500">Thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Box */}
          <div className="border-t bg-white p-3">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-indigo-600 p-2 rounded-full text-white hover:bg-indigo-700 disabled:opacity-50 transition"
              >
                <FiSend className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">Powered by AI • Suggestions may vary</p>
          </div>
        </>
      )}
    </div>
  );
}
