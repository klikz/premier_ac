"use client"

import { Link, useLocation } from "react-router-dom"
import {
  ChevronDown,
  LogOut,
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
}

type NavGroup = {
  label: string
  items: NavLink[]
}

const navGroups: NavGroup[] = [
  {
    label: "Admin",
    items: [{ title: "Users", href: "/users" }],
  },
  {
    label: "Lines",
    items: [
      { title: "T1", href: "/t1", },
      { title: "T2", href: "/t2", },
      { title: "T3", href: "/t3", },
      { title: "I1", href: "/i1", },
      { title: "Dashboard", href: "/dashboard", },
    ],
  },
  {
    label: "Texnolog",
    items: [
      { title: "Models", href: "/models" },
      { title: "GS Code", href: "/gscode" },
      { title: "Printers", href: "/printers" },
      { title: "Re Print", href: "/reprint" },
      { title: "Report", href: "/report" },
      { title: "Reja", href: "/reja" },
    ],
  },
]

export function NavigationMenuAC() {
  const login = Global_Data.getLogin()
  const location = useLocation()

  return (
    <header className="sticky top-0 w-full">
      <nav
        className={cn(
          "mx-auto flex w-full max-w-6xl items-center gap-2",
          "rounded-2xl border border-black/5 bg-white/70 shadow-lg shadow-black/5 backdrop-blur-xl",
          "dark:border-white/10 dark:bg-zinc-900/70 dark:shadow-black/40"
        )}
      >
        {/* Menu groups — always on a single line; scrolls horizontally on small screens */}
        <div 
        className="flex min-w-0 flex-1 [scrollbar-width:none] items-center gap-1 overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden"
        style={{marginBottom: 10}}
        >
          
          {navGroups.map((group) => {
            const isActiveGroup = group.items.some(
              (item) => item.href === location.pathname
            )
            return (
              <DropdownMenu key={group.label}>
                <DropdownMenuTrigger
                  className={cn(
                    "group inline-flex shrink-0 items-center gap-2 rounded-xl text-sm font-medium transition-all duration-200 outline-none",
                    "hover:bg-black/[0.06] focus-visible:ring-2 focus-visible:ring-emerald-500/50 dark:hover:bg-white/10",
                    "data-[state=open]:bg-black/[0.08] dark:data-[state=open]:bg-white/15",
                    isActiveGroup
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-zinc-700 dark:text-zinc-200"
                  )}
                >
                  <span>{group.label}</span>
                  <ChevronDown style={{marginRight: 10}} className="size-3.5 shrink-0 opacity-60 transition-transform duration-200 group-data-[state=open]:rotate-180" />
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
                          style={{padding: 5}}
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
            "inline-flex shrink-0 items-center gap-2 rounded-xl border border-black/5 text-sm font-medium text-zinc-700 transition-all duration-200 outline-none",
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
