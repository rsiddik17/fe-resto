import { useNavigate } from "react-router";
import DashboardHeader from "../../components/Header/DashboardHeader";

// Zod & RHF
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// Komponen
import FormMenuImage from "../../components/Form/FormMenuImage";
import FormMenuLayout from "../../layouts/FormMenuLayout/FormMenuLayout";
import FormMenuInput from "../../components/Form/FormMenuInput";
import Loading from "../../components/Loading/Loading";

// API
import { menuAPI } from "../../api/menu.api"; // Sesuaikan path import ini jika berbeda

// 1. BUAT SCHEMA VALIDASI ZOD 
const menuSchema = z.object({
  name: z.string().min(1, "Nama menu wajib diisi!"),
  description: z.string().min(1, "Deskripsi wajib diisi!"),
  category: z.string().min(1, "Kategori wajib dipilih!"),
  price: z.string().min(1, "Harga wajib diisi!"),
  stock: z.string().min(1, "Stok wajib diisi!"),
  image: z.instanceof(File, { message: "Foto menu wajib diunggah!" }), 
});

type MenuFormValues = z.infer<typeof menuSchema>;

const CashierAddMenuPage = () => {
  const navigate = useNavigate();
  
  // 2. SETUP REACT HOOK FORM
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
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

  // Ambil data gambar dari state form (untuk preview)
  const imageFile = watch("image") as File | undefined;
  const previewImage = imageFile instanceof File ? URL.createObjectURL(imageFile) : null;

  // 3. HANDLE GAMBAR
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image", file, { shouldValidate: true });
    }
  };

  // 4. HANDLE SUBMIT (INTEGRASI API)
  const handleSaveMenu = async (data: MenuFormValues) => {
    try {
      // BIKIN FORM DATA KARENA ADA FILE UPLOAD!
      const formData = new FormData();
      
      // Masukkan teks ke dalam FormData
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("category", data.category); // Pastikan valuenya "FOOD" atau "DRINK"
      formData.append("price", data.price); 
      formData.append("stock", data.stock);
      formData.append("image_path", data.image);

      console.log("Mengirim data ke API...");
      
      // Tembak API Add Menu
      await menuAPI.createMenu(formData);

      // Jika berhasil
      alert("Menu baru berhasil ditambahkan!");
      navigate("/cashier/management-menu-stock");
      
    } catch (error: any) {
      console.error("🚨 DETAIL ERROR DARI BACKEND:", error.response?.data);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || "Terjadi kesalahan server backend";
      alert(`Gagal dari Backend: ${errorMsg}`);
    }
  };

  return (
    <>
      <Loading show={isSubmitting} message="Menyimpan menu baru..." />
      <div className="pt-7.5 pl-8 pr-6 shrink-0 z-10">
        <DashboardHeader
          title="Manajemen Menu & Stok"
          subtitle="Kelola daftar menu serta ketersediaan stok"
          userName="Rina"
          roleName="Kasir"
        />
      </div>

      <div className="flex-1 px-8 pb-10 pt-2">
        <FormMenuLayout title="Tambah Menu" onBack={() => navigate(-1)}>
          
          <form onSubmit={handleSubmit(handleSaveMenu)} className="flex flex-col lg:flex-row gap-8 lg:gap-6">
            
            <div className="w-full lg:w-90 shrink-0">
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
    </>
  );
};

export default CashierAddMenuPage;