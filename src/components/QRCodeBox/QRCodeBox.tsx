import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";

interface QRCodeBoxProps {
  finalPayment: number;
  onExpire: () => void;
}

const QRCodeBox = ({ finalPayment, onExpire }: QRCodeBoxProps) => {
  const [timeLeft, setTimeLeft] = useState(3600);

  useEffect(() => {
    // Jika waktu habis (0), hentikan timer dan panggil fungsi onExpire
    if (timeLeft <= 0) {
      onExpire();
      return;
    }

    // Kurangi 1 detik setiap 1000 milidetik
    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    // Bersihkan interval saat komponen dibongkar (unmount) mencegah memory leak
    return () => clearInterval(timerId);
  }, [timeLeft, onExpire]);

  // 3. Format waktu menjadi MM:SS
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  const qrisData = `00020101021126670016ID.CO.QRIS.WWW011893600...Nominal:${finalPayment}`;

  return (
    <div className="bg-white rounded-md p-6 flex flex-col items-center shadow-sm text-center">
      <p className="text-gray text-xl mb-2">Total Pembayaran</p>
      <h2 className="text-3xl font-bold text-primary mb-6">
        Rp{finalPayment.toLocaleString("id-ID")}
      </h2>

      <p className="text-xl mb-3">Scan QRIS untuk melakukan pembayaran</p>
      <p className="text-xl mb-6">
        Selesaikan pembayaran dalam <span className="font-bold">{minutes}:{seconds}</span>
      </p>

      {/* RENDER QR CODE DI SINI */}
      <div className="inline-block mb-6">
        <QRCodeSVG value={qrisData} size={400} level="H" />
      </div>

      <p className="text-gray text-lg">
        Scan dengan e-wallet atau mobile banking anda
      </p>
    </div>
  );
};

export default QRCodeBox;
