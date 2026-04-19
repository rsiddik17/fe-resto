import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useCartStore } from "../../store/useCartStore";
import Header from "../../components/HeaderOnline/HeaderOnline";
import Button from "../../components/ui/Button";
import AddressModal from "../../components/AddressModalOnline/AddressModalOnline";
import { ArrowLeft, MapPin, FileText, Info, Wallet, Bike, Plus } from "lucide-react";
import DiscountModal from "../../components/DiscountModalOnline/DiscountModalOnline";
interface Address {
  id: string;
  detail: string;
}

const CheckoutPageOnline = () => {
  const navigate = useNavigate();
  const { items } = useCartStore();

  // STATE MANAGEMENT
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(() => {
    return localStorage.getItem("selected_address_id") || "1";
  });

  const [addresses, setAddresses] = useState<Address[]>(() => {
    const saved = localStorage.getItem("user_addresses");
    return saved ? JSON.parse(saved) : [
      { id: "1", detail: "Jl. Sholeh Iskandar No.Km.02, RT.01/RW.010, Kedungbadak, Tanah Sareal, Kota Bogor, Jawa Barat 16162" },
      { id: "2", detail: "Gedung Sentra Sudirman Lt.12, Jl. Jenderal Sudirman, Jakarta Selatan 12190" },
    ];
  });

  useEffect(() => {
    localStorage.setItem("selected_address_id", selectedAddressId);
  }, [selectedAddressId]);

  // LOGIC PERHITUNGAN
  const currentAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];
  const selectedItems = items.filter((item) => item.checked === true);
  
  const safeTotalPrice = selectedItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const ppn = safeTotalPrice * 0.1;
  const grandTotal = safeTotalPrice + ppn - appliedDiscount;

  const handleKonfirmasiPesanan = () => {
    navigate("/customer/pembayaran", {
      state: {
        orderId: `ITSR-${Date.now()}`,
        address: currentAddress.detail,
        items: selectedItems,
        subTotal: safeTotalPrice,
        discountAmount: appliedDiscount,
        adminFee: 2500,
        finalPayment: grandTotal + 2500,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] pb-20">
      <Header mode="online" />

      {/* Header Page */}
      <div className="bg-white p-5 flex rounded-2xl items-center gap-3 border-b border-gray-100 shadow-sm mb-3">
        <button onClick={() => navigate(-1)} className="hover:bg-gray-100 p-1 rounded-full transition-colors">
          <ArrowLeft size={22} className="text-black font-bold" />
        </button>
        <h1 className="text-xl font-bold text-black">Pembayaran</h1>
      </div>

      <main className="max-w-4xl mx-auto px-4">
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
              <button onClick={() => setIsAddressModalOpen(true)} className="text-primary border border-primary px-3 py-1.5 rounded-full text-[10px]">
                Ganti Alamat
              </button>
            </div>
            <div className="ml-11">
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={16} className="text-white fill-primary" />
                <p className="font-bold text-black text-[15px]">Detail Alamat</p>
              </div>
              <p className="text-[13px] text-gray-400 leading-relaxed max-w-lg">{currentAddress.detail}</p>
            </div>
          </div>

          {/* 2. RINGKASAN PESANAN & PEMBAYARAN */}
          <div className="bg-white rounded-xs border border-gray-200 p-6 space-y-8">
            <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
              <div className="bg-primary p-2 rounded-full text-white"><FileText size={18} /></div>
              <h2 className="font-bold text-black text-lg">Ringkasan Pesanan</h2>
            </div>

            {/* List Item */}
            <div className="space-y-6">
              {selectedItems.map((item) => (
                <div key={item.cartId} className="flex gap-5 items-start">
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md object-cover border border-gray-100" />
                  <div className="flex-1 pt-1">
                    <h3 className="font-bold text-base text-black">{item.name}</h3>
                    <div className="flex items-center gap-2 text-gray-400 text-[12px] mt-1">
                      <FileText size={14} /> <span>{item.notes || "Tidak ada"}</span>
                    </div>
                  </div>
                  <p className="font-bold text-primary text-base">Rp{(item.price * item.qty).toLocaleString("id-ID")}</p>
                </div>
              ))}
            </div>

            {/* Ringkasan Pembayaran */}
            <div className="pt-6 border-t border-gray-100 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-primary p-1.5 rounded-full text-white"><Wallet size={16} /></div>
                <h3 className="font-bold text-[15px] text-black">Ringkasan Pembayaran</h3>
              </div>
              
              <div className="space-y-3 ml-1">
                <div className="flex justify-between items-center text-[14px] text-black">
                  <span>Total Pesanan</span>
                  <span>Rp{safeTotalPrice.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between items-center text-[14px] text-black">
                  <span>PPN 10%</span>
                  <span>Rp{ppn.toLocaleString("id-ID")}</span>
                </div>

                {/* TOMBOL DISKON (Trigger Modal) */}
                <button 
                  onClick={() => setIsDiscountModalOpen(true)}
                  className="w-full border-2 border-primary rounded-md py-2.5 flex items-center justify-center gap-2 text-primary font-bold hover:bg-primary/5 transition-all"
                >
                  <Plus size={18} strokeWidth={3} />
                  Tambah Diskon
                </button>

                {appliedDiscount > 0 && (
                  <div className="flex justify-between items-center text-[14px] text-red-500 font-medium animate-in fade-in">
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
              <p className="font-bold text-primary text-[16px] mb-1">Informasi Pembayaran</p>
              <p className="text-[14px] text-primary leading-relaxed">
                Setelah konfirmasi pesanan, biaya admin akan ditambahkan pada nominal QRIS.
              </p>
            </div>
          </div>

          {/* BUTTON KONFIRMASI */}
          <div className="pt-6 flex justify-center">
            <Button
              onClick={handleKonfirmasiPesanan}
              className="w-full max-w-lg py-4 rounded-full text-white text-lg font-bold shadow-md shadow-primary/20 transition-all active:scale-95"
            >
              Konfirmasi Pesanan
            </Button>
          </div>
        </div>
      </main>

      {/* MODAL ALAMAT */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        selectedId={selectedAddressId}
        onSelect={(id) => setSelectedAddressId(id)}
      />

      {/* MODAL DISKON */}
      {isDiscountModalOpen && (
        <DiscountModal
          subTotal={safeTotalPrice}
          onClose={() => setIsDiscountModalOpen(false)}
          onApply={(amount) => setAppliedDiscount(amount)}
        />
      )}
    </div>
  );
};

export default CheckoutPageOnline;