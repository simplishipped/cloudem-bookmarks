function organizeCollectionsWithSubs(folders) {
  // Create a map to store folders by their ids
  const folderMap = new Map();
  
  // Create a map for parent-child relationships
  const parentMap = new Map();
  
  // Initialize maps
  folders.forEach(folder => {
      folderMap.set(folder.id, {...folder, children: []});
      parentMap.set(folder.id, folder.parentId);
  });
  
  // Create the hierarchy
  const hierarchy = [];
  folders.forEach(folder => {
      if (!folder.parentId) {
          // If no parent, it is a root folder
          hierarchy.push(folderMap.get(folder.id));
      } else {
          // Add to parent's children
          const parent = folderMap.get(folder.parentId);
          if (parent) {
              parent.children.push(folderMap.get(folder.id));
          }
      }
  });
  
  return hierarchy;
}

function syncBookmarks() {
  return new Promise((resolve, reject) => {
    chrome.bookmarks.getTree((bookmarkTreeNodes) => {
      console.log(bookmarkTreeNodes)
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        console.log(bookmarkTreeNodes)
        const bookmarks = flattenBookmarks(bookmarkTreeNodes);
        const organizedBookmarks = organizeCollectionsWithSubs(bookmarks);
        resolve(organizedBookmarks);
      }
    });
  });
}

function flattenBookmarks(bookmarkTreeNodes, parentId = null) {
  let bookmarks = [];
  bookmarkTreeNodes.forEach(node => {
    if (node.children) {
      // It's a folder
      bookmarks.push({
        id: node.id,
        title: node.title,
        parentId: parentId,
        children: []  // Initialize with empty children, will be populated later
      });
      // Recursively process children
      bookmarks = bookmarks.concat(flattenBookmarks(node.children, node.id));
    } else {
      // It's a bookmark item
      bookmarks.push({
        id: node.id,
        title: node.title,
        parentId: parentId,
        url: node.url
      });
    }
  });
  return bookmarks;
}

// Usage



export default syncBookmarks;