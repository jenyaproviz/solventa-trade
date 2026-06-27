export default function Footer() {
  const socialLinks = [
    {
      name: "Facebook",
      icon: "facebook",
      url: "https://facebook.com",
      ariaLabel: "Follow us on Facebook",
    },
    {
      name: "YouTube",
      icon: "youtube",
      url: "https://youtube.com",
      ariaLabel: "Subscribe on YouTube",
    },
    {
      name: "LinkedIn",
      icon: "linkedin",
      url: "https://linkedin.com",
      ariaLabel: "Connect on LinkedIn",
    },
    {
      name: "X",
      icon: "x",
      url: "https://x.com",
      ariaLabel: "Follow us on X",
    },
  ]

  return (
    <footer className="sv-footer mt-6 border-t border-[#d8e5f4] bg-gradient-to-r from-white via-[#f7faff] to-[#fff6ed]">
      <div className="mx-auto w-full max-w-[100rem] px-1 py-4 md:px-2 md:py-5 lg:px-3">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Left Side - Logo */}
          <div className="flex-shrink-0">
            <span className="sv-brand-logo-wrap relative inline-block h-8 w-[120px] md:h-10 md:w-[150px]">
              <img
                src="/logo.jpg"
                alt="Solventa logo"
                className="sv-brand-logo-base absolute inset-0 h-full w-full object-contain"
              />
              <img
                src="/logo.jpg"
                alt=""
                aria-hidden="true"
                className="sv-brand-logo-text absolute inset-0 h-full w-full object-contain"
              />
            </span>
          </div>

          {/* Center - Social Media Icons */}
          <div className="flex gap-3 md:gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.ariaLabel}
                className="text-slate-600 transition-colors hover:text-orange-500"
              >
                <svg
                  className="h-4 w-4 md:h-5 md:w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  {link.icon === "facebook" && (
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  )}
                  {link.icon === "youtube" && (
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  )}
                  {link.icon === "linkedin" && (
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                  )}
                  {link.icon === "x" && (
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.207-6.802-5.974 6.802H2.306l7.644-8.74-8.179-10.76h6.844l4.701 6.202 5.523-6.202zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  )}
                </svg>
              </a>
            ))}
          </div>

          {/* Right Side - Credit & Copyright */}
          <div className="flex flex-col items-center gap-1 text-center md:items-end md:text-right">
            <div className="flex items-center gap-1 text-xs text-slate-600">
              <span>Designed & Developed by</span>
              <a
                href="#"
                className="flex items-center gap-0.5 font-semibold text-orange-500 hover:text-orange-600 transition-colors"
              >
                <span>Jenya</span>
                <img
                  src="/logoJenya.jpg"
                  alt="Jenya logo"
                  className="h-3 w-auto object-contain"
                />
              </a>
            </div>
            <p className="text-xs text-slate-600">&copy; {new Date().getFullYear()} SolventaEOOD. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
