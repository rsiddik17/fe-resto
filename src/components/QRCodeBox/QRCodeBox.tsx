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
    <div className="bg-white rounded-md px-2.5 py-4 md:p-6 flex flex-col items-center shadow-sm text-center">
      <p className="text-gray text-[15px] md:text-2xl lg:text-xl mb-1 md:mb-2.5">Total Pembayaran</p>
      <h2 className="text-base md:text-3xl lg:text-2xl font-bold text-primary mb-4 md:mb-7">
        Rp{finalPayment.toLocaleString("id-ID")}
      </h2>

      <p className="text-[13px] md:text-[22px] lg:text-lg mb-1 md:mb-6">Scan QRIS untuk melakukan pembayaran</p>
      <p className="text-[13px] md:text-[22px] lg:text-lg mb-3 md:mb-6">
        Selesaikan pembayaran dalam <span className="font-bold">{minutes}:{seconds}</span>
      </p>

      {/* RENDER QR CODE DI SINI */}
      <div className="inline-block mb-4 md:mb-6 w-38 h-38 md:w-75 md:h-75 lg:w-60 lg:h-60">
        <QRCodeSVG value={qrisData} className="w-full h-full" level="L" />
      </div>

      <p className="text-gray text-[13px] md:text-[22px] lg:text-lg">
        Scan dengan e-wallet atau mobile banking anda
      </p>
    </div>
  );
};

export default QRCodeBox;
