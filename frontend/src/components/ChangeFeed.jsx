import React, { useEffect, useState } from 'react';
import { useYjs } from '../context/YjsContext';

export default function ChangeFeedPanel({ onClose }) {
  // Temporary replacement
  const XMarkIcon = () => <span>×</span>;
  const ArrowPathIcon = () => <span>↻</span>;
  // etc... 
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
    <div className="h-full flex flex-col">
      <div className="border-b p-4 flex justify-between items-center">
        <h2 className="text-lg font-medium">Activity Feed</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {changes.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No activity yet</p>
        ) : (
          changes.map((change, index) => (
            <div key={index} className="border-b pb-3 last:border-0">
              <div className="flex justify-between text-sm text-gray-500">
                <span className="font-medium">{change.user}</span>
                <span>{new Date(change.timestamp).toLocaleTimeString()}</span>
              </div>
              <p className="mt-1">{change.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}