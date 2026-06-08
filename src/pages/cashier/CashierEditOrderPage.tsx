import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router"; 
import { ArrowLeft } from "lucide-react"; 
import DashboardHeader from "../../components/Header/DashboardHeader";
import Loading from "../../components/Loading/Loading";
import Toast from "../../components/Toast/Toast";
import EditNoteModal from "../../components/Modal/EditNoteModal";
import OrderEditActionConfirmModal from "../../components/Modal/OrderEditActionConfirmModal";
import OrderSuccessModal from "../../components/Modal/OrderSuccessModal";
import OrderInfoCard from "../../components/Card/OrderInfoCard";
import PaymentSummaryCard from "../../components/Card/PaymentSummaryCard";

import { orderAPI } from "../../api/order.api";
import { useProfile } from "../../hooks/useProfile";
import OrderMenuItemCard from "../../components/Card/OrderMenuItemCard";

// --- FORMATTERS ---
const rupiahFormatter = (val: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(val);

const formatDateTime = (isoString: string) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  return `${String(date.getDate()).padStart(2, "0")} ${months[date.getMonth()]} ${date.getFullYear()}, ${date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`;
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "PENDING": return { text: "Menunggu Validasi", color: "text-primary", bg: "bg-primary" };
    case "VALIDATED":
    case "COOKING": return { text: "Sedang Diproses", color: "text-[#FF9100]", bg: "bg-[#FF9100]" };
    case "READY": return { text: "Siap Saji", color: "text-[#8AC926]", bg: "bg-[#8AC926]" };
    case "COMPLETED": return { text: "Selesai", color: "text-[#90EB00]", bg: "bg-[#90EB00]" };
    default: return { text: status, color: "text-gray-500", bg: "bg-gray-500" };
  }
};

const CashierEditOrderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); 
  const { firstName, roleName } = useProfile();

  const passedTableNumber = location.state?.tableNumber || "Takeaway";

  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [substitutes, setSubstitutes] = useState<any[]>([]);
  const [isLoadingSubs, setIsLoadingSubs] = useState(false);

  // SISTEM ANTREAN UNTUK EKSEKUSI API NANTI SAAT KLIK SIMPAN PERUBAHAN
  const [pendingActions, setPendingActions] = useState<Record<string, any>>({});

  const [noteModalConfig, setNoteModalConfig] = useState<{ isOpen: boolean; itemId: string; currentNote: string }>({ isOpen: false, itemId: "", currentNote: "" });
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; type: "save" | "delete"; targetItemId?: string }>({ isOpen: false, type: "save" });
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isModified, setIsModified] = useState(false);

  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({ show: false, message: "", type: "success" });

  const triggerToast = (msg: string, type: "success" | "error") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 4000);
  };

  const fetchOrderDetails = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const response = await orderAPI.getOrderById(id);
      if (response.success && response.data) setOrderData(response.data);
    } catch (error: any) {
      console.error("Gagal menarik data pesanan:", error);
      triggerToast(error.response?.data?.message || "Gagal memuat detail pesanan", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchOrderDetails(); }, [id]);

  const handleOpenSubstituteDropdown = async (item: any) => {
    const uniqueKey = item.id || item.menu_name;
    if (activeDropdown === uniqueKey) { setActiveDropdown(null); return; }
    setActiveDropdown(uniqueKey);
    setIsLoadingSubs(true);
    try {
      const unitPrice = item.sub_total / item.quantity;
      const response = await orderAPI.getSubstituteMenus(unitPrice, item.menu_id);
      setSubstitutes(response.data || []);
    } catch (error) { setSubstitutes([]); } 
    finally { setIsLoadingSubs(false); }
  };

  // 1. KETIKA PILIH MENU: Hanya masuk antrean & Ubah UI, API belum dieksekusi
  const handleSelectSubstitute = async (oldItem: any, newMenu: any) => {
    setActiveDropdown(null);
    
    // Daftarkan ke Antrean (Queue)
    setPendingActions((prev: any) => ({
       ...prev,
       [oldItem.id]: {
          type: 'SWAP',
          newMenuId: newMenu.id,
          qty: oldItem.quantity,
          note: oldItem.notes // Simpan catatan saat ini ke dalam antrean swap
       }
    }));

    // Ubah UI secara instan (Pura-pura udah keganti)
    setOrderData((prev: any) => {
       const updatedItems = prev.items.map((i: any) => 
          i.id === oldItem.id ? { ...i, menu_id: newMenu.id, menu_name: newMenu.name } : i
       );
       return { ...prev, items: updatedItems };
    });
    setIsModified(true);
  };

  // 2. KETIKA KASIH CATATAN: Masuk antrean & Ubah UI
  const handleSaveNote = (newNote: string) => {
    const itemId = noteModalConfig.itemId;
    
    setPendingActions((prev: any) => {
       const existingAction = prev[itemId];
       // Kalau sebelumnya item ini udah di Swap, timpa Payload catatannya dengan yang baru!
       if (existingAction && existingAction.type === 'SWAP') {
          return { ...prev, [itemId]: { ...existingAction, note: newNote } };
       }
       // Kalau belum di swap, daftarkan sebagai aksi ubah catatan
       return { ...prev, [itemId]: { type: 'NOTE', note: newNote } };
    });

    // Ubah UI seketika
    setOrderData((prev: any) => {
       const updatedItems = prev.items.map((i: any) => 
          i.id === itemId ? { ...i, notes: newNote } : i
       );
       return { ...prev, items: updatedItems };
    });
    setIsModified(true);
    setNoteModalConfig({ isOpen: false, itemId: "", currentNote: "" });
  };

  // 3. KETIKA HAPUS: Masuk antrean & Ubah UI (Kalkulasi ulang harga di UI)
  const executeDelete = async () => {
    const itemId = confirmModal.targetItemId;
    if (!itemId) return;
    setConfirmModal({ ...confirmModal, isOpen: false });

    // Masukkan ke antrean Hapus
    setPendingActions((prev: any) => ({ ...prev, [itemId]: { type: 'DELETE' } }));

    // Kalkulasi Total yang baru di layar
    setOrderData((prev: any) => {
       const deletedItem = prev.items.find((i: any) => i.id === itemId);
       if (!deletedItem) return prev;

       const newTotal = prev.payments.total_amount - Number(deletedItem.sub_total);
       const newTax = newTotal * 0.1;
       const uniqueCode = Number(prev.payments.unique_code) || 0;
       
       return {
          ...prev,
          total_items: prev.total_items - deletedItem.quantity,
          items: prev.items.filter((i: any) => i.id !== itemId),
          payments: {
             ...prev.payments,
             total_amount: newTotal,
             tax_amount: newTax,
             grand_total_amount: newTotal + newTax + uniqueCode
          }
       };
    });
    setIsModified(true);
  };

  // 4. KETIKA SIMPAN PERUBAHAN DIKLIK: Tembak ke API Postman 1 per 1!
  const executeSave = async () => {
    setConfirmModal({ ...confirmModal, isOpen: false });
    setIsProcessing(true);
    
    try {
      let hasIgnoredNotes = false;

      // Loop semua antrean yang sudah kita simpan tadi
      for (const itemId of Object.keys(pendingActions)) {
        const action = pendingActions[itemId];

        if (action.type === 'SWAP') {
          // Format catatan: Ubah 'Tidak ada' jadi string kosong agar rapi di DB
          let finalNote = action.note === "Tidak ada" ? "" : action.note;
          
          // INI AKAN SAMA PERSIS DENGAN TESTING POSTMAN KAMU! 🚀
          await orderAPI.swapOrderItem(orderData.order_id, itemId, action.newMenuId, action.qty, finalNote);
          
        } else if (action.type === 'DELETE') {
          await orderAPI.removeOrderItem(orderData.order_id, itemId);
          
        } else if (action.type === 'NOTE') {
          // Kalau kasir maksa nulis catatan tapi menunya nggak di-Tukar (Sesuai Aturan BE -> Skip)
          hasIgnoredNotes = true;
        }
      }

      if (hasIgnoredNotes) {
         triggerToast("Beberapa catatan diabaikan karena menu tidak ditukar (Aturan Sistem)", "error");
      } else {
         triggerToast("Perubahan berhasil disimpan", "success");
      }

      // Bersihkan state & Ambil data paling valid dari server
      setPendingActions({});
      setIsModified(false);
      await fetchOrderDetails(); 

      // Munculkan popup Centang Ungu lalu kembali ke layar utama
      setIsSuccessModalOpen(true);
      setTimeout(() => { setIsSuccessModalOpen(false); navigate(-1); }, 2000);
      
    } catch (error: any) {
      triggerToast(error.response?.data?.message || "Gagal menyimpan perubahan", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) return <Loading show={true} message="Memuat detail pesanan..." />;
  if (!orderData) return <div className="text-center py-20 font-medium">Pesanan tidak ditemukan</div>;

  const statusInfo = getStatusBadge(orderData.status);

  return (
    <div onClick={() => setActiveDropdown(null)}>
      <div className="pt-16 lg:pt-7 lg:pl-8 lg:pr-6 mx-4 lg:mx-0">
        <DashboardHeader title="Daftar Pesanan" subtitle="Ringkasan data pesanan dan aktivitas restoran" userName={firstName} roleName={roleName} />
      </div>

      <div className="pt-1 lg:pt-1 pb-6 px-4 lg:px-8 flex flex-col flex-1">
        <div className="bg-white rounded-md shadow-sm border border-gray-100 p-4 md:p-4 lg:p-3 min-h-full md:min-h-screen">
          
          <div className="flex items-center gap-1 mb-3">
            <button onClick={() => navigate(-1)} className="p-1 rounded-full transition-colors cursor-pointer text-black hover:text-primary/80 group">
              <ArrowLeft size={18} strokeWidth={2.5} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <h2 className="font-bold text-base md:text-lg text-black">Edit Pesanan</h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 items-start">
            
            {/* KOLOM KIRI */}
            <div className="w-full lg:w-[67%] flex flex-col gap-3">
              <OrderInfoCard 
                orderId={orderData.order_id} 
                statusText={statusInfo.text} 
                statusColorClass={statusInfo.color} 
                statusBgClass={statusInfo.bg} 
                timeString={formatDateTime(orderData.timeStamp)} 
                isOnline={orderData.order_type === "DELIVERY"} 
                phoneNumber={orderData.payments?.phone_number} 
                tableNumberString={passedTableNumber} 
              />

              <div>
                <div className="flex justify-between items-end mb-1.5 md:mb-1.5 border-b border-gray-200 pb-2">
                  <h3 className="font-bold text-sm md:text-base text-black">Rincian Menu</h3>
                  <span className="text-black/60 font-medium text-sm md:text-[15px]">Total {orderData.total_items} Item</span>
                </div>

                <div className="flex flex-col gap-3">
                  {orderData.items.map((item: any, idx: number) => {
                    const uniqueKey = item.id || `fallback-key-${idx}`;
                    const isDropdownActive = activeDropdown === uniqueKey;
                    
                    return (
                      <OrderMenuItemCard 
                        key={uniqueKey}
                        item={item}
                        uniqueKey={uniqueKey}
                        isDropdownActive={isDropdownActive}
                        isLoadingSubs={isLoadingSubs}
                        substitutes={substitutes}
                        rupiahFormatter={(val) => rupiahFormatter(val)}
                        onOpenNotes={(e) => { e.stopPropagation(); setNoteModalConfig({ isOpen: true, itemId: uniqueKey, currentNote: item.notes || "" }); }}
                        onToggleDropdown={(e) => { e.stopPropagation(); const itemToPass = { ...item, id: uniqueKey }; handleOpenSubstituteDropdown(itemToPass); }}
                        onSelectSubstitute={(subMenu) => handleSelectSubstitute(item, subMenu)}
                        onDeleteClick={(e) => { 
                           e.stopPropagation(); 
                           if(!item.id) { triggerToast("Error: order_item_id tidak ada!", "error"); return; }
                           setConfirmModal({ isOpen: true, type: "delete", targetItemId: item.id }); 
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* KOLOM KANAN */}
            <PaymentSummaryCard 
              totalAmount={orderData.payments?.total_amount || 0}
              taxAmount={orderData.payments?.tax_amount || 0}
              adminAmount={orderData.payments?.unique_code || 0}
              grandTotal={orderData.payments?.grand_total_amount || 0}
              isModified={isModified}
              rupiahFormatter={(val) => rupiahFormatter(val)}
              onCancelClick={() => navigate(-1)}
              onSaveClick={() => setConfirmModal({ isOpen: true, type: "save" })}
            />
          </div>
        </div>
      </div>

      <Loading show={isProcessing} message="Menyimpan perubahan ke server..." />
      <Toast show={toast.show} message={toast.message} type={toast.type} />
      
      {noteModalConfig.isOpen && (
        <EditNoteModal mode="edit" initialNote={noteModalConfig.currentNote} onClose={() => setNoteModalConfig({ ...noteModalConfig, isOpen: false })} onSave={handleSaveNote} />
      )}
      <OrderEditActionConfirmModal isOpen={confirmModal.isOpen} actionType={confirmModal.type} onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })} onConfirm={confirmModal.type === "delete" ? executeDelete : executeSave} />
      <OrderSuccessModal isOpen={isSuccessModalOpen} />
    </div>
  );
};

export default CashierEditOrderPage;