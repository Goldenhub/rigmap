"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  id: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  showValidation?: boolean;
  onPasswordChange?: (password: string) => void;
}

export function PasswordInput({ id, name, placeholder, required = true, showValidation = false, onPasswordChange }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input id={id} name={name} type={showPassword ? "text" : "password"} required={required} onChange={(e) => onPasswordChange?.(e.target.value)} className="flex h-12 w-full rounded-xl border border-neutral-200 bg-white px-4 py-2 pr-12 text-sm text-neutral-900 font-medium focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all" placeholder={placeholder} />
      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors" tabIndex={-1}>
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}
