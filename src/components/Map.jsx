/* eslint-disable react/prop-types */
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useMap } from "react-leaflet/hooks";
import { latitude, longitude, zoom } from "../signals";
import { useEffect } from "react";
import { LatLng } from "leaflet";

function MyComponent({ la, lg, zm }) {
  const map = useMap();

  useEffect(() => {
    console.log("Map", map, la, lg, zm);
    if (!map) return;
    if (!la || !lg || !zm) return;
    const latlng = new LatLng(la, lg);
    console.log("Setting", latlng, zm);
    map.setView(latlng, zm);
  }, [la, lg, map, zm]);

  return (
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
  );
}

const Map = () => {
  console.log("Map Rendered", latitude.value, longitude.value);

  // const map = useMapEvents({
  //   click: () => {},
  // });

  // useEffect(() => {
  //   map.setView([latitude.value, longitude.value], zoom.value);
  // }, [map]);

  return (
    <MapContainer
      center={[latitude.value, longitude.value]}
      zoom={zoom.value}
      scrollWheelZoom={true}
      className="min-h-1/2 h-1/2 lg:h-3/4 w-full lg:w-1/2 outline-none rounded-lg"
    >
      {/* <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      /> */}
      {/* <Marker position={[23.0498928, 72.5330175]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker> */}
      <MyComponent la={latitude.value} lg={longitude.value} zm={zoom.value} />
    </MapContainer>
  );
};

export default Map;
