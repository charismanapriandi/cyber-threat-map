import 'mapbox-gl/dist/mapbox-gl.css';

import { Map, MapRef } from "react-map-gl"
import { MAPBOX_ACCESS_TOKEN, MAPBOX_STYLE } from "../../constants"
import * as THREE from 'three';
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

const initialViewState = {
  longitude: -122.4,
  latitude: 37.8,
  zoom: 0,
}
const style = {width: '100%', height: '100vh'}

export const ThreeJSMap = () => {
  const mapRef = useRef<MapRef>(null)
  
  return (
    <Map
      ref={mapRef}
      mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
      mapStyle={MAPBOX_STYLE}
      initialViewState={initialViewState}
      style={style}
    />
  )
}