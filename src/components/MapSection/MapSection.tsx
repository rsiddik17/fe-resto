import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// import markerIcon from "leaflet/dist/images/marker-icon.png";
// import markerShadow from "leaflet/dist/images/marker-shadow.png";

// const DefaultIcon = L.icon({
//   iconUrl: markerIcon,
//   shadowUrl: markerShadow,
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });
// L.Marker.prototype.options.icon = DefaultIcon;

const emptyIcon = L.divIcon({
  className: "empty-marker",
  html: '<div style="background: transparent; width: 0; height: 0;"></div>',
  iconSize: [0, 0],
  popupAnchor: [0, 0],
});

const RecenterMap = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 16);
  }, [lat, lng, map]);
  return null;
};

interface MapSectionProps {
  initialAddress?: string;
  initialLat?: number;
  initialLng?: number;
  initialTag?: "Rumah" | "Kantor";
  onAddressChange?: (
    address: string,
    lat: number,
    lng: number,
    tag: "Rumah" | "Kantor",
  ) => void;
}

const MapSection = ({
  initialAddress = "",
  initialLat = -6.510626,
  initialLng = 106.809559,
  initialTag = "Rumah",
  onAddressChange,
}: MapSectionProps) => {
  const [position, setPosition] = useState({
    lat: initialLat,
    lng: initialLng,
  });
  const [searchQuery, setSearchQuery] = useState(initialAddress);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedTag, setSelectedTag] = useState<"Rumah" | "Kantor">(
    initialTag,
  );
  const [showDropdown, setShowDropdown] = useState(false);

  // Gunakan ref untuk track apakah ini render pertama kali
  const isFirstRender = useRef(true);

  // Update state ketika props berubah (mode edit)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setPosition({ lat: initialLat, lng: initialLng });
    setSearchQuery(initialAddress);
    // setSelectedTag(initialTag);
  }, [initialAddress, initialLat, initialLng]);

  // Ambil data saran alamat
  useEffect(() => {
    if (searchQuery.length < 4) {
      setSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&countrycodes=id`,
        );
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Error fetching geocoding data:", error);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleSelectAddress = (item: any) => {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);
    setPosition({ lat, lng });
    setSearchQuery(item.display_name);
    setShowDropdown(false);
    if (onAddressChange) {
      onAddressChange(item.display_name, lat, lng, selectedTag);
    }
  };

  const handleTagChange = (tag: "Rumah" | "Kantor") => {
    setSelectedTag(tag);
    if (onAddressChange) {
      onAddressChange(searchQuery, position.lat, position.lng, tag);
    }
  };

  const handleMapClick = async (lat: number, lng: number) => {
    setPosition({ lat, lng });

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      );
      const data = await response.json();
      const address = data.display_name || `${lat}, ${lng}`;
      setSearchQuery(address);
      if (onAddressChange) {
        onAddressChange(address, lat, lng, selectedTag);
      }
    } catch (error) {
      if (onAddressChange) {
        onAddressChange(searchQuery, lat, lng, selectedTag);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* INPUT ALAMAT LENGKAP */}
      <div className="space-y-2 text-left relative">
        <label className="text-black font-bold text-sm ">Alamat Lengkap</label>

        {showDropdown && suggestions.length > 0 && (
          <ul className="absolute left-0 right-0 bottom-full mb-1 bg-white border border-gray-100 rounded-xl shadow-xl z-9999 max-h-60 overflow-y-auto divide-y divide-gray-50">
            {suggestions.map((item, index) => (
              <li
                key={index}
                onClick={() => handleSelectAddress(item)}
                className="p-3 hover:bg-primary/5 cursor-pointer text-sm text-left transition-colors text-gray-700"
              >
                {item.display_name}
              </li>
            ))}
          </ul>
        )}

        <textarea
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value); // ← nyimpan di lokal
            setShowDropdown(true);
          }}
          onBlur={() => {
            // ← 🔥 TAMBAHAN INI
            if (onAddressChange && searchQuery !== initialAddress) {
              onAddressChange(
                searchQuery,
                position.lat,
                position.lng,
                selectedTag,
              );
            }
          }}
          className="w-full p-4 mt-2 bg-white border-[1.5px] border-primary rounded-xs h-24 ..."
          placeholder="Ketik alamat..."
        />
      </div>

      {/* PETA */}
      <div
        className="w-full h-80 rounded-xl overflow-hidden border border-gray-100 
      relative z-10  [&_.leaflet-marker-icon]:!hidden"
      >
        <MapContainer
          center={[position.lat, position.lng]}
          zoom={15}
          zoomControl={false}
          style={{ height: "100%", width: "100%" }}
          onClick={(e) => handleMapClick(e.latlng.lat, e.latlng.lng)}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* <Marker position={[position.lat, position.lng]} icon={emptyIcon} /> */}
          <RecenterMap lat={position.lat} lng={position.lng} />
        </MapContainer>
      </div>

      {/* LATITUDE & LONGITUDE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
        <div className="space-y-2">
          <label className="text-black font-bold text-sm">Latitude</label>
          <input
            disabled
            className="w-full p-4 mt-2 bg-gray-100 border-[1.5px] border-gray-200 rounded-xs font-medium text-gray-500 outline-none cursor-not-allowed"
            value={position.lat}
          />
        </div>
        <div className="space-y-2">
          <label className="text-black font-bold text-sm">Longitude</label>
          <input
            disabled
            className="w-full p-4 mt-2 bg-gray-100 border-[1.5px] border-gray-200 rounded-xs font-medium text-gray-500 outline-none cursor-not-allowed"
            value={position.lng}
          />
        </div>
      </div>

      {/* TANDAI SEBAGAI */}
      <div className="flex flex-col gap-3 text-left">
        <label className="text-black font-bold text-sm">Tandai Sebagai</label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => handleTagChange("Rumah")}
            className={`px-10 py-2.5 border-2 rounded-full font-bold transition-all ${
              selectedTag === "Rumah"
                ? "border-primary text-primary bg-primary/5"
                : "border-gray-200 text-gray-400"
            }`}
          >
            Rumah
          </button>
          <button
            type="button"
            onClick={() => handleTagChange("Kantor")}
            className={`px-10 py-2.5 border-2 rounded-full font-bold transition-all ${
              selectedTag === "Kantor"
                ? "border-primary text-primary bg-primary/5"
                : "border-gray-200 text-gray-400"
            }`}
          >
            Kantor
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapSection;
