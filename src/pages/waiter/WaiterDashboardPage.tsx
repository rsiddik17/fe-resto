import { ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router";
import Button from "../../components/ui/Button";
import StatCard from "../../components/Card/StatCard";
import DashboardHeader from "../../components/Header/DashboardHeader";
import {
  ProcessingOrderCard,
  ReadyOrderCard,
} from "../../components/Card/OrderCards";
import TableStatusBoard from "../../components/Table/TableStatusBoard";
import TableManagementIcon from "../../components/Icon/TableManagementIcon";
import InfoCircleIcon from "../../components/Icon/InfoCircleIcon";
import ProcessingIcon from "../../components/Icon/ProcessingIcon";
import DeliveryIcon from "../../components/Icon/DeliveryIcon";
import AddOrderIcon from "../../components/Icon/AddOrderIcon";

const WaiterDashboardPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="pt-8 pl-7 pr-2.5">
        {/* 1. HEADER */}
        <DashboardHeader
          title="Dashboard Pelayan"
          subtitle="Pantau aktivitas pesanan dan layanan meja"
          userName="Mila" // Nanti ganti dengan user?.fullname
          roleName="Pelayan"
        />
      </div>

      <div className="pt-0 pb-6 px-7">

        {/* 2. KARTU STATISTIK (Grid 3 Kolom) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <StatCard title="Sedang Diproses" value="7" Icon={ProcessingIcon} />
          <StatCard
            title="Pesanan Harus Antar"
            value="10"
            Icon={DeliveryIcon}
          />
          <StatCard
            title="Meja Terisi"
            value={
              <>
                20<span className="text-gray-400 text-2xl font-bold">/25</span>
              </>
            }
            Icon={TableManagementIcon}
          />
        </div>

        {/* 3. AREA BAWAH (2 KOLOM di Layar Besar) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">
          {/* KOLOM KIRI: Daftar Pesanan (Ambil 2 porsi grid) */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* --- SECTION: PESANAN SIAP SAJI --- */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <InfoCircleIcon className="text-primary" />
                  <h2 className="font-bold text-base md:text-lg">
                    Pesanan Siap Saji
                  </h2>
                </div>
                <Link
                  to="/waiter/daftar-pesanan"
                  className="text-primary text-xs md:text-sm hover:underline flex items-center"
                >
                  Lihat semua <ChevronRight size={18} className="ml-1" strokeWidth={2.5} />
                </Link>
              </div>

              {/* Grid Kartu Siap Saji */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <ReadyOrderCard
                  orderId="26040299"
                  tableName="Meja 07"
                  time="12:07"
                  items={["1x Ayam Penyet", "2x Matcha Latte", "1x Es Teler"]}
                />
                <ReadyOrderCard
                  orderId="26040298"
                  tableName="Meja 12"
                  time="11:59"
                  items={["1x Ayam Penyet", "2x Lychee Tea"]}
                />
              </div>
            </div>

            {/* --- SECTION: PESANAN DIPROSES --- */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="bg-primary text-white rounded-full p-1 flex items-center justify-center">
                    <ProcessingIcon className="w-4.5 h-4.5" />
                  </div>
                  <h2 className="font-bold text-base md:text-lg">
                    Pesanan Diproses
                  </h2>
                </div>
                <Link
                  to="/pelayan/daftar-pesanan"
                  className="text-primary text-xs md:text-sm hover:underline flex items-center"
                >
                  Lihat semua <ChevronRight size={18} className="ml-1" strokeWidth={2.5} />
                </Link>
              </div>

              {/* List Pesanan Diproses (Tumpuk bawah) */}
              <div className="flex flex-col gap-3">
                <ProcessingOrderCard
                  orderId="26040297"
                  tableName="Meja 06"
                  itemsString="1x Es Teler, 2x Ayam Penyet, 1x Bakso Urat"
                />
                <ProcessingOrderCard
                  orderId="26040296"
                  tableName="Meja 01"
                  itemsString="1x Lemon Tea, 1x Bakso Urat"
                />
                <ProcessingOrderCard
                  orderId="26040295"
                  tableName="Meja 04"
                  itemsString="2x Es Teler, 3x Bakso Urat"
                />
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: Status Meja & Tombol Buat Pesanan (Ambil 1 porsi grid) */}
          <div className="lg:col-span-1 flex flex-col gap-6 mt-10.5">
            <Button
              variant="outline"
              onClick={() => navigate("/pelayan/buat-pesanan")}
              className="w-full bg-white border-2 border-white text-primary font-bold text-xl py-2.5 rounded-md shadow-sm hover:border-primary/20 transition-all flex justify-center items-center gap-2"
            >
              <AddOrderIcon className="bg-primary text-white rounded-full w-6.5 h-6.5" />{" "}
              Buat Pesanan
            </Button>

            <TableStatusBoard />
          </div>
        </div>
      </div>
    </>
  );
};

export default WaiterDashboardPage;