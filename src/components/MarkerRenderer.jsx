import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

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
