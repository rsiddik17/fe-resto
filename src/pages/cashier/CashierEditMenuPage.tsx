import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import DashboardHeader from "../../components/Header/DashboardHeader";

// Zod & RHF
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// Komponen
import FormMenuImage from "../../components/Form/FormMenuImage";
import FormMenuLayout from "../../layouts/FormMenuLayout/FormMenuLayout";
import FormMenuInput from "../../components/Form/FormMenuInput";
import MenuActionModal from "../../components/Modal/MenuActionModal";
import Loading from "../../components/Loading/Loading"; // <--- Import Loading
import Toast from "../../components/Toast/Toast";

// API
import { menuAPI } from "../../api/menu.api"; 
import { useProfile } from "../../hooks/useProfile";

// SCHEMA VALIDASI (Gambar opsional saat Edit)
const menuSchema = z.object({
  name: z.string().min(1, "Nama menu wajib diisi!"),
  description: z.string().min(1, "Deskripsi wajib diisi!"),
  category: z.string().min(1, "Kategori wajib dipilih!"),
  price: z.string().min(1, "Harga wajib diisi!"),
  stock: z.string().min(1, "Stok wajib diisi!"),
  image: z.any().optional(), // Opsional karena user mungkin tidak ganti foto
});

type MenuFormValues = z.infer<typeof menuSchema>;

const CashierEditMenuPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // States Modal & Loading
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [formDataToSave, setFormDataToSave] = useState<MenuFormValues | null>(null);
  const [isFetching, setIsFetching] = useState(true); // Loading saat ambil data awal
  const [isUpdating, setIsUpdating] = useState(false); // Loading saat proses update API

  // --- STATE TOAST ---
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
    show: false,
    message: "",
    type: "error",
  });

  const triggerToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "error" }), 4000);
  };
  
  // State khusus untuk menampung URL gambar lama dari database
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<MenuFormValues>({
    resolver: zodResolver(menuSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      price: "",
      stock: "",
      image: undefined,
    },
  });

  // 1. AMBIL DATA DARI API SAAT HALAMAN DIBUKA
  useEffect(() => {
    const fetchMenuDetail = async () => {
      if (!id) return;
      try {
        setIsFetching(true);
        const response = await menuAPI.getMenuById(id);
        
        // Jika response.data ada isinya, kita pakai itu. Jika tidak, pakai response langsung.
        const menuData = response.data ? response.data : response;
        
        console.log("Data menu yang berhasil ditangkap:", menuData); // <-- Cek inspect element untuk melihat datanya

        // Isi form otomatis dengan data database
        reset({
          name: menuData.name || "",
          description: menuData.description || "",
          category: menuData.category || "",
          price: menuData.price != null ? String(menuData.price) : "",
          stock: menuData.stock != null ? String(menuData.stock) : "",
        });

        // Sesuaikan dengan response Backend di Postman (image_path)
        if (menuData.image_path) {
          const fullImageUrl = menuData.image_path.startsWith("http") 
            ? menuData.image_path 
            : `${import.meta.env.VITE_BACKEND_URL}${menuData.image_path}`;
            
          setExistingImageUrl(fullImageUrl);
        }
      } catch (error) {
        console.error("Gagal mengambil detail menu:", error);
        triggerToast("Gagal memuat data menu!", "error");
      } finally {
        setIsFetching(false);
      }
    };

    fetchMenuDetail();
  }, [id, reset]);

  // 2. LOGIC PREVIEW GAMBAR
  const imageFile = watch("image");
  // Jika user upload file baru, tampilkan preview file itu. Jika tidak, tampilkan gambar lama dari DB.
  const previewImage = imageFile instanceof File ? URL.createObjectURL(imageFile) : existingImageUrl;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setValue("image", file, { shouldValidate: true });
  };

  // 3. SAAT TOMBOL SIMPAN DI FORM DIKLIK (Hanya Membuka Modal)
  const onTriggerSave = (data: MenuFormValues) => {
    setFormDataToSave(data);
    setIsSaveModalOpen(true);
  };

  // 4. SAAT TOMBOL "YA, SIMPAN" DI MODAL DIKLIK (Integrasi API Update)
  const handleSaveConfirm = async () => {
    if (!formDataToSave || !id) return;

    try {
      setIsSaveModalOpen(false); // Tutup modal dulu
      setIsUpdating(true); // Tampilkan loading overlay

      const formData = new FormData();
      formData.append("name", formDataToSave.name);
      formData.append("description", formDataToSave.description);
      formData.append("category", formDataToSave.category);
      formData.append("price", String(Number(formDataToSave.price)));
      formData.append("stock", String(Number(formDataToSave.stock)));

      // KUNCI: Hanya append "image" jika user BENAR-BENAR mengunggah foto baru
      if (formDataToSave.image instanceof File) {
        formData.append("image_path", formDataToSave.image);
      }

      console.log("Mengirim perubahan ke API untuk ID:", id);
      
      // Tembak API Update Menu
      await menuAPI.updateMenu(id, formData);

      triggerToast("Berhasil menyimpan perubahan!", "success");
      
      setTimeout(() => navigate("/cashier/management-menu-stock"), 1500);
    } catch (error: any) {
      console.error("🚨 DETAIL ERROR UPDATE:", error.response?.data);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || "Terjadi kesalahan server saat update";
      triggerToast(`Gagal: ${errorMsg}`, "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const { firstName, roleName } = useProfile();

  return (
    <>
      {/* Tampilkan Loading saat ambil data ATAU saat proses update */}
      <Loading show={isFetching || isUpdating} message={isFetching ? "Memuat data menu..." : "Menyimpan perubahan..."} />

      <div className="pt-16 lg:pt-7 lg:pl-8 lg:pr-6 mx-4 lg:mx-0 shrink-0 z-10">
        <DashboardHeader
          title="Manajemen Menu & Stok"
          subtitle="Kelola daftar menu serta ketersediaan stok"
          userName={firstName}
          roleName={roleName}
        />
      </div>

      <div className="flex-1 px-4 lg:px-8 pb-6 lg:pb-10 pt-2 lg:pt-2">
        <FormMenuLayout title="Edit Menu" onBack={() => navigate(-1)}>
          
          <form onSubmit={handleSubmit(onTriggerSave)} className="flex flex-col lg:flex-row gap-0 lg:gap-6 mt-1">
            
            <div className="w-full lg:w-[320px] shrink-0">
              <FormMenuImage 
                previewUrl={previewImage} 
                onChange={handleImageChange} 
                readonly={false}
                error={errors.image?.message as string} 
              />
            </div>

            <FormMenuInput 
              register={register}
              errors={errors}
              onCancel={() => navigate(-1)}
              isDetailMode={false} 
            />

          </form>

        </FormMenuLayout>
      </div>

      {/* MODAL KONFIRMASI */}
      <MenuActionModal 
        isOpen={isSaveModalOpen}
        type="save"
        onClose={() => setIsSaveModalOpen(false)}
        onConfirm={handleSaveConfirm}
      />
      <Toast show={toast.show} message={toast.message} type={toast.type} />
    </>
  );
};

export default CashierEditMenuPage;