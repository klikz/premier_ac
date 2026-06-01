"use client"

import * as React from "react"
import { Link, useLocation } from "react-router-dom"
import {
  BarChart3,
  Boxes,
  CalendarRange,
  ChevronDown,
  Cpu,
  FactoryIcon,
  FileText,
  LayoutDashboard,
  LogOut,
  Printer,
  QrCode,
  RefreshCcw,
  Shield,
  Users,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { Global_Data } from "@/config/config"

type NavLink = {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

type NavGroup = {
  label: string
  icon: React.ComponentType<{ className?: string }>
  items: NavLink[]
}

const navGroups: NavGroup[] = [
  {
    label: "Admin",
    icon: Shield,
    items: [{ title: "Users", href: "/users", icon: Users }],
  },
  {
    label: "Lines",
    icon: FactoryIcon,
    items: [
      { title: "T1", href: "/t1", icon: FileText },
      { title: "T2", href: "/t2", icon: FileText },
      { title: "T3", href: "/t3", icon: FileText },
      { title: "I1", href: "/i1", icon: FileText },
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Texnolog",
    icon: Cpu,
    items: [
      { title: "Models", href: "/models", icon: Boxes },
      { title: "GS Code", href: "/gscode", icon: QrCode },
      { title: "Printers", href: "/printers", icon: Printer },
      { title: "Re Print", href: "/reprint", icon: RefreshCcw },
      { title: "Report", href: "/report", icon: BarChart3 },
      { title: "Reja", href: "/reja", icon: CalendarRange },
    ],
  },
]

export function NavigationMenuAC() {
  const login = Global_Data.getLogin()
  const location = useLocation()

  return (
    <header className="sticky top-0 z-50 w-full px-2 py-2 sm:px-4">
      <nav
        className={cn(
          "mx-auto flex w-full max-w-6xl items-center gap-2",
          "rounded-2xl border border-black/5 bg-white/70 px-2 py-1.5 shadow-lg shadow-black/5 backdrop-blur-xl",
          "dark:border-white/10 dark:bg-zinc-900/70 dark:shadow-black/40"
        )}
      >
        {/* Menu groups — always on a single line; scrolls horizontally on small screens */}
        <div className="flex min-w-0 flex-1 [scrollbar-width:none] items-center gap-1 overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden">
          {navGroups.map((group) => {
            const Icon = group.icon
            const isActiveGroup = group.items.some(
              (item) => item.href === location.pathname
            )
            return (
              <DropdownMenu key={group.label}>
                <DropdownMenuTrigger
                  className={cn(
                    "group inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 outline-none",
                    "hover:bg-black/[0.06] focus-visible:ring-2 focus-visible:ring-emerald-500/50 dark:hover:bg-white/10",
                    "data-[state=open]:bg-black/[0.08] dark:data-[state=open]:bg-white/15",
                    isActiveGroup
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-zinc-700 dark:text-zinc-200"
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  <span>{group.label}</span>
                  <ChevronDown className="size-3.5 shrink-0 opacity-60 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  sideOffset={10}
                  className={cn(
                    "min-w-56 rounded-2xl border border-black/5 bg-white/80 p-1.5 shadow-xl shadow-black/10 backdrop-blur-2xl",
                    "dark:border-white/10 dark:bg-zinc-900/85 dark:shadow-black/50"
                  )}
                >
                  {group.items.map((item) => {
                    const ItemIcon = item.icon
                    const isActive = item.href === location.pathname
                    return (
                      <DropdownMenuItem key={item.href} asChild>
                        <Link
                          to={item.href}
                          className={cn(
                            "group/item relative flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                            "focus:bg-emerald-500/10 focus:text-emerald-700 dark:focus:bg-emerald-400/10 dark:focus:text-emerald-300",
                            isActive
                              ? "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"
                              : "text-zinc-700 dark:text-zinc-200"
                          )}
                        >
                          {/* Windows 11 style selection indicator */}
                          <span
                            className={cn(
                              "absolute top-1/2 left-0 h-5 w-1 -translate-y-1/2 rounded-full bg-emerald-500 transition-all duration-200",
                              isActive
                                ? "opacity-100"
                                : "opacity-0 group-hover/item:opacity-60"
                            )}
                          />
                          <ItemIcon className="size-4 shrink-0 opacity-80" />
                          <span>{item.title}</span>
                        </Link>
                      </DropdownMenuItem>
                    )
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )
          })}
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={async () => {
            localStorage.removeItem("token")
            await Global_Data.clearUserData()
            window.location.href = "/login"
          }}
          className={cn(
            "inline-flex shrink-0 items-center gap-2 rounded-xl border border-black/5 px-3 py-2 text-sm font-medium text-zinc-700 transition-all duration-200 outline-none",
            "hover:bg-black/[0.06] focus-visible:ring-2 focus-visible:ring-emerald-500/50",
            "dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/10"
          )}
        >
          <LogOut className="size-4 shrink-0" />
          {login ? (
            <span className="hidden max-w-32 truncate sm:inline">{login}</span>
          ) : null}
          <span>Logout</span>
        </button>
      </nav>
    </header>
  )
}
