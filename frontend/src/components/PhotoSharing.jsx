import React, { useState, useEffect } from 'react';
import { useYjs } from '../context/YjsContext';
import { addChange } from '../utils/changeFeedUtils';
import { MdCameraAlt, MdAttachFile, MdClose } from 'react-icons/md'; // Material Design Icons

export default function PhotoSharing() {
  const { ydoc } = useYjs();
  const [photos, setPhotos] = useState([]);
  const [newPhoto, setNewPhoto] = useState(null);
  const [caption, setCaption] = useState('');
  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (!ydoc) return;

    const yphotos = ydoc.getArray('photos');
    const updatePhotos = () => {
      setPhotos(yphotos.toArray());
    };

    yphotos.observe(updatePhotos);
    updatePhotos();

    return () => {
      yphotos.unobserve(updatePhotos);
    };
  }, [ydoc]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setNewPhoto(file);
    };
    reader.readAsDataURL(file);
  };

  const uploadPhoto = () => {
    if (!newPhoto || !ydoc) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const yphotos = ydoc.getArray('photos');
      const userName = localStorage.getItem("collabUserName") || "Anonymous";
      
      yphotos.push([{
        id: Date.now(),
        image: reader.result,
        caption: caption.trim() || 'Untitled photo',
        addedBy: userName,
        timestamp: new Date().toISOString()
      }]);

      addChange(ydoc, `${userName} shared a photo: ${caption.trim() || 'Untitled photo'}`);
      setNewPhoto(null);
      setCaption('');
      setPreview('');
    };
    reader.readAsDataURL(newPhoto);
  };

  const removePhoto = (id) => {
    if (!ydoc) return;
    const yphotos = ydoc.getArray('photos');
    const index = yphotos.toArray().findIndex(p => p.id === id);
    if (index === -1) return;

    const photo = yphotos.get(index);
    yphotos.delete(index, 1);
    addChange(ydoc, `${localStorage.getItem("collabUserName")} removed a photo: ${photo.caption}`);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <MdCameraAlt className="h-5 w-5 mr-2" />
        Photo Sharing
      </h2>

      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <h3 className="font-medium mb-3">Share a Photo</h3>
        {!preview ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <label className="cursor-pointer flex flex-col items-center">
              <MdAttachFile className="h-10 w-10 text-gray-400 mb-2" />
              <span className="text-gray-600">Click to select a photo</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </label>
          </div>
        ) : (
          <div className="relative">
            <img src={preview} alt="Preview" className="w-full h-64 object-cover rounded-lg" />
            <button
              onClick={() => {
                setPreview('');
                setNewPhoto(null);
              }}
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"
            >
              <MdClose className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        )}

        {preview && (
          <div className="mt-3">
            <input
              type="text"
              placeholder="Add a caption..."
              className="w-full border rounded-md px-3 py-2 mb-3"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
            <button
              onClick={uploadPhoto}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Share Photo
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-medium mb-3">Shared Photos</h3>
        {photos.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No photos shared yet</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="border rounded-md overflow-hidden">
                <div className="relative">
                  <img 
                    src={photo.image} 
                    alt={photo.caption} 
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => removePhoto(photo.id)}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"
                  >
                    <MdClose className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
                <div className="p-3">
                  <p className="font-medium">{photo.caption}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Shared by {photo.addedBy} • {new Date(photo.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}