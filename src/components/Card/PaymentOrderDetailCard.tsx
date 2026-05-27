const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

interface PaymentOrderDetailCardProps {
  passedOrder: any;
}

const PaymentOrderDetailCard = ({ passedOrder }: PaymentOrderDetailCardProps) => {
  // Hitung summary di dalam komponen ini saja biar rapi
  const totalPesanan = passedOrder?.total || 0;
  const ppn = totalPesanan * 0.1; // Contoh PPN 10%
  const biayaAdmin = 101;
  const totalPembayaran = totalPesanan + ppn + biayaAdmin;

  const sourceMethod = passedOrder?.leftBadges?.[0]?.text || "Lainnya";
  const table = passedOrder?.title || "";

  return (
    <div className="flex flex-col w-full h-full">
      
      {/* 1. KOTAK ATAS: HEADER INFO PESANAN (Ungu Muda) */}
      <div className="bg-primary/15 rounded-sm px-3 py-4 flex flex-col gap-0.5">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-base md:text-lg text-primary leading-none">
            {passedOrder?.orderId || "#-"}
          </h3>
          <span className="text-black/50 text-[14.5px] md:text-[15px]">
            {passedOrder?.time || "-"}
          </span>
        </div>
        <div className="flex justify-between items-center mt-0.5">
          <span className="text-black/50 text-[14.5px] md:text-[15px]">
            Sumber Order ({sourceMethod})
          </span>
          <span className="text-primary text-base">
            {table}
          </span>
        </div>
      </div>

      {/* 2. BAGIAN TENGAH: RINCIAN MENU (Putih) */}
      <div className="flex-1 flex flex-col py-2 mb-4">
        <h4 className="text-base md:text-[17.5px] mb-0.5">
          Rincian Menu
        </h4>
        <div className="flex flex-col gap-1.5">
          {passedOrder?.items?.map((item: any, idx: number) => (
            <div key={idx} className="flex justify-between items-start">
              <div className="flex flex-col">
                <span className="text-[13.5px] md:text-[13px]">
                  {item.name} x{item.qty}
                </span>
                {/* Garis Kiri Catatan (Sesuai Gambar: Warna Ungu) */}
                <div className="border-l-2 border-primary pl-1 ml-px">
                  <span className="text-black/50 text-[12.5px] md:text-xs">
                    Catatan: {item.note || "Tidak ada"}
                  </span>
                </div>
              </div>
              <span className="text-[13.5px] md:text-[13px]">
                {item.price ? rupiahFormatter.format(item.price) : "-"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. KOTAK BAWAH: RINCIAN HARGA (Ungu Muda) */}
      <div className="bg-primary/15 rounded-sm px-3 py-4 flex flex-col gap-1 mt-auto">
        <div className="flex justify-between items-center">
          <span className="text-[13.5px] md:text-sm">Total Pesanan</span>
          <span className="text-[13.5px] md:text-sm">
            {rupiahFormatter.format(totalPesanan)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[13.5px] md:text-sm">PPN 10%</span>
          <span className="text-[13.5px] md:text-sm">
            {rupiahFormatter.format(ppn)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[13.5px] md:text-sm">Biaya Admin</span>
          <span className="text-[13.5px] md:text-sm">
            {rupiahFormatter.format(biayaAdmin)}
          </span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="font-bold text-[14px] md:text-[14.5px]">Total Pembayaran</span>
          <span className="text-[14px] md:text-[14.5px]">
            {rupiahFormatter.format(totalPembayaran)}
          </span>
        </div>
      </div>

    </div>
  );
};

export default PaymentOrderDetailCard;