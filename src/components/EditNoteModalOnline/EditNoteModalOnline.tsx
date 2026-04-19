import { useState } from "react";
import Button from "../ui/Button";
import { X, FileText } from "lucide-react";


interface EditNoteModalProps {
  item: any;
  onClose: () => void;
  onSave: (note: string) => void;
}

const EditNoteModalOnline = ({ item, onClose, onSave }: EditNoteModalProps) => {
  const [note, setNote] = useState(item.notes || "");

  return (
    // Overlay menggunakan bg-black/40 dan blur tipis agar fokus ke modal
    <div className="fixed inset-0 z-150 flex items-center justify-center bg-black/10 backdrop-blur-[2px] p-4">
      {/* Lebar modal dinaikkan ke 420px agar lebih proporsional seperti desain */}
      <div className="bg-white w-full max-w-105 rounded-xs shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 pt-6 pb-4">
          <h2 className="text-[22px] font-bold text-black tracking-tight">Edit Catatan</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors">
            <div className="bg-gray-100 rounded-full p-1.5">
              <X size={12} strokeWidth={4} />
            </div>
          </button>
        </div>
        
        <div className="px-6 pb-8">
          {/* Container Input */}
          <div className="relative mb-8">
            {/* Icon dengan jarak (left-4) */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 ">
              <FileText size={16} />
            </div>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Tidak ada"
              className="w-full pl-11 pr-4 py-2 bg-[#F3F4F6] rounded-xs outline-none border-2 border-transparent focus:border-primary transition-all text-gray-500 text-sm"
              autoFocus
            />
          </div>

          {/* Tombol dengan style yang lebih "clean" */}
          <div className="flex justify-end gap-3 ">
            <Button 
              variant="secondary" 
              onClick={onClose} 
              className="px-7 py-2 bg-white border-[1.5px] border-primary text-primary hover:bg-primary/5 rounded-xs font-bold text-sm h-auto"
            >
              Batal
            </Button>
            <Button 
              onClick={() => onSave(note)} 
              className="px-7 py-2 rounded-xs font-bold text-sm shadow-lg shadow-primary/20 h-auto"
            >
              Simpan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditNoteModalOnline;