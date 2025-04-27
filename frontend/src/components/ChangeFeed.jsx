import React, { useEffect, useState } from 'react';
import { useYjs } from '../context/YjsContext';

export default function ChangeFeedPanel({ onClose }) {
  const { ydoc } = useYjs();
  const [changes, setChanges] = useState([]);

  useEffect(() => {
    if (!ydoc) return;

    const changeFeed = ydoc.getArray('changeFeed');
    const updateChanges = () => {
      setChanges(changeFeed.toArray());
    };

    changeFeed.observe(updateChanges);
    updateChanges();

    return () => {
      changeFeed.unobserve(updateChanges);
    };
  }, [ydoc]);

  const addChange = (text) => {
    if (!ydoc) return;
    const changeFeed = ydoc.getArray('changeFeed');
    changeFeed.push([{
      text,
      timestamp: new Date().toISOString(),
      user: localStorage.getItem("collabUserName") || "Anonymous"
    }]);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <h2 className="text-lg font-semibold text-white">Activity Feed</h2>
        </div>
        <button 
          onClick={onClose} 
          className="p-1 rounded-full hover:bg-white/10 transition-colors duration-200"
          aria-label="Close panel"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Activity List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {changes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-500">No activity yet</p>
            <p className="text-gray-400 text-sm mt-1">Changes will appear here as they happen</p>
          </div>
        ) : (
          changes.slice().reverse().map((change, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow-xs p-4 border border-gray-100 hover:shadow-sm transition-shadow duration-200"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center">
                    <span className="text-indigo-600 font-medium">
                      {change.user.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {change.user}
                    </p>
                    <span className="text-xs text-gray-500">
                      {new Date(change.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    {change.text}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-3 bg-white">
        <div className="text-xs text-gray-500 text-center">
          Real-time updates • {changes.length} {changes.length === 1 ? 'activity' : 'activities'}
        </div>
      </div>
    </div>
  );
}