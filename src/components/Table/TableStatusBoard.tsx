import { cn } from "../../utils/utils";

// Mock Data Meja
const mockTables = [
  { id: "M-01", status: "terisi" },
  { id: "M-02", status: "tersedia" },
  { id: "M-03", status: "kotor" },
  { id: "M-04", status: "terisi" },
  { id: "M-05", status: "kotor" },
  { id: "M-06", status: "terisi" },
  { id: "M-07", status: "terisi" },
  { id: "M-08", status: "terisi" },
  { id: "M-09", status: "tersedia" },
  { id: "M-10", status: "kotor" },
  { id: "M-11", status: "tersedia" },
  { id: "M-12", status: "kotor" },
];

const TableStatusBoard = () => {
  return (
    <div className="bg-white w-full rounded-md shadow-sm border border-secondary p-4 overflow-hidden">
      <h3 className="font-bold text-lg mb-2.5">Status Meja</h3>

      {/* Legend */}
      <div className="flex items-center gap-2 mb-3 text-gray-600">
        <div className="flex items-center gap-1.5 ">
          <div className="w-3 h-3 rounded-full bg-[#D9D9D9]"></div>{" "}
          <p className="text-sm">Kotor</p>
        </div>
        <div className="flex items-center gap-1.5 ">
          <div className="w-3 h-3 rounded-full bg-primary"></div>{" "}
          <p className="text-sm">Terisi</p>
        </div>
        <div className="flex items-center gap-1.5 ">
          <div className="w-3 h-3 rounded-full border-2 border-lime"></div>{" "}
          <p className="text-sm">Tersedia</p>
        </div>
      </div>

      {/* Grid Meja */}
      <div className="grid grid-cols-4 gap-2">
        {mockTables.map((table) => (
          <div
            key={table.id}
            className={cn(
              "aspect-square p-0.5 rounded-sm text-center flex items-center justify-center text-sm",
              table.status === "terisi" && "bg-primary text-white",
              table.status === "kotor" && "bg-[#D9D9D9] text-white",
              table.status === "tersedia" &&
                "bg-white border-2 border-lime text-lime",
            )}
          >
            {table.id}
          </div>
        ))}
        {/* Titik-titik ... di akhir */}
        <div className="flex items-end text-black font-bold pb-1 ml-1 text-sm">...</div>
      </div>
    </div>
  );
};

export default TableStatusBoard;
