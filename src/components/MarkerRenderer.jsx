import { Marker, Popup } from "react-leaflet";

const MarkerRenderer = ({ mapMarkers }) => {
  return mapMarkers.value.map((marker, index) => (
    <Marker position={[marker.latitude, marker.longitude]} key={index}>
      <Popup>
        <div className="flex flex-col gap-2">
          <h1 className="text-base font-bold">{marker.label}</h1>
        </div>
      </Popup>
    </Marker>
  ));
};

export default MarkerRenderer;
