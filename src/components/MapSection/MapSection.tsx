import React, { useState } from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';

const MapSection = () => {
  // State koordinat default (Bogor)
  const [position, setPosition] = useState({ lat: -6.510626, lng: 106.809559 });
  const [selectedTag, setSelectedTag] = useState<"Rumah" | "Kantor">("Rumah");

  // Hook Autocomplete
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    callbackName: "initMap",
    debounce: 300,
  });

  // Fungsi saat alamat diklik dari daftar saran
  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      if (results && results.length > 0) {
        const { lat, lng } = await getLatLng(results[0]);
        setPosition({ lat, lng }); // Update posisi map dan marker
      }
    } catch (error) {
      console.error("Geocoding Error: ", error);
    }
  };

  return (
    <APIProvider 
      apiKey="MASUKKAN_API_KEY_ASLI_KAMU_DISINI" 
      solutionChannel="GMP_GCC_placesautocomplete_v1"
    >
      <div className="space-y-6">
        
        {/* INPUT ALAMAT LENGKAP */}
        <div className="space-y-2 text-left">
          <label className="text-black font-bold text-sm">Alamat Lengkap</label>
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            // disabled={!ready}
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl h-24 text-sm font-medium focus:border-primary outline-none"
            placeholder="Ketik alamat, misal: Jalan Gatot Subroto"
          />
          
          {/* DAFTAR SARAN (DROPDOWN) */}
          {status === "OK" && (
            <ul className="bg-white border rounded-xl mt-2 shadow-lg z-9999 relative overflow-hidden">
              {data.map(({ place_id, description }) => (
                <li 
                  key={place_id} 
                  onClick={() => handleSelect(description)}
                  className="p-3 hover:bg-primary/5 cursor-pointer text-sm border-b last:border-none text-left"
                >
                  {description}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* VISUALISASI PETA */}
        <div className="w-full h-80 rounded-xl overflow-hidden border-2 border-gray-50 relative">
          <Map
            defaultCenter={position}
            center={position}
            zoom={15}
            disableDefaultUI={true}
          >
            <Marker position={position} />
          </Map>
        </div>

        {/* INPUT LATITUDE & LONGITUDE (OTOMATIS) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div className="space-y-2">
            <label className="text-black font-bold text-sm">Latitude</label>
            <input 
              disabled 
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl font-medium text-gray-400" 
              value={position.lat} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-black font-bold text-sm">Longitude</label>
            <input 
              disabled 
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl font-medium text-gray-400" 
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
              className={`px-10 py-2.5 border-2 rounded-full font-bold transition-all ${selectedTag === "Rumah" ? "border-primary text-primary bg-primary/5" : "border-gray-200 text-gray-400"}`}
            >
              Rumah
            </button>
            <button 
              type="button"
              onClick={() => setSelectedTag("Kantor")}
              className={`px-10 py-2.5 border-2 rounded-full font-bold transition-all ${selectedTag === "Kantor" ? "border-primary text-primary bg-primary/5" : "border-gray-200 text-gray-400"}`}
            >
              Kantor
            </button>
          </div>
        </div>
      </div>
    </APIProvider>
  );
};

export default MapSection;