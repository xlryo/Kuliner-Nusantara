"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Search, Menu, X } from "lucide-react"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [theme, setTheme] = useState<"light" | "dark">("light")

  // track the logged in user role for conditional rendering
  const [role, setRole] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark")
    setTheme(isDark ? "dark" : "light")
    // load user role from localStorage on mount
    if (typeof window !== "undefined") {
      try {
        const authUser = JSON.parse(localStorage.getItem("authUser") || "null")
        if (authUser && authUser.userType) {
          setRole(authUser.userType)
        } else if (authUser && authUser.role) {
          // fallback for other naming
          setRole(authUser.role)
        } else {
          setRole(null)
        }
      } catch {
        setRole(null)
      }
    }
  }, [])

  const toggleTheme = () => {
    const html = document.documentElement
    if (theme === "light") {
      html.classList.add("dark")
      setTheme("dark")
    } else {
      html.classList.remove("dark")
      setTheme("light")
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/Logo-Kuliner Nusantara Indonesia.png"
            alt="Kuliner Nusantara Indonesia"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold text-primary">Kuliner Nusantara</h1>
            <p className="text-xs text-muted-foreground">Indonesia</p>
          </div>
        </div>

        <div className="hidden md:flex flex-1 mx-8">
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="Cari kuliner, kota..."
              className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground hidden sm:inline-flex"
          >
            Jelajah
          </Button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-card text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          {/* auth controls */}
          {role ? (
            <div className="flex items-center gap-2">
              {role === "admin" && (
                <Link
                  href="/admin"
                  className="hidden sm:inline-flex px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
                >
                  Dashboard
                </Link>
              )}
              {role === "umkm" && (
                <Link
                  href="/umkm"
                  className="hidden sm:inline-flex px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
                >
                  UMKM
                </Link>
              )}
              {/* logout button */}
              <button
                onClick={() => {
                  // clear user and redirect to landing
                  if (typeof window !== "undefined") {
                    localStorage.removeItem("authUser")
                  }
                  setRole(null)
                  router.push("/")
                }}
                className="px-3 py-2 rounded-lg bg-muted text-foreground hover:bg-muted/70 text-sm font-medium"
              >
                Keluar
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden sm:inline-flex px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
            >
              Login/Daftar
            </Link>
          )}

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-lg hover:bg-card">
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-4 space-y-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari kuliner..."
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <Button variant="ghost" size="sm" className="w-full">
            Jelajah
          </Button>
        </div>
      )}
    </header>
  )
}
