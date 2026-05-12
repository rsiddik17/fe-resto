import { useNavigate } from "react-router";
import {
  CircleDollarSign,
  LayoutGrid,
  Plus,
  ClipboardList,
} from "lucide-react";

import DashboardHeader from "../../components/Header/DashboardHeader";
import StatCardCashier from "../../components/Card/StatCardCashier";
import TableStatusBoard from "../../components/Table/TableStatusBoard";
import TotalOrderIcon from "../../components/Icon/TotalOrderIcon";
import IncomingOrderTable from "../../components/Table/IncomingOrderTable";

// --- MOCK DATA ---
const MOCK_INCOMING_ORDERS = [
  {
    id: "#ORD-16",
    menu: "Nasi Goreng, Batagor, Matcha Latte",
    table: "Meja 01",
    status: "DIMASAK",
    total: 50000,
    method: "QR",
  },
  {
    id: "#ORD-15",
    menu: "Ikan Bakar, Mie Ayam Bakso",
    table: "Meja 04",
    status: "DIMASAK",
    total: 45000,
    method: "KIOSK",
  },
  {
    id: "#ORD-14",
    menu: "Mie Ayam Bakso, Lemon Tea",
    table: "Meja 06",
    status: "DIMASAK",
    total: 40000,
    method: "ONLINE",
  },
  {
    id: "#ORD-13",
    menu: "Sate, Batagor, Matcha Latte",
    table: "Meja 07",
    status: "DIMASAK",
    total: 55000,
    method: "QR",
  },
  {
    id: "#ORD-12",
    menu: "Ayam Penyet, Es Teler",
    table: "Meja 02",
    status: "DIMASAK",
    total: 50000,
    method: "KASIR",
  },
  {
    id: "#ORD-11",
    menu: "Nasi Kuning, Batagor, Lemon tea",
    table: "Meja 11",
    status: "DIMASAK",
    total: 55000,
    method: "KIOSK",
  },
  {
    id: "#ORD-10",
    menu: "Nasi Goreng, Matcha Latte",
    table: "Meja 09",
    status: "DIMASAK",
    total: 50000,
    method: "KIOSK",
  },
];

const CashierDashboardPage = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* 1. HEADER */}
      <div className="pt-7.5 pl-8 pr-6">
        <DashboardHeader
          title="Dashboard Kasir"
          subtitle="Ringkasan data pesanan dan aktivitas restoran"
          userName="Rina" // Ganti dinamis nanti
          roleName="Kasir"
        />
      </div>

      {/* 2. MAIN CONTENT (Scrollable keseluruhan) */}
      <div className="pt-0 pb-6 px-8">
        {/* ROW 1: 3 Stat Cards */}
        <div className="flex flex-col lg:flex-row gap-4.5 mb-5">
          <div className="flex-1 flex flex-col md:flex-row gap-4.5 w-full">
            <div className="flex-1">
              <StatCardCashier
                title="Total Order Hari Ini"
                value="150"
                Icon={TotalOrderIcon}
              />
            </div>
            <div className="flex-1">
              <StatCardCashier
                title="Pemasukkan Hari Ini"
                value="Rp5.070.000"
                Icon={CircleDollarSign}
              />
            </div>
          </div>
          <div className="w-full lg:w-auto flex-[0.423] lg:max-w-82.5 shrink-0">
            <StatCardCashier
              title="Meja Terisi"
              value={
                <span>
                  20<span className="text-gray/75 text-2xl font-bold">/25</span>
                </span>
              }
              Icon={LayoutGrid}
            />
          </div>
        </div>

        {/* ROW 2: Pesanan Masuk (Kiri) & Aksi Cepat + Status (Kanan) */}
        <div className="flex flex-col lg:flex-row gap-5">
          {/* --- KOLOM KIRI (Tabel Pesanan Masuk) --- */}
          <div className="flex-1">
            <IncomingOrderTable orders={MOCK_INCOMING_ORDERS} />
          </div>

          {/* --- KOLOM KANAN (Aksi Cepat & Status Meja) --- */}
          <div className="w-full flex-[0.423] lg:w-67.5 flex flex-col gap-4">
            {/* AKSI CEPAT */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 pt-3.5 pb-5">
              <h3 className="font-bold text-lg mb-2">Aksi Cepat</h3>

              <div className="flex flex-col gap-3.5">
                <button
                  onClick={() => navigate("/cashier/order-list")}
                  className="flex items-center gap-4 bg-white border border-gray-200 rounded-md px-3 py-2 transition-all shadow-sm cursor-pointer"
                >
                  <div className="bg-primary w-7.5 h-7.5 rounded-full flex items-center justify-center text-white shrink-0 transition-transform">
                    <Plus size={18} strokeWidth={3} />
                  </div>
                  <span className="font-extrabold text-[15px]">
                    Buat Pesanan
                  </span>
                </button>

                <button
                  onClick={() => navigate("/cashier/management-menu-stock")}
                  className="flex items-center gap-4 bg-white border border-gray-200 rounded-md px-3 py-2 transition-all shadow-sm cursor-pointer"
                >
                  <div className="bg-primary w-7.5 h-7.5 rounded-full flex items-center justify-center text-white shrink-0 transition-transform">
                    <ClipboardList size={18} strokeWidth={2.5} />
                  </div>
                  <span className="font-extrabold text-[15px] text-black">
                    Lihat Stok
                  </span>
                </button>
              </div>
            </div>

            {/* STATUS MEJA */}
            {/* Memanggil komponen buatanmu sebelumnya */}
            <TableStatusBoard />
          </div>
        </div>
      </div>
    </>
  );
};

export default CashierDashboardPage;
