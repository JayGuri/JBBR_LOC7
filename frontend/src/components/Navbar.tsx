import { Link, useNavigate } from "react-router-dom"
import { useAppData } from "../contexts/AppDataContent"

export function Navbar() {
  const { currentUser, logout } = useAppData()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

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
        {currentUser ? (
          <>
            {currentUser.role === "admin" && (
              <Link
                to="/admin"
                className="text-gray-300 hover:text-white transition-colors text-sm font-light tracking-wide"
              >
                Admin
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="text-gray-300 hover:text-white transition-colors text-sm font-light tracking-wide"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="text-gray-300 hover:text-white transition-colors text-sm font-light tracking-wide"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}

