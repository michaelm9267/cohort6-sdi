import { useCallback, useEffect, useRef, useState } from 'react';
import Mapbox, { Marker } from 'react-map-gl';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { mapboxConfig } from '../../../../template/src/config'

// Map default view state
const VIEW_STATE = {
  latitude: 40.74281576586265,
  longitude: -73.99277240443942,
  zoom: 11,
};

const ShopMap = (props) => {
  const mapRef = useRef(null);

  if (!mapboxConfig.apiKey) {
    return (
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Box
            component="img"
            src="/assets/errors/error-404.png"
            sx={{
              width: 200,
              maxWidth: '100%',
            }}
          />
        </Box>
        <Typography
          variant="h5"
          sx={{ mb: 1 }}
        >
          Map cannot be loaded
        </Typography>
        <Typography
          color="text.secondary"
          variant="subtitle2"
        >
          Mapbox API Key is not configured.
        </Typography>
      </Box>
    );
  }

  return (
    <Mapbox
      attributionControl={false}
      initialViewState={VIEW_STATE}
      mapStyle={mapStyle}
      mapboxAccessToken={mapboxConfig.apiKey}
      ref={mapRef}
      maxZoom={20}
      minZoom={11}
    >
    </Mapbox>
  );
};

ShopMap.propTypes = {
  currentVehicleId: PropTypes.string,
  onVehicleSelect: PropTypes.func,
  vehicles: PropTypes.array,
};

export default ShopMap
