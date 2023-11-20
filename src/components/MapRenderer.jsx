import { TileLayer, useMapEvents } from "react-leaflet";
import { latitude, longitude, zoom } from "../signals";
import { effect } from "@preact/signals-react";
import { LatLng } from "leaflet";

const MapRenderer = () => {
  const map = useMapEvents({
    click: () => {},
  });

  effect(() => {
    const latlng = new LatLng(latitude.value, longitude.value);
    map.flyTo(latlng, zoom.value ?? map.getZoom());
  });

  return (
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
  );
};

export default MapRenderer;
