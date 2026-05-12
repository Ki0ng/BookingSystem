/**
 * Centralized validation logic for the Elite Booking System frontend.
 */

export const validators = {
  /**
   * Validates if the string is a valid email address.
   */
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validates if the string is a valid phone number (basic check for 10-11 digits).
   */
  isValidPhone: (phone: string): boolean => {
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone);
  },

  /**
   * Validates if the name is at least 2 characters long and not just whitespace.
   */
  isValidName: (name: string): boolean => {
    return name.trim().length >= 2;
  },

  /**
   * Validates password strength (minimum 6 characters).
   */
  isValidPassword: (password: string): boolean => {
    return password.length >= 6;
  }
};

export const validationMessages = {
  invalidEmail: 'Please enter a valid email address.',
  invalidPhone: 'Phone number must be between 10 and 11 digits.',
  invalidName: 'Name must be at least 2 characters long.',
  invalidPassword: 'Password must be at least 6 characters long.',
  required: 'This field is required.'
};
