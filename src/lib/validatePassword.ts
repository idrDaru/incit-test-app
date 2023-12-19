export default function validatePassword(password: string): boolean {
  const hasLow = /[a-z]/g.test(password);
  const hasUpper = /[A-Z]/g.test(password);
  const hasDigit = /[0-9]/g.test(password);
  const hasSpecial = /[@#$%^&*()<>?/\|}{~`]/g.test(password);
  const isLongEnough = password.length >= 8;

  if (hasLow && hasDigit && hasSpecial && hasUpper && isLongEnough) return true;
  return false;
}

export function validateConfirmPassword(
  password: string,
  confirmPassword: string
): boolean {
  if (password !== confirmPassword) return false;
  return true;
}
