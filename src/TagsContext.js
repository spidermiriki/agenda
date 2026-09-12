import { createContext, useContext, useEffect, useState } from 'react';
import { subscribeToTags } from './storage';

const TagsContext = createContext([]);

export function TagsProvider({ children }) {
  const [tags, setTags] = useState([]);
  useEffect(() => subscribeToTags(setTags), []);
  return <TagsContext.Provider value={tags}>{children}</TagsContext.Provider>;
}

export function useTags() {
  return useContext(TagsContext);
}
