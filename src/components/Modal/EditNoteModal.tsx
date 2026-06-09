import { useState } from "react";
import { X } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import NotesIcon from "../Icon/NotesIcon";

interface EditNoteModalProps {
  initialNote: string;
  onClose: () => void;
  onSave: (newNote: string) => void;
  mode?: "create" | "edit";
}

const EditNoteModal = ({ initialNote, onClose, onSave, mode = "edit" }: EditNoteModalProps) => {
  const [note, setNote] = useState(initialNote);

  return (
    <div 
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/3 backdrop-blur-[3px] p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-[90%] md:max-w-162.5 lg:max-w-110 h-auto md:h-67.5 lg:h-auto rounded-sm lg:rounded-xs p-4.5 md:p-6 lg:p-4.5 shadow-sm animate-in zoom-in-95 duration-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Tombol X (Close) */}
        <Button 
          onClick={onClose}
          className="absolute top-3 right-2 md:top-4 md:right-4 lg:top-3 lg:right-3 text-gray bg-gray/20 rounded-full p-1 hover:bg-/gray hover:text-black"
        >
          <X size={24}  strokeWidth={4} className="w-3.5 h-3.5 md:w-6 md:h-6 lg:w-3.5 lg:h-3.5"/>
        </Button>

        <h2 className="text-lg md:text-[28px] lg:text-[19px] font-bold mb-6 md:mb-8 lg:mb-5">
          {mode === "create" ? "Tambah Catatan" : "Edit Catatan"}
        </h2>

        <div className="relative mb-12 lg:mb-14">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <NotesIcon className="text-black/50 w-4 h-4 md:w-5 md:h-5 lg:w-4 lg:h-4" />
          </div>

          <Input
            type="text"
            placeholder="Tidak ada catatan"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full pl-9 md:pl-10 lg:pl-9 pr-4 py-2.5 md:py-4 lg:py-2.5 text-sm md:text-base lg:text-sm bg-[#FFFFFF] hover:bg-black/5 text-black border-2 border-primary/75 focus:bg-white focus:border-primary focus:border-[1.5px] font-medium rounded-sm placeholder:text-gray"
            autoFocus
          />
        </div>

        <div className="flex gap-8 md:gap-3 justify-end translate-y-0 md:translate-y-3.5 lg:translate-y-0">
          <Button 
            onClick={onClose}
            variant="outline" 
            className="w-30 lg:w-24 py-1.5 text-sm md:text-base lg:text-sm font-semibold"
          >
            Batal
          </Button>
          
          <Button 
            onClick={() => onSave(note)}
            className="w-30 lg:w-24 py-1.5 md:py-2 lg:py-1.75 text-sm md:text-base lg:text-sm font-semibold"
          >
            Simpan
          </Button>
        </div>

      </div>
    </div>
  );
};

export default EditNoteModal;