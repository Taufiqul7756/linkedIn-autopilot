"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiBellLine } from "react-icons/ri";
import { LuSun } from "react-icons/lu";
import { FaLinkedinIn } from "react-icons/fa";
import { cn } from "@/utils/cn";

const navLinks = [
  { label: "Leads", href: "/leads" },
  { label: "Campaigns", href: "/campaigns" },
  { label: "Inbox", href: "/inbox" },
  { label: "Analytics", href: "/analytics" },
];

export default function Navbar() {
  const pathname = usePathname();

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

        <button className="hidden items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-50 sm:flex">
          <LuSun className="h-4 w-4" />
          Light
        </button>

        <button className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100">
          <RiBellLine className="h-5 w-5" />
        </button>

        <div className="flex h-8 w-8 select-none items-center justify-center rounded-full bg-violet-100 text-xs font-semibold text-violet-700">
          JR
        </div>
      </div>
    </header>
  );
}
