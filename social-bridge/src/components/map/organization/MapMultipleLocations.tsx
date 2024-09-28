import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";

import { MarkerData } from "@/types/markerData";
import { MapLocation } from "@/types/mapLocation";
import Link from "next/link";

type Props = {
  MapLocations: MapLocation[];
  Center: MapLocation;
  maxHeight?: string;
};

export default function MapMultipleLocations({
  MapLocations,
  Center,
  maxHeight,
}: Props) {
  const markerData: MarkerData = {
    coordinates: [-(-Center.lat), -(-Center.lng)],
  };

  return (
    <MapContainer
      center={markerData.coordinates}
      zoom={11}
      style={{ height: maxHeight || "40vh", zIndex: 0 }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {MapLocations.map((MapLocation) => {
        const locationMarkerData: MarkerData = {
          coordinates: [-(-MapLocation.lat), -(-MapLocation.lng)],
        };

        return (
          <Marker
            key={MapLocation.id}
            position={locationMarkerData.coordinates}
          >
            <Popup>
              <div className="flex h-fit flex-col">
                <Link
                  href={`/organizations/${MapLocation.id}`}
                  className="font-semibold"
                >
                  {MapLocation.title}
                </Link>
                <div>{MapLocation.VisibleAddress}</div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
