"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { FaLinkedinIn } from "react-icons/fa";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { authService } from "@/service/authService";
import { useAuth } from "@/context/AuthContext";
import { registerSchema } from "@/lib/validations/authSchema";
import { extractErrorMessage } from "@/utils/extractErrorMessage";
import { LoginResponse } from "@/types/Auth";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    username?: string;
    password?: string;
  }>({});

  const registerMutation = useMutation({
    mutationFn: (data: { email: string; username: string; password: string }) =>
      authService().register(data),
    onSuccess: (data: LoginResponse) => {
      login(data);
      toast.success("Account created!");
      router.replace("/linkedin-autopilot");
    },
    onError: (error: unknown) => {
      toast.error(extractErrorMessage(error));
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = registerSchema.safeParse({ email, username, password });
    if (!result.success) {
      const errs = result.error.flatten().fieldErrors;
      setFieldErrors({
        email: errs.email?.[0],
        username: errs.username?.[0],
        password: errs.password?.[0],
      });
      return;
    }
    setFieldErrors({});
    registerMutation.mutate(result.data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#E9ECF5] px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-400 shadow-sm">
            <span className="text-xl font-bold text-white">R</span>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900">Create your account</h1>
            <p className="mt-1 text-sm text-gray-500">Get started with Relay</p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white px-8 py-8 shadow-sm ring-1 ring-gray-200">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
              {fieldErrors.email && (
                <p className="mt-1.5 text-xs text-red-500">{fieldErrors.email}</p>
              )}
            </div>

            {/* Username */}
            <div>
              <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                placeholder="yourname"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
              {fieldErrors.username && (
                <p className="mt-1.5 text-xs text-red-500">{fieldErrors.username}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <LuEyeOff className="h-4 w-4" /> : <LuEye className="h-4 w-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1.5 text-xs text-red-500">{fieldErrors.password}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {registerMutation.isPending ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-gray-400">
          <FaLinkedinIn className="h-3 w-3" />
          Powered by LinkedIn Autopilot
        </p>
      </div>
    </div>
  );
}
