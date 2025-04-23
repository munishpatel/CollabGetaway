import React, { useEffect, useState } from 'react';
import { useYjs } from '../context/YjsContext';
import { addChange } from '../utils/changeFeedUtils';
import { ThumbsUp, ThumbsDown } from 'react-feather';

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
    <div>
      <h2 className="text-xl font-semibold mb-4">Vote on Experiences</h2>
      
      <div className="mb-4 flex">
        <input
          type="text"
          value={newExperience}
          onChange={(e) => setNewExperience(e.target.value)}
          placeholder="Suggest an experience (e.g., 'Sunset cruise')"
          className="flex-1 border rounded-l-md px-3 py-2"
          onKeyPress={(e) => e.key === 'Enter' && addExperience()}
        />
        <button
          onClick={addExperience}
          className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700"
        >
          Add
        </button>
      </div>
      
      <div className="space-y-3">
        {experiences.sort((a, b) => b.votes - a.votes).map(exp => (
          <div key={exp.id} className="border rounded-md p-3 flex justify-between items-center">
            <span>{exp.text}</span>
            <div className="flex items-center space-x-2">
              <span className="font-medium">{exp.votes}</span>
              <button
                onClick={() => voteExperience(exp.id, 1)}
                disabled={exp.voters.includes(localStorage.getItem("collabUserName") || false)}
                className="text-green-600 hover:text-green-800 disabled:opacity-50"
              >
                <ThumbsUp className="h-5 w-5" />
              </button>
              <button
                onClick={() => voteExperience(exp.id, -1)}
                disabled={exp.voters.includes(localStorage.getItem("collabUserName") || false)}
                className="text-red-600 hover:text-red-800 disabled:opacity-50"
              >
                <ThumbsDown className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}