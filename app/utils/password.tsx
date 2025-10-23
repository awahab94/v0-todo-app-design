interface PasswordRequirementsProps {
  password: string;
  currentPassword?: string;
  showDifferentFromCurrent?: boolean;
}

// Shared password validation rules
export const passwordValidation = {
  minLength: 8,
  hasUppercase: (value: string) => /[A-Z]/.test(value),
  hasLowercase: (value: string) => /[a-z]/.test(value),
  hasNumber: (value: string) => /\d/.test(value),
  hasSpecialChar: (value: string) => /[!@#$%^&*()_+\-=\[\]{};':'\\|,.<>\/?]/.test(value),
};

// Validation function for react-hook-form
export const validatePassword = (value: string, currentPassword?: string) => {
  if (!value) return "Password is required";

  const errors: string[] = [];

  if (value.length < passwordValidation.minLength) {
    errors.push("at least 8 characters");
  }
  if (!passwordValidation.hasUppercase(value)) {
    errors.push("one uppercase letter");
  }
  if (!passwordValidation.hasLowercase(value)) {
    errors.push("one lowercase letter");
  }
  if (!passwordValidation.hasNumber(value)) {
    errors.push("one number");
  }
  if (!passwordValidation.hasSpecialChar(value)) {
    errors.push("one special character");
  }
  if (currentPassword && value === currentPassword) {
    errors.push("must be different from current password");
  }

  if (errors.length > 0) {
    return `Password must contain: ${errors.join(", ")}`;
  }

  return true;
};

export const PasswordRequirements = ({ password, currentPassword, showDifferentFromCurrent = false }: PasswordRequirementsProps) => {
  if (!password) return null;

  // Check if all requirements are met
  const allRequirementsMet =
    password.length >= passwordValidation.minLength &&
    passwordValidation.hasUppercase(password) &&
    passwordValidation.hasLowercase(password) &&
    passwordValidation.hasNumber(password) &&
    passwordValidation.hasSpecialChar(password) &&
    (!showDifferentFromCurrent || !currentPassword || password !== currentPassword);

  // Hide the UI if all requirements are met
  if (allRequirementsMet) return null;

  return (
    <div className="space-y-1 text-xs">
      <ul className="list-inside list-none space-y-1">
        {password.length < passwordValidation.minLength ? <li className="text-destructive">✕ at least 8 characters</li> : <li className="text-emerald-700">✓ at least 8 characters</li>}
        {!passwordValidation.hasUppercase(password) ? <li className="text-destructive">✕ uppercase</li> : <li className="text-emerald-700">✓ uppercase</li>}
        {!passwordValidation.hasLowercase(password) ? <li className="text-destructive">✕ lowercase</li> : <li className="text-emerald-700">✓ lowercase</li>}
        {!passwordValidation.hasNumber(password) ? <li className="text-destructive">✕ number</li> : <li className="text-emerald-700">✓ number</li>}
        {!passwordValidation.hasSpecialChar(password) ? <li className="text-destructive">✕ special character</li> : <li className="text-emerald-700">✓ special character</li>}
        {showDifferentFromCurrent &&
          (currentPassword && password === currentPassword ? (
            <li className="text-destructive">✕ different from current password</li>
          ) : currentPassword ? (
            <li className="text-primary">✓ different from current password</li>
          ) : null)}
      </ul>
    </div>
  );
};
