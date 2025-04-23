import React from 'react';

export default function UserList({ users }) {
  return (
    <div className="relative group">
      <button className="flex items-center space-x-1">
        <span className="text-sm font-medium">{users.length} Online</span>
      </button>
      
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
        {users.map((user, index) => (
          <div key={index} className="px-4 py-2 flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: user.color }}
            />
            <span className="text-sm">{user.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}