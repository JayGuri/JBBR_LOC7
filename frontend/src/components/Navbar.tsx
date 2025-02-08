import { Link } from "react-router-dom"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-[#161A34] px-6 md:px-12 py-4 shadow-lg">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-white text-3xl font-semibold tracking-wide">
          ExpenSure
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-10">
          {["home", "upload", "reports", "contact"].map((item) => (
            <Link
              key={item}
              to={`/${item === "home" ? "" : item}`}
              className="text-gray-300 hover:text-white transition-all text-base font-light tracking-wide relative"
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
              <span className="block h-[2px] w-0 bg-white transition-all duration-300 hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col items-center gap-6 mt-4 bg-[#1F233F] p-6 rounded-lg">
          {["home", "upload", "reports", "contact"].map((item) => (
            <Link
              key={item}
              to={`/${item === "home" ? "" : item}`}
              className="text-gray-300 hover:text-white transition-all text-lg font-light tracking-wide"
              onClick={() => setIsOpen(false)}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
