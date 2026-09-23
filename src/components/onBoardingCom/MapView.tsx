// "use client";

// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

// export interface MapPin {
//   id: string;
//   position: [number, number];
//   label: string;
//   /** Hex color for this pin. Defaults to the brand green. */
//   color?: string;
//   /** true = a slightly larger, highlighted pin (used for "your business"). */
//   primary?: boolean;
// }

// interface MapViewProps {
//   center: [number, number];
//   zoom?: number;
//   pins: MapPin[];
//   className?: string;
// }

// /**
//  * Builds a small teardrop-pin divIcon so markers match the app's palette
//  * instead of Leaflet's default blue marker image.
//  */
// function pinIcon(color: string, primary?: boolean) {
//   const size = primary ? 34 : 26;
//   const html = `
//     <div style="
//       width:${size}px;height:${size}px;
//       display:flex;align-items:center;justify-content:center;
//       filter: drop-shadow(0 2px 3px rgba(0,0,0,.25));
//     ">
//       <svg viewBox="0 0 24 24" width="${size}" height="${size}">
//         <path fill="${color}" stroke="white" stroke-width="1"
//           d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7z" />
//         <circle cx="12" cy="9" r="${primary ? 3.4 : 2.6}" fill="white" />
//       </svg>
//     </div>`;
//   return L.divIcon({
//     html,
//     className: "",
//     iconSize: [size, size],
//     iconAnchor: [size / 2, size],
//     popupAnchor: [0, -size],
//   });
// }

// export default function MapView({ center, zoom = 14, pins, className = "" }: MapViewProps) {
//   return (
//     <MapContainer
//       center={center}
//       zoom={zoom}
//       scrollWheelZoom={false}
//       dragging={true}
//       className={`z-0 ${className}`}
//       style={{ height: "100%", width: "100%" }}
//       attributionControl={false}
//     >
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         attribution="© OpenStreetMap contributors"
//       />
//       {pins.map((pin) => (
//         <Marker key={pin.id} position={pin.position} icon={pinIcon(pin.color ?? "#16A34A", pin.primary)}>
//           <Popup>{pin.label}</Popup>
//         </Marker>
//       ))}
//     </MapContainer>
//   );
// }
"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

export interface MapPin {
  id: string;
  position: [number, number];
  label: string;
  /** Hex color for this pin. Defaults to the brand green. */
  color?: string;
  /** true = a slightly larger, highlighted pin (used for "your business"). */
  primary?: boolean;
}

interface MapViewProps {
  center: [number, number];
  zoom?: number;
  pins: MapPin[];
  className?: string;
}

/**
 * Builds a small teardrop-pin divIcon so markers match the app's palette
 * instead of Leaflet's default blue marker image.
 */
function pinIcon(color: string, primary?: boolean) {
  const size = primary ? 34 : 26;
  const html = `
    <div style="
      width:${size}px;height:${size}px;
      display:flex;align-items:center;justify-content:center;
      filter: drop-shadow(0 2px 3px rgba(0,0,0,.25));
    ">
      <svg viewBox="0 0 24 24" width="${size}" height="${size}">
        <path fill="${color}" stroke="white" stroke-width="1"
          d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7z" />
        <circle cx="12" cy="9" r="${primary ? 3.4 : 2.6}" fill="white" />
      </svg>
    </div>`;
  return L.divIcon({
    html,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

export default function MapView({
  center,
  zoom = 14,
  pins,
  className = "",
}: MapViewProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={false}
      dragging={true}
      className={`z-0 ${className}`}
      style={{ height: "100%", width: "100%" }}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />
      {pins.map((pin) => (
        <Marker
          key={pin.id}
          position={pin.position}
          icon={pinIcon(pin.color ?? "#16A34A", pin.primary)}
        >
          <Popup>{pin.label}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
