import React, { useState } from 'react';
import { useYjs } from '../context/YjsContext';
import ChangeFeedPanel from '../components/ChangeFeed';
import Chat from '../components/Chat';
import ExperienceVoting from '../components/ExperienceVoting';
import InteractiveMap from '../components/InteractiveMap';
import ItineraryBuilder from '../components/ItineraryBuilder';
import UserList from '../components/UserList';
import AIAssistant from '../components/AIAssistant';
import PhotoSharing from '../components/PhotoSharing';

export default function Dashboard() {
  const { users } = useYjs();
  const [showChangeFeed, setShowChangeFeed] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg className="w-8 h-8 text-indigo-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
            </svg>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              CollabGetaway
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowChangeFeed(!showChangeFeed)}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>{showChangeFeed ? 'Hide Activity' : 'Show Activity'}</span>
            </button>
            <UserList users={users} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md">
            <div className="p-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
            <div className="p-4">
              <InteractiveMap />
            </div>
          </div>
          
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md">
              <div className="p-1 bg-gradient-to-r from-blue-500 to-cyan-600"></div>
              <div className="p-4">
                <PhotoSharing />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md">
              <div className="p-1 bg-gradient-to-r from-green-500 to-emerald-600"></div>
              <div className="p-4">
                <ExperienceVoting />
              </div>
            </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md">
            <div className="p-1 bg-gradient-to-r from-amber-500 to-orange-600"></div>
            <div className="p-4">
              <ItineraryBuilder />
            </div>
          </div>
        </div>
      </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md">
            <div className="p-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
            <div className="p-4">
              <Chat />
            </div>
          </div>
          <div className="p-4">
              <AIAssistant />
          </div>
        </div>

        {/* Change Feed Panel */}
        {showChangeFeed && (
          <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl z-50 overflow-y-auto border-l border-gray-200 transform transition-transform duration-300 ease-in-out">
            <ChangeFeedPanel onClose={() => setShowChangeFeed(false)} />
          </div>
        )}
      </main>
    </div>
  );
}