import { useState } from "react"
import { Navbar } from "../components/Navbar"
import { AdminDashboard } from "../components/admin/AdminDashboard"
import { EmployeeReports } from "../components/admin/EmployeeReports"
import { CompanyPolicyUpload } from "../components/admin/CompanyPolicyUpload"

export function AdminPage() {
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-[#ffffff]">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-normal mb-8 text-[#000000] font-['Space_Grotesk']">Admin Dashboard</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {selectedEmployee ? (
              <EmployeeReports employeeId={selectedEmployee} onBack={() => setSelectedEmployee(null)} />
            ) : (
              <AdminDashboard onSelectEmployee={setSelectedEmployee} />
            )}
          </div>
          <div>
            <CompanyPolicyUpload />
          </div>
        </div>
      </div>
    </div>
  )
}

