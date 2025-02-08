import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface AdminDashboardProps {
  onSelectEmployee: (employeeId: string) => void
}

const dummyData = [
  { category: "Food & Beverages", amount: 5000 },
  { category: "Travel", amount: 8000 },
  { category: "Office Supplies", amount: 3000 },
  { category: "Equipment", amount: 6000 },
  { category: "Miscellaneous", amount: 2000 },
]

const dummyEmployees = [
  { id: "1", name: "John Doe", pendingReports: 3 },
  { id: "2", name: "Jane Smith", pendingReports: 2 },
  { id: "3", name: "Mike Johnson", pendingReports: 1 },
]

export function AdminDashboard({ onSelectEmployee }: AdminDashboardProps) {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Expense Categories Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dummyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#161a34" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Employees with Pending Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {dummyEmployees.map((employee) => (
              <li key={employee.id} className="flex items-center justify-between">
                <span>
                  {employee.name} ({employee.pendingReports} pending)
                </span>
                <Button onClick={() => onSelectEmployee(employee.id)}>View Reports</Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

