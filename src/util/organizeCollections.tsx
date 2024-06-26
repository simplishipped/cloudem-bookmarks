import { Collection } from "../types/types";

function organizeCollectionsWithSubs(folders: Collection[]) {
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

export default organizeCollectionsWithSubs