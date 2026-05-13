export class BookingUtils {
  static calculateTotalPrice(basePrice: number, checkIn: Date, checkOut: Date): number {
    const days = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24));
    return basePrice * Math.max(days, 1);
  }
}
