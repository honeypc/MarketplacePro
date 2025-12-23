import { Discount } from "@prisma/client";

export function isDiscountActive(discount: Discount, referenceDate = new Date()): boolean {
  return (
    discount.isActive &&
    referenceDate >= discount.startDate &&
    referenceDate <= discount.endDate
  );
}

export function isDiscountApplicable(
  discount: Discount,
  target: { productId?: number; propertyId?: number; tourId?: number }
): boolean {
  if (discount.productId && discount.productId !== target.productId) return false;
  if (discount.propertyId && discount.propertyId !== target.propertyId) return false;
  if (discount.tourId && discount.tourId !== target.tourId) return false;

  // If a discount has an explicit target, previous checks ensure it matches.
  if (discount.productId || discount.propertyId || discount.tourId) {
    return true;
  }

  // Otherwise allow only when a target is provided.
  return Boolean(target.productId || target.propertyId || target.tourId);
}

export function calculateDiscountAmount(baseAmount: number, discount: Discount): number {
  if (baseAmount <= 0) return 0;

  const value = Number(discount.value);
  if (value <= 0) return 0;

  if (discount.discountType === 'percentage') {
    const percentage = value / 100;
    return Math.min(baseAmount, baseAmount * percentage);
  }

  return Math.min(baseAmount, value);
}
