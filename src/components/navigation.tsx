"use client"

import * as React from "react"
import { Link } from "react-router-dom"

// import { toast } from "sonner"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from "@/components/ui/navigation-menu"
import { Button } from "./ui/button"
import { Global_Data } from "@/config/config"

// const components: { title: string; href: string; description: string }[] = [
//   {
//     title: "Alert Dialog",
//     href: "/docs/primitives/alert-dialog",
//     description:
//       "A modal dialog that interrupts the user with important content and expects a response.",
//   },
//   {
//     title: "Hover Card",
//     href: "/docs/primitives/hover-card",
//     description:
//       "For sighted users to preview content available behind a link.",
//   },
//   {
//     title: "Progress",
//     href: "/docs/primitives/progress",
//     description:
//       "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
//   },
//   {
//     title: "Scroll-area",
//     href: "/docs/primitives/scroll-area",
//     description: "Visually or semantically separates content.",
//   },
//   {
//     title: "Tabs",
//     href: "/docs/primitives/tabs",
//     description:
//       "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
//   },
//   {
//     title: "Tooltip",
//     href: "/docs/primitives/tooltip",
//     description:
//       "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
//   },
// ]

export function NavigationMenuAC() {
  const login = Global_Data.getLogin();
  return (
    <div className="flex justify-between items-center w-full">
    <NavigationMenu  style={{}}>
      <NavigationMenuList  style={{}}>
        <NavigationMenuItem style={{}}>
          <NavigationMenuTrigger style={{}}>Admin</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-96">
              <ListItem style={{}} href="/users" title="Users" />
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
         <NavigationMenuItem style={{}}>
          <NavigationMenuTrigger style={{}}>Lines</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-96">
              <ListItem style={{}} href="/t1" title="T1" />
            </ul>
            <ul className="w-96">
              <ListItem style={{}} href="/t2" title="T2" />
            </ul>
            <ul className="w-96">
              <ListItem style={{}} href="/t3" title="T3" />
            </ul>
            <ul className="w-96">
              <ListItem style={{}} href="/i1" title="I1" />
            </ul>
            <ul className="w-96">
              <ListItem style={{}} href="/dashboard" title="Dashboard" />
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
                 <NavigationMenuItem style={{}}>
          <NavigationMenuTrigger style={{}}>Texnolog</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-96">
              <ListItem style={{}} href="/models" title="Models" />
              <ListItem style={{}} href="/gscode" title="GS Code" />
              <ListItem style={{}} href="/printers" title="Printers" />
              <ListItem style={{}} href="/reprint" title="Re Print" />
              <ListItem style={{}} href="/report" title="Report" />
              <ListItem style={{}} href="/reja" title="Reja" />
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
    <Button variant="ghost"
        onClick={async () => {
          localStorage.removeItem("token")
          await Global_Data.clearUserData()
          window.location.href = "/login"
        }}
        className="px-4 py-2 rounded-lg border hover:bg-gray-100"
      >
        {login} Logout
      </Button>
    </div>
  )
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link to={href}>
          <div >
            <div >{title}</div>
            <div >{children}</div>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}


          // <div className="flex flex-col gap-1 text-sm">
          //   <div className="leading-none font-medium">{title}</div>
          //   <div className="line-clamp-2 text-muted-foreground">{children}</div>
          // </div>