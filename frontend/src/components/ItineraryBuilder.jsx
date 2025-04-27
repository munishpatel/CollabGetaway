import React, { useEffect, useState } from 'react';
import { useYjs } from '../context/YjsContext';
import { addChange } from '../utils/changeFeedUtils';
import { Trash2, Edit, Check, X, Plus } from 'react-feather';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

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
    <>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6h13v6m-2 4H4a2 2 0 01-2-2V7a2 2 0 012-2h16a2 2 0 012 2v12a2 2 0 01-2 2z" />
            </svg>
            Itinerary Builder
          </h2>
          <div className="text-sm text-gray-500">
            {days.length} {days.length === 1 ? 'day' : 'days'}
          </div>
        </div>

        {/* Add Day */}
        <div className="mb-6 flex rounded-lg overflow-hidden shadow-sm">
          <input
            type="text"
            value={newDay}
            onChange={(e) => setNewDay(e.target.value)}
            placeholder="Add a new day (e.g., 'Day 1: Arrival')"
            className="flex-1 border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && addDay()}
          />
          <button
            onClick={addDay}
            disabled={!newDay.trim()}
            className="bg-orange-600 text-white px-4 hover:bg-orange-700 transition-colors duration-200 disabled:opacity-50 disabled:bg-orange-600 flex items-center"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        {/* Days List */}
        <DragDropContext
          onDragEnd={(result) => {
            const { destination, source } = result;
            if (!destination || !ydoc) return;

            if (destination.index === source.index) return;

            const yitinerary = ydoc.getArray('itinerary');
            const currentDays = yitinerary.toArray();
            
            const movedItem = currentDays[source.index];
            currentDays.splice(source.index, 1);
            currentDays.splice(destination.index, 0, movedItem);

            yitinerary.delete(0, yitinerary.length); // Clear array
            yitinerary.push(currentDays); // Push updated array

            addChange(ydoc, `${localStorage.getItem("collabUserName")} reordered the itinerary`);
          }}
        >
          <Droppable droppableId="itinerary">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3">
                {days.length === 0 ? (
                  <div className="text-center py-6 bg-gray-50 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-500">No days added yet</p>
                    <p className="text-gray-400 text-sm">Start by adding your first day above</p>
                  </div>
                ) : (
                  days.map((day, index) => (
                    <Draggable key={day.id} draggableId={day.id.toString()} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`border border-gray-100 bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 ${
                            snapshot.isDragging ? 'bg-indigo-50' : ''
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            {editingId === day.id ? (
                              <div className="flex-1 flex items-center space-x-2">
                                <input
                                  type="text"
                                  value={editText}
                                  onChange={(e) => setEditText(e.target.value)}
                                  className="flex-1 px-3 py-2 border rounded-md bg-gray-50 focus:outline-none"
                                />
                                <button
                                  onClick={() => saveEdit(day.id)}
                                  className="p-2 text-green-600 hover:text-green-800 transition"
                                >
                                  <Check className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className="p-2 text-red-500 hover:text-red-700 transition"
                                >
                                  <X className="h-5 w-5" />
                                </button>
                              </div>
                            ) : (
                              <>
                                <h3 className="text-lg font-medium text-gray-800">{day.title}</h3>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => startEditing(day.id, day.title)}
                                    className="p-2 text-gray-500 hover:text-gray-700 transition"
                                  >
                                    <Edit className="h-5 w-5" />
                                  </button>
                                  <button
                                    onClick={() => deleteDay(day.id)}
                                    className="p-2 text-red-500 hover:text-red-700 transition"
                                  >
                                    <Trash2 className="h-5 w-5" />
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

      </div>
    </>
  );
}
