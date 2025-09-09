/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

import React, { createContext, useContext, useState } from "react";

const TradeDraftContext = createContext(null);

export const TradeDraftProvider = ({ children }) => {
  const [draft, setDraft] = useState(null);

  return (
    <TradeDraftContext.Provider value={{ draft, setDraft }}>
      {children}
    </TradeDraftContext.Provider>
  );
};

export const useTradeDraft = () => useContext(TradeDraftContext);
