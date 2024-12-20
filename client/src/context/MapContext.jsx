// src/context/MapContext.js
import React, { createContext, useContext, useState } from 'react';

const MapContext = createContext();

export const useMapContext = () => useContext(MapContext);

export const MapProvider = ({ children }) => {
  const [layers, setLayers] = useState([]); // Initialize as an array
  const [selectedLayerId, setSelectedLayerId] = useState(null);
  const [selectedFeatureId, setSelectedFeatureId] = useState(null);
  const [error, setError] = useState(null);

  const addLayer = (newLayer) => {
    setLayers((prevLayers) => [...prevLayers, newLayer]);
    setSelectedLayerId(newLayer.id); // Select the new layer by default
  };

  const deleteLayer = (layerId) => {
    setLayers((prevLayers) => {
      const updatedLayers = prevLayers.filter(layer => layer.id !== layerId);

      // Reset selections if no layers are left
      if (updatedLayers.length === 0) {
        setSelectedLayerId(null);
        setSelectedFeatureId(null);
      } else {
        // Set the next available layer as selected if the current layer is deleted
        if (selectedLayerId === layerId) {
          setSelectedLayerId(updatedLayers[0].id);
        }
      }

      return updatedLayers;
    });
  };

  return (
    <MapContext.Provider
      value={{
        layers,
        setLayers,
        selectedLayerId,
        setSelectedLayerId,
        selectedFeatureId,
        setSelectedFeatureId,
        addLayer,
        deleteLayer,
        error,
        setError,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

