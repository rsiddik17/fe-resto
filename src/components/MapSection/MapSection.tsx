import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix icon Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const RecenterMap = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], 16);
    }
  }, [lat, lng, map]);
  return null;
};

const MapClickHandler = ({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
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

// Format alamat ke Indonesia
const formatAddressToIndonesian = (displayName: string): string => {
  let formatted = displayName;
  
  const replacements: { [key: string]: string } = {
    'Street': 'Jalan', 'Road': 'Jalan', 'West Java': 'Jawa Barat',
    'East Java': 'Jawa Timur', 'Central Java': 'Jawa Tengah',
    'North': 'Utara', 'South': 'Selatan', 'East': 'Timur', 'West': 'Barat',
    'Central': 'Tengah', 'Regency': 'Kabupaten', 'City': 'Kota',
    'Village': 'Desa', 'District': 'Kecamatan', 'Province': 'Provinsi',
    'Indonesia': 'Indonesia', 'Java': 'Jawa', 'RT': 'RT', 'RW': 'RW',
  };
  
  const sortedKeys = Object.keys(replacements).sort((a, b) => b.length - a.length);
  
  for (const eng of sortedKeys) {
    const id = replacements[eng];
    const regex = new RegExp(`\\b${eng}\\b`, 'gi');
    formatted = formatted.replace(regex, id);
  }
  
  formatted = formatted.replace(/, ,/g, ',').replace(/,,/g, ',');
  formatted = formatted.replace(/\s+/g, ' ').trim();
  
  return formatted;
};

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
  const [selectedTag, setSelectedTag] = useState<"Rumah" | "Kantor">(initialTag);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isFirstRender = useRef(true);

  // Update state ketika props berubah (mode edit)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (initialLat && initialLng && initialAddress) {
        setPosition({ lat: initialLat, lng: initialLng });
        setSearchQuery(initialAddress);
      }
      return;
    }
    if (initialLat && initialLng) {
      setPosition({ lat: initialLat, lng: initialLng });
    }
    if (initialAddress) {
      setSearchQuery(initialAddress);
    }
  }, [initialAddress, initialLat, initialLng]);

  // ✅ AMBIL DATA SARAN ALAMAT DARI KOMOOT (TANPA AUTO-GEOCODE)
  useEffect(() => {
    if (searchQuery.length < 3) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(searchQuery)}&limit=5`,
        );
        const data = await response.json();
        
        if (data && data.features && data.features.length > 0) {
          const formattedSuggestions = data.features.map((feature: any) => {
            const [lng, lat] = feature.geometry.coordinates;
            const city = feature.properties.city || feature.properties.state || "";
            const name = feature.properties.name;
            const street = feature.properties.street || "";
            
            let displayName = name;
            if (street && street !== name) {
              displayName = `${street}, ${name}`;
            }
            if (city && !displayName.includes(city)) {
              displayName = `${displayName}, ${city}`;
            }
            
            return {
              display_name: formatAddressToIndonesian(displayName),
              lat: lat,
              lon: lng,
            };
          });
          setSuggestions(formattedSuggestions);
          setShowDropdown(formattedSuggestions.length > 0);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // ✅ HANDLE PILIH ALAMAT DARI DROPDOWN
  const handleSelectAddress = (item: any) => {
    const lat = item.lat;
    const lng = item.lon;
    
    setPosition({ lat, lng });
    setSearchQuery(item.display_name);
    setShowDropdown(false);
    
    if (onAddressChange) {
      onAddressChange(item.display_name, lat, lng, selectedTag);
    }
  };

  const handleTagChange = (tag: "Rumah" | "Kantor") => {
    setSelectedTag(tag);
    if (onAddressChange && searchQuery) {
      onAddressChange(searchQuery, position.lat, position.lng, tag);
    }
  };

  // ✅ HANDLE KLIK PETA
  const handleMapClick = async (lat: number, lng: number) => {
    setPosition({ lat, lng });

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      );
      const data = await response.json();
      const rawAddress = data.display_name || `${lat}, ${lng}`;
      const address = formatAddressToIndonesian(rawAddress);
      setSearchQuery(address);
      if (onAddressChange) {
        onAddressChange(address, lat, lng, selectedTag);
      }
    } catch (error) {
      console.error("Error reverse geocoding:", error);
      if (onAddressChange) {
        onAddressChange(searchQuery, lat, lng, selectedTag);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* INPUT ALAMAT LENGKAP */}
      <div className="space-y-2 text-left relative">
        <label className="text-black font-bold text-sm">Alamat Lengkap</label>

        <div className="relative">
          <textarea
            value={searchQuery}
            onChange={(e) => {
              const newAddress = e.target.value;
              setSearchQuery(newAddress);
              setShowDropdown(true);
              
              // Langsung oper nilai terbaru ke ProfilPage secara real-time
              if (onAddressChange) {
                onAddressChange(newAddress, position.lat, position.lng, selectedTag);
              }
            }}
            onBlur={() => {
              // Menghindari konflik klik item dropdown dengan penutupan otomatis dropdown
              setTimeout(() => setShowDropdown(false), 300);
            }}
            className="w-full p-4 mt-2 bg-white border-[1.5px] border-primary rounded-xs h-24"
            placeholder="Ketik alamat (minimal 3 huruf)..."
          />
          
          {isLoading && (
            <div className="absolute right-3 top-10">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            </div>
          )}

          {/* DROPDOWN */}
          {showDropdown && suggestions.length > 0 && (
            <ul className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-100 rounded-xl shadow-xl z-9999 max-h-60 overflow-y-auto">
              {suggestions.map((item, index) => (
                <li
                  key={index}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelectAddress(item);
                  }}
                  className="p-3 hover:bg-primary/5 cursor-pointer text-sm text-left text-gray-700"
                >
                  {item.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* PETA */}
      <div className="w-full h-80 rounded-xl overflow-hidden border border-gray-100 relative z-10">
        <MapContainer
          center={[position.lat, position.lng]}
          zoom={15}
          zoomControl={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[position.lat, position.lng]} />
          <MapClickHandler onMapClick={handleMapClick} />
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