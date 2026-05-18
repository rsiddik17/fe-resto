import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";

interface WaiterQRCodeBoxProps {
  finalPayment: number;
  onExpire: () => void;
}

const WaiterQRCodeBox = ({ finalPayment, onExpire }: WaiterQRCodeBoxProps) => {
  const [timeLeft, setTimeLeft] = useState(3600); // 60 menit

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire();
      return;
    }
    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, onExpire]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  // Format data QRIS sesuai standar
  const qrisData = `00020101021126670016ID.CO.QRIS.WWW011893600...Nominal:${finalPayment}`;

  return (
    <div className="bg-white rounded-md p-6 flex flex-col items-center text-center w-full h-full">
      <p className="text-black/50 text-base mb-1">Total Pembayaran</p>
      
      <h2 className="text-[22px] font-bold text-primary mb-3">
        Rp{finalPayment.toLocaleString("id-ID")}
      </h2>

      <p className="text-base text-black mb-1">Scan QRIS untuk melakukan pembayaran</p>
      <p className="text-[15px] text-black mb-6">
        Selesaikan pembayaran dalam <span className="font-bold">{minutes}:{seconds}</span>
      </p>

      {/* RENDER QR CODE (Ukurannya pas Desktop) */}
      <div className="inline-block mb-6 w-48 h-48">
        <QRCodeSVG value={qrisData} className="w-full h-full" level="L" />
      </div>

      <p className="text-black/50 text-base">
        Scan dengan e-wallet atau mobile banking anda
      </p>
    </div>
  );
};

export default WaiterQRCodeBox;