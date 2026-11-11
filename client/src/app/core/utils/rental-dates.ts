export interface RentalDateValidation {
  valid: boolean;
  message?: string;
}

export function validateSearchDates(pickup: string, returnDate: string): RentalDateValidation {
  if (!pickup || !returnDate) {
    return { valid: true };
  }
  return validateRentalDates(pickup, returnDate);
}

export function validateRentalDates(pickup: string, returnDate: string): RentalDateValidation {
  if (!pickup || !returnDate) {
    return { valid: false, message: 'Pickup and return dates are required.' };
  }
  const today = startOfDay(new Date());
  const pickupDay = parseIsoDate(pickup);
  const returnDay = parseIsoDate(returnDate);
  if (pickupDay < today) {
    return { valid: false, message: 'Pickup date cannot be in the past.' };
  }
  if (returnDay <= pickupDay) {
    return { valid: false, message: 'Return date must be after pickup date.' };
  }
  return { valid: true };
}

export function parseIsoDate(isoDate: string): Date {
  const [y, m, d] = isoDate.split('-').map(Number);
  return startOfDay(new Date(y, m - 1, d));
}

function startOfDay(d: Date): Date {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}
