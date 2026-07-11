"use client";

import Link from "next/link";
import { useActionState } from "react";

import { signInAction, signUpAction } from "@/app/actions/auth";
import {
  FormError,
  inputClass,
  labelClass,
  SubmitButton,
} from "@/components/app/ui";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const action = mode === "login" ? signInAction : signUpAction;
  const [state, formAction] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-5">
      <FormError error={state.error} />

      {mode === "signup" ? (
        <div>
          <label htmlFor="name" className={labelClass}>
            Your name
          </label>
          <input
            id="name"
            name="name"
            required
            autoComplete="name"
            placeholder="Ayesha Khan"
            className={inputClass}
          />
        </div>
      ) : null}

      <div>
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@brand.pk"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="password" className={labelClass}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={mode === "signup" ? 8 : undefined}
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          placeholder="••••••••"
          className={inputClass}
        />
      </div>

      <SubmitButton className="w-full" pendingLabel="One moment…">
        {mode === "login" ? "Sign in" : "Create account"}
      </SubmitButton>

      <p className="text-center text-sm text-muted">
        {mode === "login" ? (
          <>
            New to Mehfil?{" "}
            <Link href="/signup" className="font-medium text-rani hover:underline">
              Create an account
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-rani hover:underline">
              Sign in
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
