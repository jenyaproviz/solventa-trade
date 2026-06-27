import { useEffect, useState } from "react"
import { Menu, MoonStar, SunMedium, X } from "lucide-react"
import { NavLink, useNavigate } from "react-router-dom"
import Button from "../ui/Button"
import {
  AUTH_CHANGED_EVENT,
  getStoredAdminUser,
  logoutAdmin,
  type AdminUser,
} from "../../services/authService"

const THEME_STORAGE_KEY = "solventa_theme"

const navItems = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/blog", label: "Blog" },
  { to: "/reviews", label: "Reviews" },
  { to: "/contact", label: "Contact" },
]

export default function Navbar() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
    if (savedTheme === "dark" || savedTheme === "light") return savedTheme
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  })
  const [admin, setAdmin] = useState<AdminUser | null>(getStoredAdminUser())
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  useEffect(() => {
    const syncAuthState = () => setAdmin(getStoredAdminUser())
    window.addEventListener("storage", syncAuthState)
    window.addEventListener(AUTH_CHANGED_EVENT, syncAuthState)
    return () => {
      window.removeEventListener("storage", syncAuthState)
      window.removeEventListener(AUTH_CHANGED_EVENT, syncAuthState)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [menuOpen])

  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"))
  }

  function closeMenu() {
    setMenuOpen(false)
  }

  async function handleLogout() {
    await logoutAdmin()
    closeMenu()
    navigate("/admin/login", { replace: true })
  }

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "rounded-md px-4 py-3 text-xl font-semibold transition-all duration-300",
      isActive
        ? "bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-[0_6px_16px_rgba(249,115,22,0.32)]"
        : "text-[#27415f] hover:bg-[#edf4ff] hover:text-[#0c3b67]",
    ].join(" ")

  const desktopLinkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "rounded-md px-4 py-2 text-lg font-semibold transition-all duration-300 md:text-xl",
      isActive
        ? "bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-[0_6px_16px_rgba(249,115,22,0.32)]"
        : "text-[#27415f] hover:bg-[#edf4ff] hover:text-[#0c3b67]",
    ].join(" ")

  return (
    <header className="sv-navbar sticky top-0 z-50 border-b border-[#d8e5f4] bg-white/80 shadow-[0_2px_14px_rgba(12,59,103,0.06)] backdrop-blur-md">
      <div className="mx-auto w-full max-w-[100rem] px-4 py-4 md:px-2 lg:px-3">

        {/* ── Mobile top bar ── */}
        <div className="flex items-center justify-between md:hidden">
          <NavLink to="/" className="inline-flex items-center" end onClick={closeMenu}>
            <span className="relative inline-block h-14 w-[200px]">
              <img src="/logo.jpg" alt="Solventa logo" className="absolute inset-0 h-full w-full object-contain" />
            </span>
          </NavLink>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              onClick={toggleTheme}
              width={40}
              height={40}
              variant="ghost"
              className="rounded-md bg-transparent !px-0 !py-0 text-[#27415f]"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <SunMedium className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
            </Button>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="rounded-md p-2 text-[#27415f] hover:bg-[#edf4ff]"
              aria-label="Toggle navigation menu"
            >
              {menuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>

        {/* ── Desktop nav ── */}
        <div className="hidden md:flex md:items-center md:justify-between">
          <NavLink to="/" className="inline-flex items-center gap-3" end>
            <span className="sv-brand-logo-wrap relative inline-block h-16 w-[240px] md:h-20 md:w-[300px]">
              <img src="/logo.jpg" alt="Solventa logo" className="sv-brand-logo-base absolute inset-0 h-full w-full object-contain" />
              <img src="/logo.jpg" alt="" aria-hidden="true" className="sv-brand-logo-text absolute inset-0 h-full w-full object-contain" />
            </span>
          </NavLink>
          <nav className="flex flex-wrap items-center gap-3 md:justify-end">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={desktopLinkClass} end={item.to === "/"}>
                {item.label}
              </NavLink>
            ))}
            {admin ? (
              <div className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white/70 px-3 py-1.5">
                {admin.role === "admin" && (
                  <NavLink to="/admin/dashboard" className={desktopLinkClass}>
                    Admin Dashboard
                  </NavLink>
                )}
                <span className="max-w-[180px] truncate text-sm font-semibold text-[#27415f]" title={admin.email}>
                  {admin.displayName || admin.email}
                </span>
                <Button type="button" variant="ghost" onClick={handleLogout} className="h-8 rounded-md !px-3 !py-1 text-xs">
                  Logout
                </Button>
              </div>
            ) : (
              <Button type="button" variant="ghost" onClick={() => navigate("/admin/login")} className="rounded-md !px-4 !py-2 text-base font-semibold md:text-lg">
                Login
              </Button>
            )}
            <Button
              type="button"
              onClick={toggleTheme}
              width={44}
              height={44}
              variant="ghost"
              className="theme-toggle rounded-md bg-transparent !px-0 !py-0 text-[#27415f] hover:text-[#0c3b67]"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              title={theme === "dark" ? "Light mode" : "Dark mode"}
            >
              {theme === "dark" ? <SunMedium className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
            </Button>
          </nav>
        </div>
      </div>

      {/* ── Mobile full-screen overlay menu ── */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col overflow-y-auto bg-white px-6 pb-10 pt-5 md:hidden">
          {/* Header row inside overlay */}
          <div className="flex items-center justify-between mb-8">
            <NavLink to="/" className="inline-flex items-center" end onClick={closeMenu}>
              <span className="relative inline-block h-14 w-[200px]">
                <img src="/logo.jpg" alt="Solventa logo" className="absolute inset-0 h-full w-full object-contain" />
              </span>
            </NavLink>
            <button
              onClick={closeMenu}
              className="rounded-md p-2 text-[#27415f] hover:bg-[#edf4ff]"
              aria-label="Close menu"
            >
              <X className="h-7 w-7" />
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={mobileLinkClass}
                end={item.to === "/"}
                onClick={closeMenu}
              >
                {item.label}
              </NavLink>
            ))}

            {admin ? (
              <>
                {admin.role === "admin" && (
                  <NavLink to="/admin/dashboard" className={mobileLinkClass} onClick={closeMenu}>
                    Admin Dashboard
                  </NavLink>
                )}
                <div className="mt-2 flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
                  <span className="truncate text-sm font-semibold text-[#27415f]">{admin.displayName || admin.email}</span>
                  <Button type="button" variant="ghost" onClick={handleLogout} className="h-8 rounded-md !px-3 !py-1 text-xs">
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <button
                onClick={() => { navigate("/admin/login"); closeMenu() }}
                className="rounded-md px-4 py-3 text-left text-xl font-semibold text-[#27415f] hover:bg-[#edf4ff] hover:text-[#0c3b67]"
              >
                Login
              </button>
            )}
          </nav>

          {/* Theme toggle */}
          <div className="mt-auto flex items-center gap-3 pt-8 border-t border-slate-100">
            <Button
              type="button"
              onClick={toggleTheme}
              width={44}
              height={44}
              variant="ghost"
              className="rounded-md bg-transparent !px-0 !py-0 text-[#27415f]"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <SunMedium className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
            </Button>
            <span className="text-sm text-slate-500">{theme === "dark" ? "Light mode" : "Dark mode"}</span>
          </div>
        </div>
      )}
    </header>
  )
}
