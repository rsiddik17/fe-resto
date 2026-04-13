import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useCartStore } from "../../store/useCartStore";
import Header from "../../components/Header/Header";
import Button from "../../components/ui/Button";
import AddressModal from "../../components/AddressModal/AddressModal"; // Tambahkan import ini
import { ArrowLeft, MapPin, FileText, Info, Wallet, Bike } from "lucide-react";
import DiscountSection from "../../components/DiscountSectionOnline/DiscountSectionOnine";

interface Address {
  id: string;
  detail: string;
}

const CheckoutPage = () => {
  
  const navigate = useNavigate();
  const { items } = useCartStore();
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(() => {
    return localStorage.getItem("selected_address_id") || "1";
  });

  const [addresses, setAddresses] = useState<Address[]>(() => {
    const saved = localStorage.getItem("user_addresses");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "1",
            detail:
              "Jl. Sholeh Iskandar No.Km.02, RT.01/RW.010, Kedungbadak, Tanah Sareal, Kota Bogor, Jawa Barat 16162",
          },
          {
            id: "2",
            detail:
              "Gedung Sentra Sudirman Lt.12, Jl. Jenderal Sudirman, Jakarta Selatan 12190",
          },
        ];
  });

  useEffect(() => {
    const updateFromLocal = () => {
      const saved = localStorage.getItem("user_addresses");
      if (saved) setAddresses(JSON.parse(saved));
    };
    window.addEventListener("storage", updateFromLocal);
    localStorage.setItem("selected_address_id", selectedAddressId);
    return () => window.removeEventListener("storage", updateFromLocal);
  }, [selectedAddressId]);

  const currentAddress =
    addresses.find((a: Address) => a.id === selectedAddressId) || addresses[0];

  const selectedItems = items.filter((item) => item.checked === true);
  const safeTotalPrice = selectedItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  // Hitung total dengan diskon
  // const [discount] = useState(0);
  const ppn = safeTotalPrice * 0.1;
  const grandTotal = safeTotalPrice + ppn - appliedDiscount;

  return (
    <div className="min-h-screen bg-[#F3F4F6] pb-20">
      <Header mode="online" />

      {/* Header Page */}
      <div className="bg-white border-b border-gray-100 px-6 md:px-12 py-5 flex items-center gap-4 shadow-sm mb-6 rounded-2xl">
        <button
          onClick={() => navigate(-1)}
          className="hover:bg-gray-100 p-1 rounded-full transition-colors"
        >
          <ArrowLeft size={22} className="text-black font-bold" />
        </button>
        <h1 className="text-xl font-bold text-black">Pembayaran</h1>
      </div>

      <main className="max-w-4xl mx-auto px-4">
        {/* WRAPPER PUTIH UTAMA */}
        <div className="bg-white rounded-xs shadow-sm p-6 md:p-8 space-y-8 border border-gray-100">
          {/* 1. SEKSI PENGANTARAN */}
          <div className="bg-white rounded-xs border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-3">
                <div className="bg-primary p-2 rounded-full text-white flex items-center justify-center">
                  <Bike size={18} fill="white" />
                </div>
                <h2 className="font-bold text-black text-lg">Pengantaran</h2>
              </div>
              {/* Tambahkan onClick untuk buka modal */}
              <button
                onClick={() => setIsAddressModalOpen(true)}
                className="text-primary border border-primary px-5 py-1.5 rounded-full text-[11px] hover:bg-primary/5 transition-all"
              >
                Ganti Alamat
              </button>
            </div>
            <div className="ml-11">
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={16} className="text-white fill-primary" />
                <p className="font-bold text-black text-[15px]">
                  Detail Alamat
                </p>
              </div>
              <p className="text-[13px] text-gray-400 leading-relaxed max-w-lg">
                {currentAddress.detail}
              </p>
            </div>
          </div>

          {/* 2. RINGKASAN PESANAN & PEMBAYARAN */}
          <div className="bg-white rounded-xs border border-gray-200 p-6 space-y-8">
            <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
              <div className="bg-primary p-2 rounded-md text-white">
                <FileText size={18} />
              </div>
              <h2 className="font-bold text-black text-lg">
                Ringkasan Pesanan
              </h2>
            </div>

            <div className="space-y-6">
              {selectedItems.map((item) => (
                <div key={item.cartId} className="flex gap-5 items-start">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-md object-cover border border-gray-100"
                  />
                  <div className="flex-1 pt-1">
                    <h3 className="font-bold text-base text-black">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-400 text-[12px] mt-1">
                      <FileText size={14} />{" "}
                      <span>{item.notes || "Tidak ada"}</span>
                    </div>
                  </div>
                  <p className="font-bold text-primary text-base">
                    Rp{(item.price * item.qty).toLocaleString("id-ID")}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-gray-100 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-primary p-1.5 rounded-md text-white">
                  <Wallet size={16} />
                </div>
                <h3 className="font-bold text-[15px] text-black">
                  Ringkasan Pembayaran
                </h3>
              </div>
              <div className="space-y-3 ml-1">
                <div className="flex justify-between items-center text-[14px] text-black">
                  <span>
                    {selectedItems[0]?.name || "Item"} x
                    {selectedItems[0]?.qty || 1}
                  </span>
                  <span>Rp{safeTotalPrice.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between items-center text-[14px] text-black">
                  <span>Total Pesanan</span>
                  <span>Rp{safeTotalPrice.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between items-center text-[14px] text-black">
                  <span>PPN 10%</span>
                  <span>Rp{ppn.toLocaleString("id-ID")}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between items-center text-[14px] text-red-500 font-medium">
                    <span>Diskon</span>
                    <span>-Rp{appliedDiscount.toLocaleString("id-ID")}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-lg font-bold pt-4 text-black border-t border-gray-100">
                  <span>Total Pembayaran</span>
                  <span>Rp{grandTotal.toLocaleString("id-ID")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. INFORMASI PEMBAYARAN */}
          <div className="bg-[#F3E8F3] border border-primary rounded-xs p-5 flex gap-4 items-start shadow-sm">
            <div className="bg-primary p-1 rounded-full text-white mt-0.5 shrink-0">
              <Info size={16} fill="white" className="text-primary" />
            </div>
            <div>
              <p className="font-bold text-primary text-[16px] mb-1">
                Informasi Pembayaran
              </p>
              <p className="text-[14px] text-primary leading-relaxed">
                Setelah konfirmasi pesanan, biaya admin akan ditambahkan pada
                nominal QRIS.
              </p>
            </div>
          </div>

          {/* 4. SEKSI DISKON */}

          <DiscountSection onApplyDiscount={(amount) => setAppliedDiscount(amount)} />

          {/* BUTTON KONFIRMASI */}
          <div className="pt-6 flex justify-center">
            <Button 
            // onClick={() => navigate("/customer/payment")}
            className="w-full max-w-lg py-4 rounded-full text-white text-lg font-bold shadow-md shadow-primary/20 transition-all active:scale-95">
              Konfirmasi Pesanan
            </Button>
          </div>
        </div>
      </main>

      {/* Render Modal Alamat */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        selectedId={selectedAddressId}
        onSelect={(id) => {
          setSelectedAddressId(id);
          // Paksa update addresses dari localstorage saat ganti pilihan
          const saved = localStorage.getItem("user_addresses");
          if (saved) setAddresses(JSON.parse(saved));
        }}
      />
    </div>
  );
};

export default CheckoutPage;
