import { useNavigate } from "react-router";

const EmptyOrder = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {/* Ilustrasi */}
      <div className="relative w-full max-w-[320px] mb-8">
        <img 
          src="/images/empty-illustration.png" 
          alt="Belum ada pesanan"
          className="w-full h-auto object-contain mx-auto"
        />
      </div>

      {/* Teks */}
      <div className="space-y-3 mb-10">
        <h2 className="text-2xl font-bold text-primary">
          Belum Terdapat Pesanan
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed max-w-[320px] mx-auto">
          Pesanan yang sedang diproses akan muncul di halaman ini
        </p>
      </div>

      {/* Tombol */}
      <button
        onClick={() => navigate("/customer/menu")}
        className="bg-primary font-bold text-white w-full max-w-[320px] py-3.5 rounded-full  flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
      >
        <span className="text-xl font-normal">+</span>
        <span>Tambah Pesanan</span>
      </button>
    </div>
  );
};

export default EmptyOrder;