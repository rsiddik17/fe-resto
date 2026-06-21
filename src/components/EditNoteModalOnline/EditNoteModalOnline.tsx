import { useState } from "react";
import { X, FileText } from "lucide-react";

interface EditNoteModalProps {
  item: any;
  onClose: () => void;
  onSave: (note: string) => void;
}

const EditNoteModalOnline = ({ item, onClose, onSave }: EditNoteModalProps) => {
  const [note, setNote] = useState(item.notes || "");

  return (
    <div 
      className="fixed inset-0 z-150 flex items-center justify-center bg-black/10 backdrop-blur-[2px] p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-[90%] md:max-w-105 rounded-xs shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 pt-6 pb-4">
          <h2 className="text-[22px] font-bold text-black tracking-tight">
            Edit Catatan
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-black transition-colors"
          >
            <div className="bg-gray-100 rounded-full p-1.5">
              <X size={12} strokeWidth={4} />
            </div>
          </button>
        </div>
        
        <div className="px-6 pb-8">
          {/* Input - seperti kiosk: border 2px primary, bg putih */}
          <div className="relative mb-8">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black/50">
              <FileText size={16} />
            </div>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Tidak ada catatan"
              className="w-full pl-11 pr-4 py-2.5 bg-white hover:bg-black/5 text-black border-2 border-primary/75 focus:bg-white focus:border-primary focus:border-[1.5px] font-medium rounded-sm placeholder:text-gray text-sm"
              autoFocus
            />
          </div>

          {/* Tombol - seperti kiosk */}
          <div className="flex gap-3 justify-end">
            <button 
              onClick={onClose} 
              className="w-24 py-1.5 text-sm font-semibold border border-primary rounded-xs hover:bg-black/5 transition-colors"
            >
              Batal
            </button>
            <button 
              onClick={() => onSave(note)} 
              className="w-24 py-1.5 text-sm font-semibold bg-primary text-white rounded-xs hover:bg-primary/90 transition-colors"
            >
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditNoteModalOnline;