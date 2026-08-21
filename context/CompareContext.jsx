'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CompareContext = createContext();

export function CompareProvider({ children }) {
  const [compareList, setCompareList] = useState([]);
  const MAX_COMPARE = 4;

  // LocalStorage'dan yükle
  useEffect(() => {
    const saved = localStorage.getItem('compareList');
    if (saved) {
      try {
        setCompareList(JSON.parse(saved));
      } catch (e) {
        console.error('Kayıtlı karşılaştırma listesi okunamadı', e);
      }
    }
  }, []);

  // LocalStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('compareList', JSON.stringify(compareList));
  }, [compareList]);

  const addToCompare = (uni) => {
    if (compareList.length >= MAX_COMPARE) {
      alert(`En fazla ${MAX_COMPARE} bölüm karşılaştırabilirsiniz.`);
      return;
    }
    if (compareList.some(item => item.id === uni.id)) {
      return; // Zaten ekli
    }
    setCompareList([...compareList, uni]);
  };

  const removeFromCompare = (id) => {
    setCompareList(compareList.filter(item => item.id !== id));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const isInCompare = (id) => {
    return compareList.some(item => item.id === id);
  };

  return (
    <CompareContext.Provider value={{
      compareList,
      addToCompare,
      removeFromCompare,
      clearCompare,
      isInCompare,
      MAX_COMPARE
    }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  return useContext(CompareContext);
}
