import { Link, useLocation } from "react-router-dom"
import { useAppData } from "../../contexts/AppDataContent"

const navItems = [
  { name: "Dashboard", path: "/admin" },
  { name: "Reports", path: "/admin/reports" },
  { name: "Company Policy", path: "/admin/policy" },
  { name: "Settings", path: "/admin/settings" },
]

export function AdminNavbar() {
  const location = useLocation()
  const { currentUser } = useAppData()

  return (
    <nav className="bg-[#161A34] text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/admin" className="text-2xl font-light">
          ExpenSure Admin
        </Link>
        <div className="flex space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`text-sm font-light transition-colors ${
                location.pathname === item.path ? "text-white" : "text-gray-300 hover:text-white"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-light">{currentUser.name}</span>
          <Link to="/" className="text-sm font-light text-gray-300 hover:text-white transition-colors">
            Exit Admin
          </Link>
        </div>
      </div>
    </nav>
  )
}

