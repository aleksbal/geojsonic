// src/components/GeoJsonMap.jsx
import React, { useState } from 'react';
import { Container } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import QueryForm from './QueryForm';
import LayerTabs from './LayerTabs';
import MapDisplay from './MapDisplay';
import FeatureList from './FeatureList';
import Feature from './Feature';
import ErrorBoundary from './ErrorBoundary';
import Split from 'react-split';

const GeoJsonMap = () => {
    const [layers, setLayers] = useState([]);
    const [selectedLayerIndex, setSelectedLayerIndex] = useState(0);
    const [selectedFeatures, setSelectedFeatures] = useState({}); // Track selected feature per layer
    const [error, setError] = useState(null);

    // Function to set the selected feature for the current layer
    const setSelectedFeature = (feature) => {
        setSelectedFeatures((prevSelectedFeatures) => ({
            ...prevSelectedFeatures,
            [selectedLayerIndex]: feature,
        }));
    };

    const handleAddLayer = (newLayer) => {
        setLayers((prevLayers) => [...prevLayers, newLayer]);
        setSelectedLayerIndex(layers.length);
    };

    const handleDeleteLayer = (index) => {
        // Remove the layer from the list
        setLayers((prevLayers) => prevLayers.filter((_, i) => i !== index));

        // Remove the selected feature for the deleted layer
        setSelectedFeatures((prevSelectedFeatures) => {
            const updatedFeatures = { ...prevSelectedFeatures };
            delete updatedFeatures[index];
            return updatedFeatures;
        });

        // Adjust selectedLayerIndex
        setSelectedLayerIndex((prevIndex) => {
            const newIndex = Math.max(0, prevIndex > index ? prevIndex - 1 : prevIndex);
            if (index === prevIndex) {
                setSelectedFeatures((prev) => ({
                    ...prev,
                    [newIndex]: null,
                }));
            }
            return newIndex;
        });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <Header />
            <Container maxWidth="xl" style={{ marginTop: '20px', flexGrow: 1 }}>
                <QueryForm addLayer={handleAddLayer} setError={setError} />
                {error && <div>{error}</div>}
                <LayerTabs
                    layers={layers}
                    selectedLayerIndex={selectedLayerIndex}
                    setSelectedLayerIndex={setSelectedLayerIndex}
                    setLayers={setLayers}
                    onDeleteLayer={handleDeleteLayer} // Pass delete handler to LayerTabs
                />

                {/* Split component for resizable List, Map, and Feature sections */}
                <Split
                    className="split"
                    sizes={[20, 60, 20]}
                    minSize={200}
                    gutterSize={10}
                    direction="horizontal"
                    style={{ display: 'flex', width: '100%', marginTop: '20px', height: '70vh' }}
                >
                    {/* List Section on the Left */}
                    <div style={{ overflowY: 'auto', paddingRight: '10px' }}>
                        <FeatureList
                            layers={layers}
                            selectedLayerIndex={selectedLayerIndex}
                            setSelectedFeature={setSelectedFeature} // Pass the setter function
                            selectedFeature={selectedFeatures[selectedLayerIndex] || null} // Pass current feature for this layer
                        />
                    </div>

                    {/* Map Section in the Center */}
                    <div style={{ flexGrow: 1 }}>
                        <ErrorBoundary>
                            <MapDisplay
                                layers={layers}
                                selectedLayerIndex={selectedLayerIndex}
                                selectedFeature={selectedFeatures[selectedLayerIndex] || null} // Pass current feature for this layer
                                setSelectedFeature={setSelectedFeature} // Pass the setter function
                            />
                        </ErrorBoundary>
                    </div>

                    {/* Feature Details Section on the Right */}
                    <div style={{ overflowY: 'auto', paddingLeft: '10px' }}>
                        <Feature feature={selectedFeatures[selectedLayerIndex] || null} />
                    </div>
                </Split>
            </Container>
            <Footer />
        </div>
    );
};

export default GeoJsonMap;
