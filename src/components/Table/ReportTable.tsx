interface Column {
  header: string;
  accessor: string;
  isCurrency?: boolean; // Penanda kalau kolom ini butuh format Rupiah
}

interface ReportTableProps {
  title: string;
  columns: Column[];
  data: any[];
}

const formatRupiah = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const ReportTable = ({ title, columns, data }: ReportTableProps) => {
  return (
    <div className="mb-6">
      {/* Judul Tabel */}
      <h3 className="text-[22px] font-bold mb-3">{title}</h3>
      
      {/* Container Tabel */}
      <div className="bg-white rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-175">
            <thead className="bg-[#D9D9D9] text-black/50">
              <tr>
                {columns.map((col, idx) => (
                  <th key={idx} className="py-2.5 px-8 text-sm font-bold uppercase tracking-wider">
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-[13.5px] text-black">
              {data.length > 0 ? (
                data.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b-[1.5px] border-[#DEDED9] hover:bg-gray-50 transition-colors">
                    {columns.map((col, colIndex) => (
                      <td key={colIndex} className="py-4 px-8">
                        {col.isCurrency ? formatRupiah(row[col.accessor]) : row[col.accessor]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="text-center py-8 text-gray-400">
                    Tidak ada data laporan ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportTable;