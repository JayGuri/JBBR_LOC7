import { Link } from "react-router-dom"

export function Navbar() {
  return (
    <nav className="flex items-center justify-between px-12 py-6 bg-[#161A34]">
      <Link to="/" className="text-white text-2xl tracking-wide font-light">
        ExpenSure
      </Link>
      <div className="flex gap-8">
        {["home", "upload", "reports", "contact"].map((item) => (
          <Link
            key={item}
            to={`/${item === "home" ? "" : item}`}
            className="text-gray-300 hover:text-white transition-colors text-sm font-light tracking-wide"
          >
            {item}
          </Link>
        ))}
        <Link to="/admin" className="text-gray-300 hover:text-white transition-colors text-sm font-light tracking-wide">
          Access as Admin
        </Link>
      </div>
    </nav>
  )
}

