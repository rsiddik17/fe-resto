import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useCartStore } from "../../store/useCartStore";
import Header from "../../components/HeaderOnline/HeaderOnline";
import Button from "../../components/ui/Button";
import AddressModal from "../../components/AddressModalOnline/AddressModalOnline";
import {
  ArrowLeft,
  MapPin,
  FileText,
  Info,
  Wallet,
  Bike,
  Plus,
} from "lucide-react";
import DiscountModalOnline from "../../components/DiscountModalOnline/DiscountModalOnline";
import { orderAPI } from "../../api/order.api";
import { addressAPI } from "../../api/address.api";
import { useAuthStore } from "../../store/useAuthStore";
import { customerAPI } from "../../api/onlinecustomer.api";

interface Address {
  id: string;
  detail: string;
}

const CheckoutPageOnline = () => {
  const { user, setUser } = useAuthStore();
  const [customerName, setCustomerName] = useState("Pelanggan");
  const navigate = useNavigate();
  const { items } = useCartStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appliedDiscountId, setAppliedDiscountId] = useState<number | null>(
    null,
  );
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddress, setLoadingAddress] = useState(true);

  // Ambil alamat dari API
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoadingAddress(true);
        const response = await addressAPI.getMyAddresses();
        console.log("Response address:", response);
        const data = response.data || response;
        const mappedAddresses = data.map((addr: any) => ({
          id: addr.id,
          detail: addr.address_name,
        }));
        setAddresses(mappedAddresses);

        const mainAddress = data.find(
          (addr: any) => addr.is_core_address === true,
        );
        if (mainAddress) {
          setSelectedAddressId(mainAddress.id);
        } else if (mappedAddresses.length > 0) {
          setSelectedAddressId(mappedAddresses[0].id);
        }
      } catch (error) {
        console.error("Gagal ambil alamat:", error);
      } finally {
        setLoadingAddress(false);
      }
    };
    fetchAddresses();
  }, []);

  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      4000,
    );
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        console.log("1. START fetching user profile");
        const response = await customerAPI.getProfile();
        console.log("2. RAW response:", response);

        const profileData = response.data || response;
        console.log("3. Profile data:", profileData);
        console.log("4. fullname field:", profileData.fullname);
        console.log("5. name field:", profileData.name);
        console.log("6. nama field:", profileData.nama);

        setUser(profileData);
        setCustomerName(
          profileData.fullname ||
            profileData.name ||
            profileData.nama ||
            "Pelanggan",
        );
      } catch (error) {
        console.error("ERROR fetching profile:", error);
        setCustomerName("Pelanggan (error)");
      }
    };

    console.log("0. User dari store:", user);

    if (user?.fullname) {
      console.log("User sudah ada, pakai dari store:", user.fullname);
      setCustomerName(user.fullname);
    } else {
      console.log("User kosong, fetch dari API...");
      fetchUserProfile();
    }
  }, [user, setUser]);

  // Simpan selectedAddressId ke localStorage
  useEffect(() => {
    if (selectedAddressId) {
      localStorage.setItem("selected_address_id", selectedAddressId);
    }
  }, [selectedAddressId]);

  // LOGIC PERHITUNGAN
  const selectedItems = items.filter((item) => item.checked === true);

  // Tentukan alamat saat ini
  const currentAddress =
    addresses.find((a) => a.id === selectedAddressId) || addresses[0];
  const adminFeeValue = 0;
  const safeTotalPrice = selectedItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );
  const afterDiscount = safeTotalPrice - appliedDiscount;
  const ppn = afterDiscount * 0.1;
  const grandTotal = afterDiscount + ppn + adminFeeValue;

  const handleKonfirmasiPesanan = async () => {
    console.log("=== DEBUG CHECKOUT ===");
    console.log("selectedAddressId:", selectedAddressId);
    console.log("List addresses:", addresses);
    console.log("selectedItems:", selectedItems);
    console.log("appliedDiscount:", appliedDiscount);
    console.log("appliedDiscountId:", appliedDiscountId);
    console.log("======================");
    if (selectedItems.length === 0) {
      alert("Tidak ada item yang dipilih");
      return;
    }

    if (!selectedAddressId) {
      alert("Silakan pilih alamat pengiriman terlebih dahulu");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload: any = {
        source: "ONLINE",
        table_id: null,
        address_id: selectedAddressId,
        order_items: selectedItems.map((item) => ({
          menu_id: item.id,
          quantity: item.qty,
          notes: item.notes || "",
        })),
      };

      if (appliedDiscountId) {
        payload.discount_id = appliedDiscountId;
      }

      console.log("Mengirim ke backend:", payload);
      const response = await orderAPI.createOrder(payload);
      console.log("Response backend:", response);

      const backendOrderId = response.data.id;
      const backendGrandTotal = response.data.grand_total_amount;

      console.log(" backendGrandTotal:", backendGrandTotal);
      console.log(" response.data:", response.data);

      navigate("/customer/payment", {
        state: {
          orderId: backendOrderId,
          customerName: customerName,
          finalPayment: backendGrandTotal,
          subTotal: safeTotalPrice,
          discountAmount: appliedDiscount,
          adminFee: response.data.admin_fee || 0,
          address: currentAddress?.detail || "",
          purchasedItems: selectedItems,
        },
      });
    } catch (error: any) {
      console.error("Gagal membuat pesanan:", error);
      const errorMessage =
        error.response?.data?.message || "Gagal memproses pesanan";
      showToast(errorMessage, "error");
      setIsSubmitting(false);
    }
  };

  // Loading state untuk alamat
  if (loadingAddress) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] pb-20">
        <Header mode="online" />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] pb-20">
      <Header mode="online" />

      {toast.show && (
        <div
          className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg text-white font-bold shadow-lg ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Header Page */}
      <div className="bg-white border-b border-gray-100 shadow-sm mb-3 w-full">
        <div className="w-full py-3 px-4 md:px-12 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center"
          >
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-lg font-bold text-gray-800">Pembayaran</h1>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 mt-4">
        <div className="bg-white rounded-xs shadow-sm p-5 md:p-6 space-y-6 border border-gray-100">
          {/* 1. SEKSI PENGANTARAN */}
          <div className="bg-white rounded-xs border border-gray-200 p-6">
            <div className="flex flex-row justify-between items-center gap-3 mb-4 w-full">
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <div className="bg-primary p-2 rounded-full text-white flex items-center justify-center shrink-0">
                  <Bike size={18} fill="white" />
                </div>
                <h2 className="font-bold text-black text-sm md:text-lg tracking-tight whitespace-nowrap">
                  Pengantaran
                </h2>
              </div>
              <button
                onClick={() => setIsAddressModalOpen(true)}
                className="text-primary border border-primary px-3 py-1.5 rounded-full text-[10px] shrink-0 whitespace-nowrap "
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
              <p className="text-[12px] text-gray-400 leading-relaxed max-w-lg">
                {currentAddress?.detail || "Pilih alamat pengiriman"}
              </p>
            </div>
          </div>

          {/* 2. RINGKASAN PESANAN & PEMBAYARAN */}
          <div className="bg-white rounded-xs border border-gray-200 p-6 space-y-8">
            <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
              <div className="bg-primary p-2 rounded-full text-white">
                <FileText size={18} />
              </div>
              <h2 className="font-bold text-black text-lg">
                Ringkasan Pesanan
              </h2>
            </div>

            {/* List Item */}
            <div className="space-y-4">
              {selectedItems.map((item) => (
                <div key={item.cartId} className="flex gap-4 items-start">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-md object-cover border border-gray-100"
                  />
                  <div className="flex-1">
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

            {/* Ringkasan Pembayaran */}
            <div className="pt-4 border-t border-gray-100 space-y-2.5">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-primary p-1.5 rounded-full text-white">
                  <Wallet size={16} />
                </div>
                <h3 className="font-bold text-[15px] text-black">
                  Ringkasan Pembayaran
                </h3>
              </div>

              <div className="space-y-3 ml-1">
                <div className="flex justify-between items-center text-[13px] text-black">
                  <span>Total Pesanan</span>
                  <span>Rp{safeTotalPrice.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between items-center text-[13px] text-black">
                  <span>PPN 10%</span>
                  <span>Rp{ppn.toLocaleString("id-ID")}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between items-center text-[14px]">
                    <span>Diskon</span>
                    <span>-Rp{appliedDiscount.toLocaleString("id-ID")}</span>
                  </div>
                )}

                {appliedDiscount > 0 ? (
                  <button
                    onClick={() => setAppliedDiscount(0)}
                    className="w-full border border-gray-300 rounded-md py-2.5 flex items-center justify-center text-slate-600 font-bold bg-white hover:bg-gray-50 transition-all text-sm md:text-base"
                  >
                    Batalkan Diskon
                  </button>
                ) : (
                  <button
                    onClick={() => setIsDiscountModalOpen(true)}
                    className="w-full border-2 border-primary rounded-md py-2.5 flex items-center justify-center gap-2 text-primary font-bold hover:bg-primary/5 transition-all text-sm md:text-base"
                  >
                    <Plus size={18} strokeWidth={3} /> Tambah Diskon
                  </button>
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

          {/* BUTTON KONFIRMASI */}
          <div className="pt-6 flex justify-center">
            <Button
              onClick={handleKonfirmasiPesanan}
              disabled={isSubmitting}
              className="w-full md:w-2/3 py-2 rounded-full text-white text-lg font-bold shadow-md shadow-primary/20 transition-all active:scale-95"
            >
              {isSubmitting ? "Memproses..." : "Konfirmasi Pesanan"}
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
        <DiscountModalOnline
          subTotal={safeTotalPrice}
          onClose={() => setIsDiscountModalOpen(false)}
          onApply={(amount, discountId) => {
            setAppliedDiscount(amount);
            setAppliedDiscountId(discountId);
            console.log("Discount ID yang dipakai:", discountId);
          }}
        />
      )}
    </div>
  );
};

export default CheckoutPageOnline;
