import Button from "../ui/Button";

interface PaymentSummaryCardProps {
  totalAmount: number;
  taxAmount: number;
  adminAmount: number;
  grandTotal: number;
  isModified: boolean;
  rupiahFormatter: (val: number) => string;
  onCancelClick: () => void;
  onSaveClick: () => void;
}

const PaymentSummaryCard = ({
  totalAmount,
  taxAmount,
  adminAmount,
  grandTotal,
  isModified,
  rupiahFormatter,
  onCancelClick,
  onSaveClick,
}: PaymentSummaryCardProps) => {
  return (
    <div className="w-full lg:w-[33%] flex flex-col justify-between h-full lg:min-h-screen">
      <div className="bg-white border-[1.5px] border-primary/20 rounded-md shadow overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-primary/20 bg-primary/25">
          <h3 className="text-primary text-[15px] md:text-[16px] font-medium">
            Ringkasan Pembayaran
          </h3>
        </div>

        {/* Content */}
        <div className="px-4 py-3 bg-primary/10">
          <div className="flex flex-col gap-2 text-[14px] md:text-[15px] text-black">
            <div className="flex justify-between items-center">
              <span>Total Pesanan</span>
              <span className="font-medium">
                {rupiahFormatter(totalAmount)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span>PPN 10%</span>
              <span className="font-medium">{rupiahFormatter(taxAmount)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span>Biaya Admin</span>
              <span className="font-medium">
                {rupiahFormatter(adminAmount)}
              </span>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center mt-4 pt-3 border-t border-primary/50">
            <span className="font-bold text-[15.5px] text-black">
              Total Pembayaran
            </span>

            <span className="font-bold text-[15.5px] text-black">
              {rupiahFormatter(grandTotal)}
            </span>
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex items-center justify-end gap-3 mt-8 lg:mt-auto">
        <Button
          onClick={onCancelClick}
          className="flex-[0.5] md:flex-none px-6 md:px-8 py-2.5 md:py-3 bg-[#FFFFFF] hover:bg-black/5 text-black border-[1.5px] border-gray/50 shadow-none font-bold text-sm md:text-sm lg:text-sm"
        >
          Batal
        </Button>
        <Button
          onClick={onSaveClick}
          disabled={!isModified}
          className="flex-1 md:flex-none px-4 md:px-4 py-2.5 md:py-3 font-bold text-sm md:text-sm lg:text-sm disabled:cursor-not-allowed cursor-pointer"
        >
          Simpan Perubahan
        </Button>
      </div>
    </div>
  );
};

export default PaymentSummaryCard;
