"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Input } from "../ui/input"
import { Search } from "lucide-react"
import { EmployeeReportDetails } from "./EmployeeReportDetails"
import { useAppData } from "../../contexts/AppDataContent"

export function AdminReports() {
  const { users, reports } = useAppData()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null)

  const employeesWithPendingReports = users.map((user) => ({
    ...user,
    pendingReports: reports.filter((report) => report.userId === user.id && report.status === "pending").length,
  }))

  const filteredEmployees = employeesWithPendingReports.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleViewReports = (employeeId: string) => {
    setSelectedEmployee(employeeId)
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold text-gray-800">Employee Reports</h1>
      {selectedEmployee ? (
        <EmployeeReportDetails employeeId={selectedEmployee} onBack={() => setSelectedEmployee(null)} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Pending Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-white"
                />
              </div>
            </div>
            <ul className="space-y-4">
              {filteredEmployees.map((employee) => (
                <li key={employee.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                  <div>
                    <h3 className="font-semibold">{employee.name}</h3>
                    <p className="text-sm text-gray-500">{employee.pendingReports} pending reports</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{employee.pendingReports} Pending</Badge>
                    <Button variant="outline" className="text-white" onClick={() => handleViewReports(employee.id)}>
                      View Reports
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

