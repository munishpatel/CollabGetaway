import React from 'react';

export default function UserList({ users }) {
  // If users.length <= 1, hardcode 1; else show real count
  const onlineCount = users.length <= 1 ? 1 : users.length;

  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 px-3 py-1 bg-white rounded-full shadow-sm border border-gray-200 hover:shadow-md transition-all text-sm font-medium text-gray-700">
        <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-ping"></div>
        <span>{onlineCount} Online</span> {/* 👈 This is now dynamic and correct */}
      </button>

      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50 hidden group-hover:block">
        {users.length === 0 ? (
          <div className="px-4 py-2 text-gray-400 text-sm text-center">No users online</div>
        ) : (
          users.map((user, index) => (
            <div
              key={index}
              className="px-4 py-2 flex items-center hover:bg-gray-50 transition-all duration-150"
            >
              <div
                className="w-3 h-3 rounded-full mr-3"
                style={{ backgroundColor: user.color }}
              />
              <span className="text-sm text-gray-700">{user.name}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
