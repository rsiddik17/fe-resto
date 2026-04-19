import { useState } from "react";
import { X } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import NotesIcon from "../Icon/NotesIcon";

interface EditNoteModalProps {
  initialNote: string;
  onClose: () => void;
  onSave: (newNote: string) => void;
}

const EditNoteModal = ({ initialNote, onClose, onSave }: EditNoteModalProps) => {
  const [note, setNote] = useState(initialNote);

  return (
    <div 
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/1 backdrop-blur-[3px] p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-162.5 h-67.5 rounded-sm p-6 shadow-sm animate-in zoom-in-95 duration-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Tombol X (Close) */}
        <Button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray bg-gray/20 rounded-full p-1"
        >
          <X size={24}  strokeWidth={4}/>
        </Button>

        <h2 className="text-3xl font-extrabold mb-8">
          Edit Catatan
        </h2>

        <div className="relative mb-12">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <NotesIcon className="text-gray-400" />
          </div>

          <Input
            type="text"
            placeholder="Tidak ada catatan"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full pl-10 pr-4 py-4 bg-gray/15 border-transparent focus:bg-white focus:border-primary font-medium rounded-sm placeholder:text-gray"
            autoFocus
          />
        </div>

        <div className="flex gap-3 justify-end translate-y-4">
          <Button 
            onClick={onClose}
            variant="outline" 
            className="w-30 py-1.5 font-medium"
          >
            Batal
          </Button>
          
          <Button 
            onClick={() => onSave(note)}
            className="w-30 py-1.5 font-medium"
          >
            Simpan
          </Button>
        </div>

      </div>
    </div>
  );
};

export default EditNoteModal;