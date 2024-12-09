import { useState } from "react";

export default function App() {
  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold">Password Strength Checker</h1>
      <PasswordChecker />
    </div>
  );
}

function PasswordChecker() {
  const [password, setPassword] = useState("");
  const strength = evaluatePasswordStrength(password);

  return (
    <div className="max-w-md">
      <PasswordInput value={password} onChange={setPassword} />
      <StrengthIndicator strength={strength} />
      <RequirementsList password={password} />
    </div>
  );
}

function PasswordInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      type="password"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded border p-2"
      placeholder="Enter password"
    />
  );
}

function StrengthIndicator({ strength }: { strength: PasswordStrength }) {
  const colors = {
    weak: "bg-red-500",
    medium: "bg-yellow-500",
    strong: "bg-green-500",
  };

  return (
    <div className="mt-2">
      <div className="h-2 w-full rounded bg-gray-200">
        <div
          className={`h-full rounded transition-all duration-300 ${colors[strength]}`}
          style={{ width: getStrengthPercentage(strength) }}
        />
      </div>
      <p className="mt-1 text-sm capitalize">{strength} password</p>
    </div>
  );
}

function RequirementsList({ password }: { password: string }) {
  const requirements = [
    {
      label: "At least 8 characters",
      met: hasMinimumLength(password),
    },
    {
      label: "Contains numbers",
      met: hasNumbers(password),
    },
    {
      label: "Contains specail characters",
      met: hasSpecialCharacters(password),
    },
    {
      label: "Contains uppercase & lowercase",
      met: hasMixedCase(password),
    },
  ];

  return (
    <ul className="mt-4 space-y-1">
      {requirements.map(({ label, met }) => (
        <RequirementItem key={label} label={label} met={met} />
      ))}
    </ul>
  );
}

function RequirementItem({ label, met }: { label: string; met: boolean }) {
  return (
    <li
      className={`flex items-center gap-2 text-sm ${
        met ? "text-green-600" : "text-gray-500"
      }`}
    >
      {met ? "✓" : "o"} {label}
    </li>
  );
}

// Utility functions - each handling one specific validation
function hasMinimumLength(password: string): boolean {
  return password.length >= 8;
}

function hasNumbers(password: string): boolean {
  return /\d/.test(password);
}

function hasSpecialCharacters(password: string): boolean {
  return /[!@#$%^&*(),.?":{}|<>]/.test(password);
}

function hasMixedCase(password: string): boolean {
  return /[a-z]/.test(password) && /[A-Z]/.test(password);
}

// Types and evaluation functions
type PasswordStrength = "weak" | "medium" | "strong";

function evaluatePasswordStrength(password: string): PasswordStrength {
  const checks = [
    hasMinimumLength(password),
    hasNumbers(password),
    hasSpecialCharacters(password),
    hasMixedCase(password),
  ];

  const passedCheck = checks.filter(Boolean).length;

  if (passedCheck <= 1) return "weak";
  if (passedCheck <= 3) return "medium";
  return "strong";
}

function getStrengthPercentage(strength: PasswordStrength): string {
  const percentages = {
    weak: "33%",
    medium: "66%",
    strong: "100%",
  };

  return percentages[strength];
}
