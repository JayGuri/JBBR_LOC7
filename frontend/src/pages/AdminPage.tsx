import { Routes, Route } from "react-router-dom"
import { AdminNavbar } from "../components/admin/AdminNavbar"
import { AdminDashboard } from "../components/admin/AdminDashboard"
import { AdminReports } from "../components/admin/AdminReports"
import { CompanyPolicyUpload } from "../components/admin/CompanyPolicyUpload"
import { AdminSettings } from "../components/admin/AdminSettings"
import { useAppData } from "../contexts/AppDataContent"
import { Navigate } from "react-router-dom"

export function AdminPage() {
  const { currentUser } = useAppData()

  if (currentUser.role !== "admin") {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/reports" element={<AdminReports />} />
          <Route path="/policy" element={<CompanyPolicyUpload />} />
          <Route path="/settings" element={<AdminSettings />} />
        </Routes>
      </div>
    </div>
  )
}

