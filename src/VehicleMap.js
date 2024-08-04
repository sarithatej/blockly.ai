// src/VehicleMap.js
import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import axios from 'axios';

const containerStyle = {
  width: '100%',
  height: '100vh'
};

const center = {
  lat: 17.385044,
  lng: 78.486671
};

const VehicleMap = () => {
  const [path, setPath] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(center);

  useEffect(() => {
    const fetchLocation = async () => {
      const response = await axios.get('/api/vehicle-location');
      const data = response.data;
      setPath(data.map(loc => ({ lat: loc.latitude, lng: loc.longitude })));
      setCurrentPosition({ lat: data[data.length - 1].latitude, lng: data[data.length - 1].longitude });
    };

    fetchLocation();
    const interval = setInterval(fetchLocation, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <LoadScript googleMapsApiKey="YOUR_API_KEY">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentPosition}
        zoom={14}
      >
        {path.length > 0 && (
          <>
            <Marker position={currentPosition} icon="https://maps.google.com/mapfiles/kml/shapes/cabs.png" />
            <Polyline path={path} options={{ strokeColor: '#FF0000', strokeOpacity: 1.0, strokeWeight: 2 }} />
          </>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default VehicleMap;
