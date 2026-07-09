"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LuLogOut } from "react-icons/lu";
import { FaLinkedinIn } from "react-icons/fa";
import { cn } from "@/utils/cn";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/service/authService";

const navLinks = [
  { label: "Leads", href: "/leads" },
  { label: "Campaigns", href: "/campaigns" },
  { label: "Inbox", href: "/inbox" },
  { label: "Analytics", href: "/analytics" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  if (pathname === "/login") return null;

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : user?.email
      ? user.email.slice(0, 2).toUpperCase()
      : "?";

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await authService().logout();
    } catch {
      // proceed regardless
    } finally {
      logout();
      router.push("/login");
    }
  };

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-gray-200 bg-white px-4 md:gap-8 md:px-6">
      <Link href="/" className="flex shrink-0 items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-400">
          <span className="text-sm font-bold text-white">R</span>
        </div>
        <span className="hidden font-semibold text-gray-900 sm:inline">Relay</span>
      </Link>

      <nav className="hidden items-center gap-6 md:flex">
        {navLinks.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "text-sm font-medium transition-colors",
              pathname === href ? "text-gray-900" : "text-gray-500 hover:text-gray-800"
            )}
          >
            {label}
          </Link>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <Link
          href="/linkedin-autopilot"
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors md:px-3.5",
            pathname === "/linkedin-autopilot"
              ? "bg-blue-600 text-white"
              : "bg-blue-600 text-white hover:bg-blue-700"
          )}
        >
          <FaLinkedinIn className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">LinkedIn Autopilot</span>
        </Link>

        {/* Avatar + logout dropdown */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-8 w-8 select-none items-center justify-center rounded-full bg-violet-100 text-xs font-semibold text-violet-700 transition-colors hover:bg-violet-200"
          >
            {initials}
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full z-30 mt-2 w-44 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
              {(user?.username || user?.email) && (
                <>
                  <div className="px-4 py-2.5">
                    <p className="truncate text-xs font-semibold text-gray-800">
                      {user.username || user.email}
                    </p>
                    {user.username && (
                      <p className="truncate text-xs text-gray-400">{user.email}</p>
                    )}
                  </div>
                  <div className="mx-3 border-t border-gray-100" />
                </>
              )}
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
              >
                <LuLogOut className="h-4 w-4" />
                {loggingOut ? "Signing out…" : "Sign out"}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
