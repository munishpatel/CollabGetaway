import React, { useEffect, useRef, useState } from 'react';
import { useYjs } from '../context/YjsContext';
import { addChange } from '../utils/changeFeedUtils';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const UserMarker = ({ user }) => {
  const icon = L.divIcon({
    className: 'user-marker',
    html: `<div style="background-color: ${user.color}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white;"></div>`,
    iconSize: [20, 20],
  });

  return (
    <Marker position={[user.position?.lat || 0, user.position?.lng || 0]} icon={icon}>
      <Popup>{user.name}'s location</Popup>
    </Marker>
  );
};

const LocationMarkers = ({ markers, onAddMarker }) => {
  const map = useMapEvents({
    click(e) {
      onAddMarker(e.latlng);
    },
  });

  return (
    <>
      {markers.map((marker, idx) => (
        <Marker key={idx} position={[marker.lat, marker.lng]}>
          <Popup>
            <div>
              <strong>{marker.title || 'Location'}</strong>
              <p>Added by: {marker.addedBy}</p>
              {marker.notes && <p>Notes: {marker.notes}</p>}
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default function InteractiveMap() {
  const { ydoc, users, awareness } = useYjs();
  const [markers, setMarkers] = useState([]);
  const [userPositions, setUserPositions] = useState([]);
  const [newMarkerTitle, setNewMarkerTitle] = useState('');
  const [newMarkerNotes, setNewMarkerNotes] = useState('');
  const [selectedPosition, setSelectedPosition] = useState(null);

  useEffect(() => {
    if (!ydoc) return;

    // Initialize shared markers
    const ymarkers = ydoc.getArray('markers');
    const updateMarkers = () => {
      setMarkers(ymarkers.toArray());
    };

    ymarkers.observe(updateMarkers);
    updateMarkers();

    // Track user positions
    const updateUserPositions = () => {
      const states = Array.from(awareness.getStates().values());
      setUserPositions(states.map(state => ({
        ...state.user,
        position: state.user?.position || null
      })).filter(user => user.position));
    };

    awareness.on('change', updateUserPositions);
    updateUserPositions();

    return () => {
      ymarkers.unobserve(updateMarkers);
      awareness.off('change', updateUserPositions);
    };
  }, [ydoc, awareness]);

  const handleAddMarker = (latlng) => {
    setSelectedPosition(latlng);
  };

  const confirmAddMarker = () => {
    if (!selectedPosition || !ydoc) return;
    
    const ymarkers = ydoc.getArray('markers');
    ymarkers.push([{
      id: Date.now(),
      lat: selectedPosition.lat,
      lng: selectedPosition.lng,
      title: newMarkerTitle.trim() || 'Untitled Location',
      notes: newMarkerNotes.trim(),
      addedBy: localStorage.getItem("collabUserName") || "Anonymous",
      timestamp: new Date().toISOString()
    }]);
    
    addChange(ydoc, `${localStorage.getItem("collabUserName")} added a location: ${newMarkerTitle.trim() || 'Untitled Location'}`);
    setSelectedPosition(null);
    setNewMarkerTitle('');
    setNewMarkerNotes('');
  };

  const updateUserPosition = (latlng) => {
    if (!awareness) return;
    
    const currentState = awareness.getLocalState();
    awareness.setLocalStateField('user', {
      ...currentState?.user,
      position: {
        lat: latlng.lat,
        lng: latlng.lng
      }
    });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Interactive Map</h2>
      
      <div className="relative">
        <MapContainer
          center={[51.505, -0.09]}
          zoom={13}
          style={{ height: '500px', width: '100%', borderRadius: '0.5rem' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <LocationMarkers 
            markers={markers} 
            onAddMarker={(latlng) => {
              handleAddMarker(latlng);
              updateUserPosition(latlng);
            }} 
          />
          
          {userPositions.map((user, idx) => (
            <UserMarker key={idx} user={user} />
          ))}
        </MapContainer>

        {selectedPosition && (
          <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg z-[1000] w-80">
            <h3 className="font-medium mb-2">Add New Location</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={newMarkerTitle}
                  onChange={(e) => setNewMarkerTitle(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Location name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  value={newMarkerNotes}
                  onChange={(e) => setNewMarkerNotes(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Additional details"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setSelectedPosition(null)}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAddMarker}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add Location
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4">
        <h3 className="font-medium mb-2">Saved Locations</h3>
        <div className="space-y-2">
          {markers.length === 0 ? (
            <p className="text-gray-500">No locations added yet. Click on the map to add one.</p>
          ) : (
            markers.map((marker, idx) => (
              <div key={idx} className="border rounded p-3">
                <div className="flex justify-between">
                  <h4 className="font-medium">{marker.title}</h4>
                  <span className="text-sm text-gray-500">Added by {marker.addedBy}</span>
                </div>
                {marker.notes && <p className="text-sm text-gray-600 mt-1">{marker.notes}</p>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}