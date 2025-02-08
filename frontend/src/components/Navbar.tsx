import { Link } from "react-router-dom"
import { useAppData } from "../contexts/AppDataContent"

export function Navbar() {
  const { currentUser } = useAppData()

  return (
    <nav className="flex items-center justify-between px-12 py-6 bg-[#161A34]">
      <Link to="/" className="text-white text-2xl tracking-wide font-light">
        ExpenSure
      </Link>
      <div className="flex gap-8">
        {["home", "upload", "reports"].map((item) => (
          <Link
            key={item}
            to={`/${item === "home" ? "" : item}`}
            className="text-gray-300 hover:text-white transition-colors text-sm font-light tracking-wide"
          >
            {item}
          </Link>
        ))}
        {currentUser.role === "admin" && (
          <Link
            to="/admin"
            className="text-gray-300 hover:text-white transition-colors text-sm font-light tracking-wide"
          >
            Admin
          </Link>
        )}
      </div>
    </nav>
  )
}

