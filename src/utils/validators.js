export const validators = {
  full_name: (v) => v.trim().length < 2 ? 'Full name too short' : '',
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Invalid email format',
  phone: (v) => /^(\+254|0)[17]\d{8}$/.test(v.trim()) ? '' : 'Invalid phone number',
  password: (v) => {
    if (v.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(v)) return 'Password must contain an uppercase letter';
    if (!/[a-z]/.test(v)) return 'Password must contain a lowercase letter';
    if (!/[0-9]/.test(v)) return 'Password must contain a number';
    if (!/[^A-Za-z0-9]/.test(v)) return 'Password must contain a special character';
    return '';
  },
  role: (v) => ['customer', 'worker'].includes(v) ? '' : 'Please select a role',
  otp: (v) => /^\d{6}$/.test(v) ? '' : 'OTP must be 6 digits',
};

export const validateForm = (fields) => {
  const errors = {};
  for (const [key, value] of Object.entries(fields)) {
    if (validators[key]) {
      const msg = validators[key](value);
      if (msg) errors[key] = msg;
    }
  }
  return errors;
};
