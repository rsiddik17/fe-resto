import { useState } from "react";
import { X, FileText } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";

interface EditNoteModalProps {
  initialNote: string;
  onClose: () => void;
  onSave: (newNote: string) => void;
}

const EditNoteModal = ({ initialNote, onClose, onSave }: EditNoteModalProps) => {
  const [note, setNote] = useState(initialNote);

  return (
    <div 
      className="fixed inset-0 z-100 flex items-center justify-center backdrop-blur-[2px] p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-xl rounded-sm p-6 shadow-sm animate-in zoom-in-95 duration-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Tombol X (Close) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray bg-gray/20 rounded-full p-1"
        >
          <X size={18}  strokeWidth={4}/>
        </button>

        <h2 className="text-2xl font-extrabold mb-8">
          Edit Catatan
        </h2>

        <div className="relative mb-12">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FileText className="text-gray-400" size={18} />
          </div>
          <Input
            type="text"
            placeholder="Tidak ada catatan"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-secondary/75 border-transparent focus:bg-white focus:border-primary text-sm rounded-sm"
            autoFocus
          />
        </div>

        <div className="flex gap-3 justify-end">
          <Button 
            onClick={onClose}
            variant="outline" 
            className="w-30 py-1 font-medium"
          >
            Batal
          </Button>
          <Button 
            onClick={() => onSave(note)}
            className="w-30 py-1 font-medium"
          >
            Simpan
          </Button>
        </div>

      </div>
    </div>
  );
};

export default EditNoteModal;