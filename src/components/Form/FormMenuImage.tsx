import { Upload } from "lucide-react";

interface MenuImagePickerProps {
  previewUrl: string | null;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readonly?: boolean;
  error?: string; // Tambahan untuk Zod Error
}

const FormMenuImage = ({ previewUrl, onChange, readonly = false, error }: MenuImagePickerProps) => {
  return (
    <div className="flex flex-col w-full h-full">
      <h3 className="text-sm text-black mb-2">Foto Menu</h3>
      
      <label className={`relative flex flex-col items-center justify-center w-full aspect-square md:aspect-auto md:h-80 rounded-sm overflow-hidden border transition-colors ${readonly ? 'cursor-default bg-gray-100 border-transparent' : 'cursor-pointer bg-[#D9D9D9] hover:bg-[#D9D9D9]/80'} ${error ? 'border-red-500' : 'border-transparent'}`}>
        
        {!readonly && (
          <input 
            type="file" 
            className="hidden" 
            accept="image/png, image/jpeg, .jpg"
            onChange={onChange}
          />
        )}
        
        {previewUrl ? (
          <img src={previewUrl} alt="Preview Menu" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center text-center px-4">
            <Upload size={36} className="text-black -translate-y-3" strokeWidth={2.5} />
            <span className="text-sm text-black mb-1">Unggah Foto</span>
            <span className="text-sm text-black/50 px-2">Format JPG atau PNG resolusi 2 - 5mb</span>
          </div>
        )}
      </label>
      {/* Tampilkan pesan error jika ada */}
      {error && <span className="text-red-500 text-[12px] mt-1.5 font-medium">{error}</span>}
    </div>
  );
};

export default FormMenuImage;