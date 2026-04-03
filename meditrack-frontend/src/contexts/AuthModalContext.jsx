import React, { createContext, useContext, useState } from 'react';

const AuthModalContext = createContext();

export const AuthModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [featureName, setFeatureName] = useState(null);

  const openAuthModal = (feature) => {
    setFeatureName(feature || null);
    setIsOpen(true);
  };

  const closeAuthModal = () => {
    setIsOpen(false);
    setFeatureName(null);
  };

  return (
    <AuthModalContext.Provider value={{ isOpen, featureName, openAuthModal, closeAuthModal }}>
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => useContext(AuthModalContext);
