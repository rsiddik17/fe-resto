import { useNavigate } from "react-router";
import Header from "../../components/Header/Header";
import { ArrowLeft, CheckCircle2, NotebookText } from "lucide-react";
// Import store cart kamu
import { useCartStore } from "../../store/useCartStore"; 

const PaymentQRIS = () => {
  const navigate = useNavigate();
  // Ambil data items dari store
  const { items } = useCartStore(); 

  // --- LOGIKA HITUNG HARGA DINAMIS ---
  const selectedItems = items.filter((item) => item.checked === true);
  
  // Hitung subtotal dari semua item yang di-check
  const subtotal = selectedItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  
  // Contoh biaya-biaya tambahan
  const ppn = subtotal * 0.1; // PPN 10%
  const discount = 5000;      // Ini bisa kamu buat dinamis juga nanti
  const adminFee = 205;       // Biaya admin sesuai desain Figma
  
  // Total akhir yang harus dibayar
  const grandTotal = subtotal + ppn + adminFee - discount;

  // ID Pesanan (bisa dibuat random atau dari backend nantinya)
  const orderId = "#260401205";

  return (
    <div className="min-h-screen bg-white pb-20">
      <Header mode="online" />

      {/* Navigasi Back */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4 mb-4 ">
        <button onClick={() => navigate(-1)} className="hover:bg-gray-100 p-1 rounded-full transition-colors">
          <ArrowLeft size={20} className="text-black" />
        </button>
        <h1 className="text-lg font-bold text-black">Pembayaran</h1>
      </div>

      {/* Area Latar Abu-abu (Sesuai Desain Figma) */}
      <div className="bg-[#F3F4F6] pt-12 pb-24 px-4">
        <main className="max-w-6xl mx-auto flex flex-col items-center">
          
          <div className="text-center mb-10">
            <div className="bg-[#6A0DAD] w-14 h-14 rounded-full flex items-center justify-center text-white mx-auto mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-2xl font-extrabold text-black mb-1">Pesanan Berhasil Dibuat!</h2>
            <p className="text-gray-500 text-sm">Silakan lakukan pembayaran via QRIS</p>
          </div>

          {/* Wrapper Putih Utama dengan rounded-xs */}
          <div className="bg-white rounded-xs border border-gray-200 shadow-sm w-full max-w-5xl p-6 md:p-10 flex flex-col md:flex-row gap-12 items-start justify-center">
            
            {/* KIRI: KARTU QRIS */}
            <div className="w-full md:w-112.5 border border-gray-100 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-[#F3E8F3]/50 px-6 py-3 flex justify-between items-center border-b border-gray-100">
                <span className="text-gray-400 text-xs">ID Pesanan</span>
                <span className="text-[#6A0DAD] font-bold text-sm">{orderId}</span>
              </div>
              
              <div className="p-10 flex flex-col items-center text-center">
                <p className="text-gray-400 text-sm mb-1">Total Pembayaran</p>
                {/* HARGA DINAMIS DI SINI */}
                <h3 className="text-3xl font-black text-[#6A0DAD] mb-8">
                  Rp{grandTotal.toLocaleString("id-ID")}
                </h3>
                
                <p className="text-black font-semibold text-sm mb-4">Scan QRIS untuk melakukan pembayaran</p>
                
                <div className="mb-8 text-black font-bold text-sm flex gap-1 justify-center">
                   Selesaikan pembayaran dalam <span className="text-primary">59:00</span>
                </div>

                {/* BARCODE GENERATOR OTOMATIS BERDASARKAN TOTAL HARGA */}
                <div className="mb-8 p-3 border border-gray-50 rounded-lg">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=PAYMENT-${orderId}-${grandTotal}`} 
                    alt="QRIS"
                    className="w-60 h-60 object-contain mx-auto"
                  />
                </div>

                <p className="text-gray-400 text-[12px] max-w-62.5 leading-relaxed">
                  Scan dengan e-wallet atau mobile banking anda
                </p>
              </div>
            </div>

            {/* KANAN: RINGKASAN PESANAN DINAMIS */}
            <div className="w-full md:w-100 pt-2">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-[#6A0DAD] p-1.5 rounded-md text-white">
                  <NotebookText size={18} />
                </div>
                <h2 className="font-bold text-black text-lg">Ringkasan Pesanan</h2>
              </div>

              {/* Looping Item yang Dibeli */}
              <div className="space-y-4 mb-6">
                {selectedItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <h4 className="font-bold text-black text-sm">{item.name} x{item.qty}</h4>
                      <div className="flex items-center gap-2 text-gray-400 text-[11px] mt-1">
                        <NotebookText size={12} /> <span>{item.notes || "Tidak ada"}</span>
                      </div>
                    </div>
                    <p className="font-bold text-black text-sm">Rp{(item.price * item.qty).toLocaleString("id-ID")}</p>
                  </div>
                ))}
              </div>

              {/* Perhitungan Biaya Dinamis */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                 <div className="flex justify-between text-sm text-black">
                   <span>Total Pesanan</span>
                   <span>Rp{subtotal.toLocaleString("id-ID")}</span>
                 </div>
                 <div className="flex justify-between text-sm text-black">
                   <span>PPN 10%</span>
                   <span>Rp{ppn.toLocaleString("id-ID")}</span>
                 </div>
                 <div className="flex justify-between text-sm text-red-500">
                   <span>Diskon</span>
                   <span>-Rp{discount.toLocaleString("id-ID")}</span>
                 </div>
                 <div className="flex justify-between text-sm text-black">
                   <span>Biaya Admin</span>
                   <span>Rp{adminFee.toLocaleString("id-ID")}</span>
                 </div>
                 <div className="flex justify-between items-center text-md font-bold pt-4 text-black border-t border-gray-100 mt-2">
                   <span>Total Pembayaran</span>
                   <span>Rp{grandTotal.toLocaleString("id-ID")}</span>
                 </div>
              </div>

              <button 
                onClick={() => navigate("/customer/payment-process")} 
                className="w-full bg-[#6A0DAD] text-white py-3.5 rounded-full font-bold mt-10 hover:bg-[#5a0b94] transition-all shadow-md"
              >
                Sudah Bayar
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default PaymentQRIS;