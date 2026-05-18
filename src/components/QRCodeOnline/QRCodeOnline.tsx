import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";

interface QRCodeOnlineProps {
  finalPayment: number;
  onExpire: () => void;
}

const QRCodeOnline = ({ finalPayment, onExpire }: QRCodeOnlineProps) => {
  const [timeLeft, setTimeLeft] = useState(30);

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

  const qrisData = `00020101021126670016ID.CO.QRIS.WWW011893600...Nominal:${finalPayment}`;

  return (
    <div className="bg-white rounded-xl p-5 flex flex-col items-center shadow-sm text-center border border-gray-100 w-full">
      <p className="text-gray-500 text-lg mb-1">Total Pembayaran</p>
      <h2 className="text-2xl font-bold text-primary mb-6">
        Rp{finalPayment.toLocaleString("id-ID")}
      </h2>

      <p className="text-lg text-black mb-1">Scan QRIS untuk membayar</p>
      <p className="text-lg text-black mb-6">
        Selesaikan dalam <span className="font-bold text-primary">{minutes}:{seconds}</span>
      </p>

      {/* Box QR Code yang Responsif untuk HP */}
      <div className="bg-white p-3 border-2 border-gray-50 rounded-2xl mb-6 shadow-inner">
        <QRCodeSVG 
          value={qrisData} 
          size={200} // Ukuran dasar
          className="w-48 h-48 md:w-52 md:h-52" // Responsif lewat CSS
          level="H" 
        />
      </div>

      <p className="text-gray-400 text-sm leading-relaxed max-w-62.5">
        Gunakan e-wallet atau mobile banking pilihan Anda
      </p>
    </div>
  );
};

export default QRCodeOnline;