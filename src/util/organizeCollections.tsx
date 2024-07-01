import { Collection } from "../types/types";

export function organizeCollectionsWithSubs(folders: Collection[]) {
  // Create a map to store folders by their ids
  const folderMap = new Map();
  
  // Create a map for parent-child relationships
  const parentMap = new Map();
  
  // Initialize maps
  folders.forEach(folder => {
      folderMap.set(folder.id, {...folder, children: []});
      parentMap.set(folder.id, folder.parent_id);
  });
  
  // Create the hierarchy
  const hierarchy = [];
  folders.forEach(folder => {
      if (folder.parent_id === null) {
          // If no parent, it is a root folder
          hierarchy.push(folderMap.get(folder.id));
      } else {
          // Add to parent's children
          const parent = folderMap.get(folder.parent_id);
          if (parent) {
              parent.children.push(folderMap.get(folder.id));
          }
      }
  });
  
  return hierarchy;
}

export function flattenBookmarks(chromeBookmarks, parentId = null) {
    let bookmarks = [];
    chromeBookmarks.forEach(node => {
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