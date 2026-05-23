import { useState } from "react";

export type PaymentStatus = "PAYING" | "PENDING" | "CONFIRMED";

export const useOrderPayment = (
  orderId: string, 
  subTotal: number, 
  taxAmount: number, 
  discountAmount: number
) => {
  const [status] = useState<PaymentStatus>("PAYING");

  // Ekstrak 3 digit terakhir dari orderId backend sebagai kode unik / biaya admin
  // Contoh: ID "260522002" -> "002" -> akan jadi angka 2
  const adminFee = orderId && orderId !== "UNKNOWN" 
    ? parseInt(orderId.slice(-3), 10) || 0 
    : 0;

  // Total Akhir = (Subtotal + PPN - Diskon) + Biaya Admin Unik
  const grandTotal = subTotal + taxAmount - discountAmount;
  const finalPayment = grandTotal + adminFee;

  return {
    status,
    adminFee,
    finalPayment,
  };
};