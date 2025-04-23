export const addChange = (ydoc, text) => {
    if (!ydoc) return;
    
    const changeFeed = ydoc.getArray('changeFeed');
    changeFeed.push([{
      text,
      timestamp: new Date().toISOString(),
      user: localStorage.getItem("collabUserName") || "Anonymous"
    }]);
  };