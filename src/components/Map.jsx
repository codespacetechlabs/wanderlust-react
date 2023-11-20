/* eslint-disable react/prop-types */
import { MapContainer } from "react-leaflet";
import { latitude, longitude, mapMarkers, zoom } from "../signals";
import MapRenderer from "./MapRenderer";
import MarkerRenderer from "./MarkerRenderer";

const Map = () => {
  return (
    <MapContainer
      center={[latitude.value, longitude.value]}
      zoom={zoom.value}
      scrollWheelZoom={true}
      className="min-h-1/2 h-1/2 lg:h-3/4 w-full lg:w-1/2 outline-none rounded-lg"
      attributionControl={false}
    >
      <MapRenderer />
      <MarkerRenderer mapMarkers={mapMarkers} />
    </MapContainer>
  );
};

export default Map;
