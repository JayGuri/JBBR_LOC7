import { Link } from "react-router-dom"

export function Navbar() {
  return (
    <nav className="flex items-center justify-between px-12 py-6">
      <Link to="/" className="text-white text-2xl font-light">
        ExpanSure
      </Link>
      <div className="flex gap-8">
        {["home", "upload", "dashboard", "contact", "about"].map((item) => (
          <Link
            key={item}
            to={`/${item === "home" ? "" : item}`}
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            {item}
          </Link>
        ))}
      </div>
    </nav>
  )
}

