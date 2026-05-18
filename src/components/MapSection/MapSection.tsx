import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix icon marker Leaflet agar muncul dengan benar
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Komponen untuk otomatis geser kamera peta saat alamat dipilih
const RecenterMap = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 16);
  }, [lat, lng, map]);
  return null;
};

const MapSection = () => {
  const [position, setPosition] = useState({ lat: -6.510626, lng: 106.809559 });
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedTag, setSelectedTag] = useState<"Rumah" | "Kantor">("Rumah");
  const [showDropdown, setShowDropdown] = useState(false);

  // Ambil data saran alamat gratis dari Nominatim OpenStreetMap
  useEffect(() => {
    if (searchQuery.length < 4) {
      setSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&countrycodes=id`
        );
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Error fetching geocoding data:", error);
      }
    }, 500); // Debounce 500ms biar ga spam request saat ngetik

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleSelectAddress = (item: any) => {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);
    
    setPosition({ lat, lng });
    setSearchQuery(item.display_name);
    setShowDropdown(false);
  };

  return (
    <div className="space-y-6">
      {/* INPUT ALAMAT LENGKAP */}
      <div className="space-y-2 text-left relative">
        <label className="text-black font-bold text-sm">Alamat Lengkap</label>
        <textarea
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowDropdown(true);
          }}
          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl h-24 text-sm font-medium focus:border-primary outline-none resize-none"
          placeholder="Ketik alamat, misal: Puri Nirwana 3, Cibinong"
        />

        {/* DROPDOWN SARAN ALAMAT */}
        {showDropdown && suggestions.length > 0 && (
          <ul className="absolute left-0 right-0 bg-white border border-gray-100 rounded-xl mt-1 shadow-xl z-[9999] max-h-60 overflow-y-auto divide-y divide-gray-50">
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
      </div>

      {/* VISUALISASI PETA */}
      <div className="w-full h-80 rounded-xl overflow-hidden border border-gray-100 relative z-10">
        <MapContainer
          center={[position.lat, position.lng]}
          zoom={15}
          zoomControl={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[position.lat, position.lng]} />
          <RecenterMap lat={position.lat} lng={position.lng} />
        </MapContainer>
      </div>

      {/* INPUT LATITUDE & LONGITUDE (OTOMATIS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
        <div className="space-y-2">
          <label className="text-black font-bold text-sm">Latitude</label>
          <input
            disabled
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl font-medium text-gray-500 outline-none"
            value={position.lat}
          />
        </div>
        <div className="space-y-2">
          <label className="text-black font-bold text-sm">Longitude</label>
          <input
            disabled
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl font-medium text-gray-500 outline-none"
            value={position.lng}
          />
        </div>
      </div>

      {/* TANDAI SEBAGAI */}
      <div className="space-y-3 text-left">
        <label className="text-black font-bold text-sm">Tandai Sebagai</label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setSelectedTag("Rumah")}
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
            onClick={() => setSelectedTag("Kantor")}
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