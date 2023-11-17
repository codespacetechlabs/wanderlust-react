import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

const Map = () => {
  return (
    <MapContainer
      center={[23.0498928, 72.5330175]}
      zoom={13}
      scrollWheelZoom={true}
      className="min-h-1/2 h-1/2 lg:h-3/4 w-full lg:w-1/2 outline-none rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[23.0498928, 72.5330175]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
