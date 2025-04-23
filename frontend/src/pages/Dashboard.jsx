import React from 'react';
import { useYjs } from '../context/YjsContext';
import ChangeFeedPanel from '../components/ChangeFeed';
import Chat from '../components/Chat';
import ExperienceVoting from '../components/ExperienceVoting';
import InteractiveMap from '../components/InteractiveMap';
import ItineraryBuilder from '../components/ItineraryBuilder';
import UserList from '../components/UserList';

export default function Dashboard() {
  const { users } = useYjs();
  const [showChangeFeed, setShowChangeFeed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">CollabGetaway</h1>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowChangeFeed(!showChangeFeed)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              {showChangeFeed ? 'Hide Changes' : 'Show Changes'}
            </button>
            <UserList users={users} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white shadow rounded-lg p-4">
            <InteractiveMap />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white shadow rounded-lg p-4">
              <ExperienceVoting />
            </div>
            <div className="bg-white shadow rounded-lg p-4">
              <ItineraryBuilder />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-4 h-96">
            <Chat />
          </div>
        </div>

        {/* Change Feed Panel */}
        {showChangeFeed && (
          <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg z-50 overflow-y-auto">
            <ChangeFeedPanel onClose={() => setShowChangeFeed(false)} />
          </div>
        )}
      </main>
    </div>
  );
}