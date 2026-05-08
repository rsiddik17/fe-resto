import { useState, useEffect } from "react";

export type PaymentStatus = "PAYING" | "PENDING" | "CONFIRMED";

export const useOrderPayment = (subTotal: number, taxAmount: number, discountAmount: number) => {
  const [status] = useState<PaymentStatus>("PAYING");
  const [orderId, setOrderId] = useState("");
  const [adminFee, setAdminFee] = useState(0);

  // Generate Order ID & Biaya Admin saat komponen pertama kali dimuat
  useEffect(() => {
    const date = new Date();
    const yy = String(date.getFullYear()).slice(-2); // "26"
    const mm = String(date.getMonth() + 1).padStart(2, "0"); // "04"
    const dd = String(date.getDate()).padStart(2, "0"); // "01"
    
    // MOCKUP: Simulasi counter pesanan hari ini dari database (misal: antrean ke-112)
    const counter = 112; 
    
    const generatedId = `${yy}${mm}${dd}${counter}`;
    setOrderId(generatedId);
    
    // Biaya admin diambil dari 3 digit terakhir (counter)
    setAdminFee(counter); 
  }, []);

  // Total Akhir = (Subtotal + PPN - Diskon) + Biaya Admin Unik
  const grandTotal = subTotal + taxAmount - discountAmount;
  const finalPayment = grandTotal + adminFee;

  return {
    status,
    orderId,
    adminFee,
    finalPayment,
  };
};