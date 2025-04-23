import React, { useEffect, useState } from 'react';
import { useYjs } from '../context/YjsContext';
import { addChange } from '../utils/changeFeedUtils';
import { Trash2, Edit, Check, X } from 'react-feather';

export default function ItineraryBuilder() {
  const { ydoc } = useYjs();
  const [days, setDays] = useState([]);
  const [newDay, setNewDay] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    if (!ydoc) return;

    const yitinerary = ydoc.getArray('itinerary');
    const updateItinerary = () => {
      setDays(yitinerary.toArray());
    };

    yitinerary.observe(updateItinerary);
    updateItinerary();

    return () => {
      yitinerary.unobserve(updateItinerary);
    };
  }, [ydoc]);

  const addDay = () => {
    if (!newDay.trim() || !ydoc) return;
    
    const yitinerary = ydoc.getArray('itinerary');
    yitinerary.push([{
      id: Date.now(),
      title: newDay.trim(),
      activities: [],
      addedBy: localStorage.getItem("collabUserName") || "Anonymous"
    }]);
    
    addChange(ydoc, `${localStorage.getItem("collabUserName")} added day: ${newDay.trim()}`);
    setNewDay('');
  };

  const deleteDay = (id) => {
    if (!ydoc) return;
    
    const yitinerary = ydoc.getArray('itinerary');
    const index = yitinerary.toArray().findIndex(day => day.id === id);
    if (index === -1) return;
    
    const day = yitinerary.get(index);
    addChange(ydoc, `${localStorage.getItem("collabUserName")} deleted day: ${day.title}`);
    yitinerary.delete(index, 1);
  };

  const startEditing = (id, title) => {
    setEditingId(id);
    setEditText(title);
  };

  const saveEdit = (id) => {
    if (!editText.trim() || !ydoc) return;
    
    const yitinerary = ydoc.getArray('itinerary');
    const index = yitinerary.toArray().findIndex(day => day.id === id);
    if (index === -1) return;
    
    const day = yitinerary.get(index);
    yitinerary.delete(index, 1);
    yitinerary.insert(index, [{
      ...day,
      title: editText.trim()
    }]);
    
    addChange(ydoc, `${localStorage.getItem("collabUserName")} updated day to: ${editText.trim()}`);
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Itinerary Builder</h2>
      
      <div className="mb-4 flex">
        <input
          type="text"
          value={newDay}
          onChange={(e) => setNewDay(e.target.value)}
          placeholder="Add a new day (e.g., 'Day 1: Arrival')"
          className="flex-1 border rounded-l-md px-3 py-2"
          onKeyPress={(e) => e.key === 'Enter' && addDay()}
        />
        <button
          onClick={addDay}
          className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700"
        >
          Add
        </button>
      </div>
      
      <div className="space-y-3">
        {days.map(day => (
          <div key={day.id} className="border rounded-md p-3">
            <div className="flex justify-between items-center mb-2">
              {editingId === day.id ? (
                <div className="flex-1 flex">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1 border rounded-md px-2 py-1 mr-2"
                  />
                  <button
                    onClick={() => saveEdit(day.id)}
                    className="text-green-600 hover:text-green-800 p-1"
                  >
                    <Check className="h-5 w-5" />
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="font-medium">{day.title}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEditing(day.id, day.title)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteDay(day.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
            {/* Activities for this day would go here */}
          </div>
        ))}
      </div>
    </div>
  );
}