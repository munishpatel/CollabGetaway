import React, { useEffect, useState } from 'react';
import { useYjs } from '../context/YjsContext';
import { addChange } from '../utils/changeFeedUtils';
import { ThumbsUp, ThumbsDown, Plus, User } from 'react-feather';

export default function ExperienceVoting() {
  const { ydoc } = useYjs();
  const [experiences, setExperiences] = useState([]);
  const [newExperience, setNewExperience] = useState('');

  useEffect(() => {
    if (!ydoc) return;

    const yexperiences = ydoc.getArray('experiences');
    const updateExperiences = () => {
      setExperiences(yexperiences.toArray());
    };

    yexperiences.observe(updateExperiences);
    updateExperiences();

    return () => {
      yexperiences.unobserve(updateExperiences);
    };
  }, [ydoc]);

  const addExperience = () => {
    if (!newExperience.trim() || !ydoc) return;
    
    const yexperiences = ydoc.getArray('experiences');
    yexperiences.push([{
      id: Date.now(),
      text: newExperience.trim(),
      votes: 0,
      voters: [],
      addedBy: localStorage.getItem("collabUserName") || "Anonymous"
    }]);
    
    addChange(ydoc, `${localStorage.getItem("collabUserName")} suggested: ${newExperience.trim()}`);
    setNewExperience('');
  };

  const voteExperience = (id, increment) => {
    if (!ydoc) return;
    
    const yexperiences = ydoc.getArray('experiences');
    const index = yexperiences.toArray().findIndex(exp => exp.id === id);
    if (index === -1) return;
    
    const userName = localStorage.getItem("collabUserName") || "Anonymous";
    const experience = yexperiences.get(index);
    
    if (experience.voters.includes(userName)) return;
    
    yexperiences.delete(index, 1);
    yexperiences.insert(index, [{
      ...experience,
      votes: experience.votes + increment,
      voters: [...experience.voters, userName]
    }]);
    
    addChange(ydoc, `${userName} ${increment > 0 ? 'upvoted' : 'downvoted'} "${experience.text}"`);
  };

  return (
    <>
      {/* Header */}
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Experience Voting
          </h2>
          <div className="text-sm text-gray-500">
            {experiences.length} {experiences.length === 1 ? 'suggestion' : 'suggestions'}
          </div>
        </div>

        {/* Add Experience */}
        <div className="mb-6 flex rounded-lg overflow-hidden shadow-sm">
          <input
            type="text"
            value={newExperience}
            onChange={(e) => setNewExperience(e.target.value)}
            placeholder="Suggest an experience (e.g., 'Sunset cruise')"
            className="flex-1 border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && addExperience()}
          />
          <button
            onClick={addExperience}
            disabled={!newExperience.trim()}
            className="bg-emerald-600 text-white px-4 hover:bg-emerald-700 transition-colors duration-200 disabled:opacity-50 disabled:bg-emerald-600 flex items-center"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
        
        {/* Experiences List */}
        <div className="space-y-3">
          {experiences.length === 0 ? (
            <div className="text-center py-6 bg-gray-50 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-500">No experiences yet</p>
              <p className="text-gray-400 text-sm">Add your first suggestion above</p>
            </div>
          ) : (
            experiences.sort((a, b) => b.votes - a.votes).map(exp => (
              <div 
                key={exp.id} 
                className={`border rounded-lg p-4 transition-all duration-200 ${exp.votes > 0 ? 'border-emerald-100 bg-emerald-50' : exp.votes < 0 ? 'border-rose-100 bg-rose-50' : 'border-gray-100 bg-white'}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{exp.text}</p>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <User className="h-4 w-4 mr-1" />
                      <span>{exp.addedBy}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center ml-4">
                    <div className={`px-3 py-1 rounded-full ${exp.votes > 0 ? 'bg-emerald-100 text-emerald-800' : exp.votes < 0 ? 'bg-rose-100 text-rose-800' : 'bg-gray-100 text-gray-800'}`}>
                      <span className="font-semibold">{exp.votes}</span>
                    </div>
                    <div className="flex space-x-1 mt-2">
                      <button
                        onClick={() => voteExperience(exp.id, 1)}
                        disabled={exp.voters.includes(localStorage.getItem("collabUserName") || false)}
                        className={`p-2 rounded-lg ${exp.voters.includes(localStorage.getItem("collabUserName") || false) 
                          ? 'bg-emerald-100 text-emerald-400' 
                          : 'bg-white text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 border border-gray-200'}`}
                      >
                        <ThumbsUp className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => voteExperience(exp.id, -1)}
                        disabled={exp.voters.includes(localStorage.getItem("collabUserName") || false)}
                        className={`p-2 rounded-lg ${exp.voters.includes(localStorage.getItem("collabUserName") || false) 
                          ? 'bg-rose-100 text-rose-400' 
                          : 'bg-white text-gray-500 hover:bg-rose-50 hover:text-rose-600 border border-gray-200'}`}
                      >
                        <ThumbsDown className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Voters list */}
                {exp.voters.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-gray-100">
                    <div className="flex flex-wrap gap-1">
                      {exp.voters.map((voter, index) => (
                        <span 
                          key={index} 
                          className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                        >
                          {voter}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}