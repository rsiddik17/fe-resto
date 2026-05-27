import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import DashboardHeader from "../../components/Header/DashboardHeader";

// Zod & RHF (Tetap dipakai walau hanya untuk nampilin data, biar rapi)
import { useForm } from "react-hook-form";

// Komponen
import FormMenuImage from "../../components/Form/FormMenuImage";
import FormMenuLayout from "../../layouts/FormMenuLayout/FormMenuLayout";
import FormMenuInput from "../../components/Form/FormMenuInput";

// API
import { menuAPI } from "../../api/menu.api";
import { useProfile } from "../../hooks/useProfile";

const KitchenDetailMenuPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  const {
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "Memuat...",
      description: "Memuat...",
      category: "",
      price: "0",
      stock: "0",
    },
  });

  // AMBIL DATA DARI API SAAT HALAMAN DIBUKA
  useEffect(() => {
    const fetchMenuDetail = async () => {
      if (!id) return;
      try {
        const response = await menuAPI.getMenuById(id);

        // Trik "Bungkus Kado" untuk jaga-jaga kalau datanya terbungkus
        const menuData = response.data ? response.data : response;

        // Isi form dengan data yang sudah pasti aman
        reset({
          name: menuData.name || "",
          description: menuData.description || "Tidak ada deskripsi",
          category: menuData.category || "",
          price:
            menuData.price !== undefined && menuData.price !== null
              ? String(menuData.price)
              : "",
          stock:
            menuData.stock !== undefined && menuData.stock !== null
              ? String(menuData.stock)
              : "",
        });

        // Pakai image_path dan gabungkan dengan Base URL Backend
        if (menuData.image_path) {
          const fullImageUrl = menuData.image_path.startsWith("http")
            ? menuData.image_path
            : `${import.meta.env.VITE_BACKEND_URL}${menuData.image_path}`;

          setExistingImageUrl(fullImageUrl);
        }
      } catch (error) {
        console.error("Gagal mengambil detail menu:", error);
      }
    };

    fetchMenuDetail();
  }, [id, reset]);

  const { firstName, roleName } = useProfile();

  return (
    <>
      <div className="pt-16 lg:pt-7 lg:pl-8 lg:pr-6 mx-4 lg:mx-0 shrink-0 z-10">
        <DashboardHeader
          title="Manajemen Menu & Stok"
          subtitle="Kelola daftar menu serta ketersediaan stok"
          userName={firstName}
          roleName={roleName}
        />
      </div>

      <div className="flex-1 pt-1 lg:pt-1 pb-10 lg:pb-10 px-4 lg:px-8">
        <FormMenuLayout title="Detail Menu" onBack={() => navigate(-1)}>
          <form className="flex flex-col lg:flex-row gap-8 lg:gap-10 mt-2 pointer-events-none">
            <div className="w-full lg:w-[320px] shrink-0">
              <FormMenuImage
                previewUrl={existingImageUrl}
                readonly={true} // Matikan fitur upload
              />
            </div>

            {/* Set isDetailMode = true, otomatis input kekunci & tombol hilang! */}
            <FormMenuInput
              register={register}
              errors={errors}
              isDetailMode={true}
            />
          </form>
        </FormMenuLayout>
      </div>
    </>
  );
};

export default KitchenDetailMenuPage;
