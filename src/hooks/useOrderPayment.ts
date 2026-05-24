import { useState } from "react";

export type PaymentStatus = "PAYING" | "PENDING" | "CONFIRMED";

export const useOrderPayment = (
  orderId: string,
  subTotal: number,
  discountAmount: number,
  taxRate: number = 10,
) => {
  const [status] = useState<PaymentStatus>("PAYING");

  const adminFee =
    orderId && orderId !== "UNKNOWN"
      ? parseInt(orderId.replace("#", "").slice(-3), 10) || 0
      : 0;

  const discountedSubtotal = Math.max(
    0,
    subTotal - discountAmount,
  );

  const taxAmount =
    discountedSubtotal * (taxRate / 100);

  const finalPayment =
    discountedSubtotal +
    taxAmount +
    adminFee;

  return {
    status,
    adminFee,
    taxAmount,
    discountedSubtotal,
    finalPayment,
  };
};