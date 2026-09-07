"use client";
import { useState } from "react";
import { useLocale } from "./ui";
export function PasswordField() {
  const [visible, setVisible] = useState(false);
  const locale = useLocale();
  const label =
    locale === "fr"
      ? visible
        ? "Masquer le mot de passe"
        : "Afficher le mot de passe"
      : visible
        ? "Hide password"
        : "Show password";
  return (
    <div className="password-field">
      <input
        id="admin-password"
        name="password"
        type={visible ? "text" : "password"}
        autoComplete="current-password"
        required
        maxLength={256}
        spellCheck={false}
        autoCapitalize="none"
      />
      <button
        type="button"
        aria-label={label}
        aria-controls="admin-password"
        aria-pressed={visible}
        onClick={() => setVisible(!visible)}
      >
        <svg
          width="21"
          height="21"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
          <circle cx="12" cy="12" r="3" />
          {visible && <path d="m3 3 18 18" />}
        </svg>
      </button>
    </div>
  );
}
