"use client";

import { Check, X } from "lucide-react";

interface PasswordValidation {
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

interface PasswordValidatorProps {
  password: string;
}

export function PasswordValidator({ password }: PasswordValidatorProps) {
  const validation: PasswordValidation = {
    hasMinLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  const isValid = validation.hasMinLength && validation.hasUppercase && validation.hasLowercase && validation.hasNumber && validation.hasSpecialChar;

  const requirements = [
    { label: "At least 8 characters", passed: validation.hasMinLength },
    { label: "Uppercase letter (A-Z)", passed: validation.hasUppercase },
    { label: "Lowercase letter (a-z)", passed: validation.hasLowercase },
    { label: "Number (0-9)", passed: validation.hasNumber },
    { label: "Special character (!@#$%...)", passed: validation.hasSpecialChar },
  ];

  if (!password) return null;

  return (
    <div className="mt-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
      <div className="space-y-2">
        {requirements.map((req) => (
          <div key={req.label} className="flex items-center gap-2 text-sm">
            {req.passed ? <Check className="h-4 w-4 text-green-600 flex-shrink-0" /> : <X className="h-4 w-4 text-neutral-300 flex-shrink-0" />}
            <span className={req.passed ? "text-green-600 font-medium" : "text-neutral-400"}>{req.label}</span>
          </div>
        ))}
      </div>
      {isValid && (
        <div className="mt-3 p-2 bg-green-50 rounded-lg border border-green-200">
          <p className="text-xs font-bold text-green-700">✓ Password is strong</p>
        </div>
      )}
    </div>
  );
}
