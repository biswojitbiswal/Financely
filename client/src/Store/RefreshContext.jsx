import React, { createContext, useContext, useState } from 'react';

// Create a Context for `refresh` state
const RefreshContext = createContext();

export const useRefresh = () => useContext(RefreshContext);

export const RefreshProvider = ({ children }) => {
  const [refresh, setRefresh] = useState(false);

  const toggleRefresh = () => setRefresh((prev) => !prev);

  return (
    <RefreshContext.Provider value={{ refresh, toggleRefresh }}>
      {children}
    </RefreshContext.Provider>
  );
};
