import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";

import { MarkerData } from "@/types/markerData";
import { MapLocation } from "@/types/mapLocation";

type Props = {
  MapLocation: MapLocation;
};

export default function MapSingleLocation({ MapLocation }: Props) {
  const markerData: MarkerData = {
    coordinates: [MapLocation.lat, MapLocation.lng],
  };

  return (
    <MapContainer
      center={markerData.coordinates}
      zoom={11}
      style={{ height: "40vh" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <Marker position={markerData.coordinates}>
        <Popup>
          <div className="flex h-fit flex-col">
            <div className="font-semibold">{MapLocation.title}</div>
            <div>{MapLocation.VisibleAddress}</div>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
