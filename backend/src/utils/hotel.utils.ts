export class HotelUtils {
  static generateFlexibilityWindows(baseCheckIn: Date, baseCheckOut: Date, flexibility: number): { in: Date, out: Date }[] {
    const durationDays = Math.ceil((baseCheckOut.getTime() - baseCheckIn.getTime()) / (1000 * 3600 * 24));
    const windows: { in: Date, out: Date }[] = [{ in: baseCheckIn, out: baseCheckOut }];
    
    if (flexibility > 0) {
      for (let offset = 1; offset <= flexibility; offset++) {
        // Window -offset
        const winInMinus = new Date(baseCheckIn);
        winInMinus.setDate(winInMinus.getDate() - offset);
        const winOutMinus = new Date(winInMinus);
        winOutMinus.setDate(winOutMinus.getDate() + durationDays);
        windows.push({ in: winInMinus, out: winOutMinus });

        // Window +offset
        const winInPlus = new Date(baseCheckIn);
        winInPlus.setDate(winInPlus.getDate() + offset);
        const winOutPlus = new Date(winInPlus);
        winOutPlus.setDate(winOutPlus.getDate() + durationDays);
        windows.push({ in: winInPlus, out: winOutPlus });
      }
    }
    return windows;
  }
}
