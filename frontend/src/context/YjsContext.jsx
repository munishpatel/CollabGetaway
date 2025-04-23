import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

const YjsContext = createContext();

export const YjsProvider = ({ children, roomName, userName }) => {
  const [ydoc, setYdoc] = useState(null);
  const [provider, setProvider] = useState(null);
  const [awareness, setAwareness] = useState(null);
  const [users, setUsers] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  useEffect(() => {
    try {
      const doc = new Y.Doc();
      
      // Connect to your WebSocket server
      // Replace 'ws://localhost:1234' with your actual WebSocket server URL
      const wsProvider = new WebsocketProvider(
        'ws://localhost:1234', 
        roomName,
        doc,
        { 
          password: 'collab-getaway-room-password',
          connect: true
        }
      );

      // Handle connection status changes
      wsProvider.on('status', ({ status }) => {
        setConnectionStatus(status);
        if (status === 'connected') {
          setIsReady(true);
        }
      });

      const awareness = wsProvider.awareness;
      awareness.setLocalStateField('user', {
        name: userName,
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
      });

      awareness.on('change', () => {
        const states = Array.from(awareness.getStates().values());
        setUsers(states.map(state => state.user).filter(Boolean));
      });

      setYdoc(doc);
      setProvider(wsProvider);
      setAwareness(awareness);

      return () => {
        wsProvider.destroy();
        doc.destroy();
      };
    } catch (error) {
      console.error('Yjs initialization error:', error);
      setConnectionStatus('disconnected');
      setIsReady(true); // Still render children even if Yjs fails
    }
  }, [roomName, userName]);

  if (!isReady) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
        <p>Connecting to collaboration server...</p>
        <p className="text-sm text-gray-500 mt-2">Status: {connectionStatus}</p>
      </div>
    );
  }

  return (
    <YjsContext.Provider value={{ 
      ydoc, 
      provider, 
      awareness, 
      users,
      connectionStatus 
    }}>
      {children}
    </YjsContext.Provider>
  );
};

export const useYjs = () => useContext(YjsContext);