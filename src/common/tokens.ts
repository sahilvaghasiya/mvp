export const otpString = (n: number): string => {
  const digits =
    '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefgehijklmnopqrstuvwxyz';
  let otpString = '';

  for (let i = 0; i < n; i++) {
    otpString += digits[Math.floor(Math.random() * digits.length)];
  }
  return otpString;
};
